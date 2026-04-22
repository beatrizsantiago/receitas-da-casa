import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { AddTagDto } from './dto/add-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async addToRecipe(userId: number, recipeId: number, dto: AddTagDto) {
    await this.recipes.findOne(userId, recipeId);

    const tag = await this.prisma.tag.upsert({
      where: { name: dto.name },
      create: { name: dto.name, color: dto.color },
      update: {},
    });

    return this.prisma.recipeTag.upsert({
      where: { recipeId_tagId: { recipeId, tagId: tag.id } },
      create: { recipeId, tagId: tag.id },
      update: {},
    });
  }

  async removeFromRecipe(userId: number, recipeId: number, tagId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.recipeTag.delete({
      where: { recipeId_tagId: { recipeId, tagId } },
    });
  }
}
