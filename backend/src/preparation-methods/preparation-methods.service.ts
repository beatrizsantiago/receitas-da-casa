import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreatePreparationMethodDto } from './dto/create-preparation-method.dto';
import { UpdatePreparationMethodDto } from './dto/update-preparation-method.dto';

@Injectable()
export class PreparationMethodsService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(userId: number, recipeId: number, dto: CreatePreparationMethodDto) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.preparationMethod.create({ data: { ...dto, recipeId } });
  }

  async findAll(userId: number, recipeId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.preparationMethod.findMany({
      where: { recipeId },
      orderBy: { order: 'asc' },
      include: { steps: { orderBy: { order: 'asc' } } },
    });
  }

  async update(userId: number, id: number, dto: UpdatePreparationMethodDto) {
    const method = await this.findMethod(id);
    await this.recipes.findOne(userId, method.recipeId);
    return this.prisma.preparationMethod.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const method = await this.findMethod(id);
    await this.recipes.findOne(userId, method.recipeId);
    return this.prisma.preparationMethod.delete({ where: { id } });
  }

  async findMethod(id: number) {
    const method = await this.prisma.preparationMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundException('Modo de preparo não encontrado');
    return method;
  }
}
