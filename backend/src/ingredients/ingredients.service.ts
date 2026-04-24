import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(userId: number, recipeId: number, dto: CreateIngredientDto) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.ingredient.create({ data: { ...dto, recipeId } });
  }

  async findAll(userId: number, recipeId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.ingredient.findMany({ where: { recipeId }, orderBy: { order: 'asc' } });
  }

  async update(userId: number, id: number, dto: UpdateIngredientDto) {
    const ingredient = await this.findIngredient(id);
    await this.recipes.findOne(userId, ingredient.recipeId);
    return this.prisma.ingredient.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const ingredient = await this.findIngredient(id);
    await this.recipes.findOne(userId, ingredient.recipeId);
    return this.prisma.ingredient.delete({ where: { id } });
  }

  private async findIngredient(id: number) {
    const ingredient = await this.prisma.ingredient.findUnique({ where: { id } });
    if (!ingredient) throw new NotFoundException('Ingrediente não encontrado');
    return ingredient;
  }
}
