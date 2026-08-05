import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRecipeNoteDto } from './dto/create-recipe-note.dto';
import { UpdateRecipeNoteDto } from './dto/update-recipe-note.dto';
import { RecipeNotesService } from './recipe-notes.service';

@ApiTags('recipe-notes')
@ApiBearerAuth('access-token')
@Controller()
export class RecipeNotesController {
  constructor(private notes: RecipeNotesService) {}

  @Post('recipes/:recipeId/notes')
  @ApiOperation({ summary: 'Adicionar nota a uma receita' })
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: CreateRecipeNoteDto,
  ) {
    return this.notes.create(recipeId, dto);
  }

  @Get('recipes/:recipeId/notes')
  @ApiOperation({ summary: 'Listar notas de uma receita' })
  findAll(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.notes.findAll(recipeId);
  }

  @Patch('notes/:id')
  @ApiOperation({ summary: 'Atualizar nota' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeNoteDto) {
    return this.notes.update(id, dto);
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Deletar nota' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notes.remove(id);
  }
}
