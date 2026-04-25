import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterRecipesDto } from '../recipes/dto/filter-recipes.dto';

@Injectable()
export class PublicRecipesService {
  constructor(private readonly prisma: PrismaService) {}

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
        select: {
          id: true,
          title: true,
          category: true,
          tags: {
            select: { tag: { select: { id: true, name: true, color: true } } },
          },
          photos: {
            where: { type: 'COVER' },
            select: { url: true, positionY: true },
          },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      data,
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
      select: {
        id: true,
        title: true,
        photos: {
          where: { type: 'COVER' },
          select: { url: true, positionY: true },
        },
        ingredients: {
          select: { id: true, name: true, quantity: true, unit: true, order: true },
          orderBy: { order: 'asc' },
        },
        steps: {
          select: { id: true, description: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!recipe) throw new NotFoundException('Receita não encontrada');
    return recipe;
  }
}
