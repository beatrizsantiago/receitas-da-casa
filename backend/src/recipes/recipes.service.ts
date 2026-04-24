import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { FilterRecipesDto } from './dto/filter-recipes.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

function mapRecipe<T extends { id: number; _count: { cookHistory: number }; cookHistory: { date: Date }[] }>(recipe: T) {
  return {
    ...recipe,
    cooks: recipe._count.cookHistory,
    lastCooked: recipe.cookHistory[0]?.date ?? null,
  };
}

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, dto: CreateRecipeDto) {
    return this.prisma.recipe.create({ data: { ...dto, userId } });
  }

  async findAll(userId: number, filter: FilterRecipesDto) {
    const where = {
      userId,
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

  async findOne(userId: number, id: number) {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        tags: { include: { tag: true } },
        ingredients: true,
        steps: { orderBy: { order: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
        photos: true,
        cookHistory: { orderBy: { date: 'desc' } },
        _count: { select: { cookHistory: true } },
      },
    });
    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return mapRecipe(recipe);
  }

  async update(userId: number, id: number, dto: UpdateRecipeDto) {
    await this.findOne(userId, id);
    return this.prisma.recipe.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.recipe.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
