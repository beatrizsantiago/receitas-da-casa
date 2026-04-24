import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipesService } from '../recipes/recipes.service';
import { CreateRecipeNoteDto } from './dto/create-recipe-note.dto';
import { UpdateRecipeNoteDto } from './dto/update-recipe-note.dto';

@Injectable()
export class RecipeNotesService {
  constructor(
    private prisma: PrismaService,
    private recipes: RecipesService,
  ) {}

  async create(userId: number, recipeId: number, dto: CreateRecipeNoteDto) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.recipeNote.create({ data: { ...dto, recipeId } });
  }

  async findAll(userId: number, recipeId: number) {
    await this.recipes.findOne(userId, recipeId);
    return this.prisma.recipeNote.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: number, id: number, dto: UpdateRecipeNoteDto) {
    const note = await this.findNote(id);
    await this.recipes.findOne(userId, note.recipeId);
    return this.prisma.recipeNote.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const note = await this.findNote(id);
    await this.recipes.findOne(userId, note.recipeId);
    return this.prisma.recipeNote.delete({ where: { id } });
  }

  private async findNote(id: number) {
    const note = await this.prisma.recipeNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Anotação não encontrada');
    return note;
  }
}
