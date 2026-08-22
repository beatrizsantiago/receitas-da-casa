import { Injectable, NotFoundException } from '@nestjs/common';
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
    const where = {
      deletedAt: null,
      ...(filter.category && { category: filter.category }),
      ...(filter.tags?.length && {
        tags: { some: { tag: { name: { in: filter.tags } } } },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.recipe.findMany({
        where,
        skip: filter.skip,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          tags: { include: { tag: true } },
          photos: { where: { type: 'COVER' } },
          _count: { select: { cookHistory: true } },
          cookHistory: { orderBy: { date: 'desc' }, take: 1 },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

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
