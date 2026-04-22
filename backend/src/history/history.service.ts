import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateCookHistoryDto } from './dto/create-cook-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(userId: number, recipeId: number, dto: CreateCookHistoryDto) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.cookHistory.create({
      data: { ...dto, recipeId, date: dto.date ?? new Date() },
    });
  }

  async findAll(userId: number, recipeId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.cookHistory.findMany({
      where: { recipeId },
      orderBy: { date: 'desc' },
    });
  }
}
