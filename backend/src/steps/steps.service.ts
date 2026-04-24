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

  async create(userId: number, recipeId: number, dto: CreateStepDto) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.step.create({ data: { ...dto, recipeId } });
  }

  async findAll(userId: number, recipeId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.step.findMany({
      where: { recipeId },
      orderBy: { order: 'asc' },
    });
  }

  async update(userId: number, id: number, dto: UpdateStepDto) {
    const step = await this.findStep(id);
    await this.recipes.findOne(userId, step.recipeId);
    return this.prisma.step.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const step = await this.findStep(id);
    await this.recipes.findOne(userId, step.recipeId);
    return this.prisma.step.delete({ where: { id } });
  }

  private async findStep(id: number) {
    const step = await this.prisma.step.findUnique({ where: { id } });
    if (!step) throw new NotFoundException('Passo não encontrado');
    return step;
  }
}
