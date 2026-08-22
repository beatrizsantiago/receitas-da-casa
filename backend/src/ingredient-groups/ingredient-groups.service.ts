import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateIngredientGroupDto } from './dto/create-ingredient-group.dto';
import { UpdateIngredientGroupDto } from './dto/update-ingredient-group.dto';

@Injectable()
export class IngredientGroupsService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(recipeId: number, dto: CreateIngredientGroupDto) {
    await this.recipes.findOne(recipeId);
    return this.prisma.ingredientGroup.create({ data: { ...dto, recipeId } });
  }

  async findAll(recipeId: number) {
    await this.recipes.findOne(recipeId);
    return this.prisma.ingredientGroup.findMany({
      where: { recipeId },
      orderBy: { order: 'asc' },
      include: { ingredients: { orderBy: { order: 'asc' } } },
    });
  }

  async update(id: number, dto: UpdateIngredientGroupDto) {
    const group = await this.findGroup(id);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredientGroup.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const group = await this.findGroup(id);
    await this.recipes.findOne(group.recipeId);
    return this.prisma.ingredientGroup.delete({ where: { id } });
  }

  async findGroup(id: number) {
    const group = await this.prisma.ingredientGroup.findUnique({
      where: { id },
    });
    if (!group)
      throw new NotFoundException('Grupo de ingredientes não encontrado');
    return group;
  }
}
