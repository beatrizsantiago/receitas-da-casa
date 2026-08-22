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

  async create(ingredientGroupId: number, dto: CreateIngredientDto) {
    const group = await this.findGroup(ingredientGroupId);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredient.create({
      data: { ...dto, ingredientGroupId },
    });
  }

  async findAll(ingredientGroupId: number) {
    const group = await this.findGroup(ingredientGroupId);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredient.findMany({
      where: { ingredientGroupId },
      orderBy: { order: 'asc' },
    });
  }

  async update(id: number, dto: UpdateIngredientDto) {
    const ingredient = await this.findIngredient(id);
    const group = await this.findGroup(ingredient.ingredientGroupId);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredient.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const ingredient = await this.findIngredient(id);
    const group = await this.findGroup(ingredient.ingredientGroupId);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredient.delete({ where: { id } });
  }

  private async findIngredient(id: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });
    if (!ingredient) throw new NotFoundException('Ingrediente não encontrado');
    return ingredient;
  }

  private async findGroup(id: number) {
    const group = await this.prisma.ingredientGroup.findUnique({
      where: { id },
    });
    if (!group)
      throw new NotFoundException('Grupo de ingredientes não encontrado');
    return group;
  }
}
