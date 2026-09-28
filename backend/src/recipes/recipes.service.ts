import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { FilterRecipesDto } from './dto/filter-recipes.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

function mapRecipe<
  T extends {
    id: number;
    _count: { cookHistory: number };
    cookHistory: { date: Date }[];
  },
>(recipe: T) {
  return {
    ...recipe,
    cooks: recipe._count.cookHistory,
    lastCooked: recipe.cookHistory[0]?.date ?? null,
  };
}

const listInclude = {
  tags: { include: { tag: true } },
  photos: { where: { type: 'COVER' } },
  _count: { select: { cookHistory: true } },
  cookHistory: { orderBy: { date: 'desc' }, take: 1 },
} satisfies Prisma.RecipeInclude;

// Mesma normalização do unaccent(lower(...)) usado no SQL
function tokenize(query: string): string[] {
  return query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 10);
}

function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, '\\$&');
}

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  create(dto: CreateRecipeDto) {
    return this.prisma.recipe.create({ data: dto });
  }

  async findAll(filter: FilterRecipesDto) {
    const terms = tokenize(filter.q ?? '');

    let total: number;
    let data: Prisma.RecipeGetPayload<{ include: typeof listInclude }>[];

    if (terms.length > 0) {
      const page = await this.searchPage(terms, filter);
      total = page.total;
      const rows = await this.prisma.recipe.findMany({
        where: { id: { in: page.ids } },
        include: listInclude,
      });
      // findMany não preserva a ordem do IN: reaplica a ordem de relevância
      const byId = new Map(rows.map((r) => [r.id, r]));
      data = page.ids.flatMap((id) => byId.get(id) ?? []);
    } else {
      const where: Prisma.RecipeWhereInput = {
        deletedAt: null,
        ...(filter.category && { category: filter.category }),
        ...(filter.tags?.length && {
          AND: filter.tags.map((name) => ({
            tags: { some: { tag: { name } } },
          })),
        }),
      };
      [data, total] = await this.prisma.$transaction([
        this.prisma.recipe.findMany({
          where,
          skip: filter.skip,
          take: filter.limit,
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          include: listInclude,
        }),
        this.prisma.recipe.count({ where }),
      ]);
    }

    return {
      data: data.map(mapRecipe),
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        lastPage: Math.ceil(total / filter.limit),
      },
    };
  }

  // Busca em uma única consulta: filtra (categoria/tags), exige que todos os
  // termos apareçam em título, tags, ingredientes ou descrição (sem diferenciar
  // acentos), ordena por relevância e devolve só os ids da página + o total.
  // Pontuação: cada termo vale o peso do melhor campo onde aparece, em dobro
  // quando começa uma palavra.
  private async searchPage(
    terms: string[],
    filter: FilterRecipesDto,
  ): Promise<{ ids: number[]; total: number }> {
    const fields: [Prisma.Sql, number][] = [
      [Prisma.raw('title'), 10],
      [Prisma.raw('tags'), 5],
      [Prisma.raw('ingredients'), 3],
      [Prisma.raw('description'), 2],
    ];

    const termColumns = terms.map((term, i) => {
      const t = escapeLike(term);
      const cases = fields.map(
        ([col, weight]) => Prisma.sql`CASE
          WHEN ${col} LIKE ${t + '%'} OR ${col} LIKE ${'% ' + t + '%'} THEN ${weight * 2}
          WHEN ${col} LIKE ${'%' + t + '%'} THEN ${weight}
          ELSE 0 END`,
      );
      return Prisma.sql`GREATEST(${Prisma.join(cases)}) AS ${Prisma.raw(`t${i}`)}`;
    });
    const aliases = terms.map((_, i) => Prisma.raw(`t${i}`));

    const filters: Prisma.Sql[] = [Prisma.sql`r."deletedAt" IS NULL`];
    if (filter.category) {
      filters.push(
        Prisma.sql`r.category = ${filter.category}::"RecipeCategory"`,
      );
    }
    for (const name of filter.tags ?? []) {
      filters.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "RecipeTag" rt JOIN "Tag" t ON t.id = rt."tagId"
        WHERE rt."recipeId" = r.id AND t.name = ${name}
      )`);
    }

    // docs é MATERIALIZED para que unaccent(lower(...)) rode uma vez por
    // receita, e não uma vez para cada LIKE que referencia a coluna.
    const [row] = await this.prisma.$queryRaw<
      { total: number; ids: number[] }[]
    >`
      WITH tag_text AS (
        SELECT rt."recipeId", string_agg(t.name, ' ') AS txt
        FROM "RecipeTag" rt JOIN "Tag" t ON t.id = rt."tagId"
        GROUP BY rt."recipeId"
      ),
      ingredient_text AS (
        SELECT g."recipeId", string_agg(i.name, ' ') AS txt
        FROM "IngredientGroup" g
        JOIN "Ingredient" i ON i."ingredientGroupId" = g.id
        GROUP BY g."recipeId"
      ),
      docs AS MATERIALIZED (
        SELECT r.id, r."createdAt",
          unaccent(lower(r.title)) AS title,
          unaccent(lower(coalesce(r.description, ''))) AS description,
          unaccent(lower(coalesce(tt.txt, ''))) AS tags,
          unaccent(lower(coalesce(it.txt, ''))) AS ingredients
        FROM "Recipe" r
        LEFT JOIN tag_text tt ON tt."recipeId" = r.id
        LEFT JOIN ingredient_text it ON it."recipeId" = r.id
        WHERE ${Prisma.join(filters, ' AND ')}
      ),
      scored AS (
        SELECT id, "createdAt", ${Prisma.join(aliases, ' + ')} AS score
        FROM (SELECT id, "createdAt", ${Prisma.join(termColumns)} FROM docs) s
        WHERE ${Prisma.join(
          aliases.map((a) => Prisma.sql`${a} > 0`),
          ' AND ',
        )}
      ),
      page AS (
        SELECT id, score, "createdAt" FROM scored
        ORDER BY score DESC, "createdAt" DESC, id DESC
        LIMIT ${filter.limit} OFFSET ${filter.skip}
      )
      SELECT
        (SELECT count(*)::int FROM scored) AS total,
        (SELECT coalesce(array_agg(id ORDER BY score DESC, "createdAt" DESC, id DESC), '{}')
         FROM page) AS ids
    `;

    return row;
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, deletedAt: null },
      include: {
        tags: { include: { tag: true } },
        ingredientGroups: {
          orderBy: { order: 'asc' },
          include: { ingredients: { orderBy: { order: 'asc' } } },
        },
        preparationMethods: {
          orderBy: { order: 'asc' },
          include: { steps: { orderBy: { order: 'asc' } } },
        },
        notes: { orderBy: { createdAt: 'desc' } },
        photos: true,
        cookHistory: { orderBy: { date: 'desc' } },
        _count: { select: { cookHistory: true } },
      },
    });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return mapRecipe(recipe);
  }

  async update(id: number, dto: UpdateRecipeDto) {
    await this.findOne(id);
    return this.prisma.recipe.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    for (const photo of recipe.photos) {
      await this.storage.deleteFile(photo.url);
    }
    return this.prisma.recipe.delete({ where: { id } });
  }
}
