import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class StepsService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(userId: number, preparationMethodId: number, dto: CreateStepDto) {
    const method = await this.findMethod(preparationMethodId);
    await this.recipes.findOne(userId, method.recipeId);
    const count = await this.prisma.step.count({ where: { preparationMethodId } });
    return this.prisma.step.create({ data: { ...dto, preparationMethodId, order: count + 1 } });
  }

  async findAll(userId: number, preparationMethodId: number) {
    const method = await this.findMethod(preparationMethodId);
    await this.recipes.findOne(userId, method.recipeId);
    return this.prisma.step.findMany({
      where: { preparationMethodId },
      orderBy: { order: 'asc' },
    });
  }

  async update(userId: number, id: number, dto: UpdateStepDto) {
    const step = await this.findStep(id);
    const method = await this.findMethod(step.preparationMethodId);
    await this.recipes.findOne(userId, method.recipeId);
    return this.prisma.step.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const step = await this.findStep(id);
    const method = await this.findMethod(step.preparationMethodId);
    await this.recipes.findOne(userId, method.recipeId);
    return this.prisma.step.delete({ where: { id } });
  }

  private async findStep(id: number) {
    const step = await this.prisma.step.findUnique({ where: { id } });
    if (!step) throw new NotFoundException('Passo não encontrado');
    return step;
  }

  private async findMethod(id: number) {
    const method = await this.prisma.preparationMethod.findUnique({ where: { id } });
    if (!method) throw new NotFoundException('Modo de preparo não encontrado');
    return method;
  }
}
