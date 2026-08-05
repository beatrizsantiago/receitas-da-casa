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

  async create(recipeId: number, dto: CreateRecipeNoteDto) {
    await this.recipes.findOne(recipeId);
    return this.prisma.recipeNote.create({ data: { ...dto, recipeId } });
  }

  async findAll(recipeId: number) {
    await this.recipes.findOne(recipeId);
    return this.prisma.recipeNote.findMany({
      where: { recipeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, dto: UpdateRecipeNoteDto) {
    const note = await this.findNote(id);
    await this.recipes.findOne(note.recipeId);
    return this.prisma.recipeNote.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const note = await this.findNote(id);
    await this.recipes.findOne(note.recipeId);
    return this.prisma.recipeNote.delete({ where: { id } });
  }

  private async findNote(id: number) {
    const note = await this.prisma.recipeNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Anotação não encontrada');
    return note;
  }
}
