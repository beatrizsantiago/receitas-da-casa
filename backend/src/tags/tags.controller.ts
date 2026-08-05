import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddTagDto } from './dto/add-tag.dto';
import { LinkTagDto } from './dto/link-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@ApiBearerAuth('access-token')
@Controller()
export class TagsController {
  constructor(private tags: TagsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Listar todas as tags disponíveis' })
  findAll() {
    return this.tags.findAll();
  }

  @Post('tags')
  @ApiOperation({ summary: 'Criar uma nova tag global' })
  createTag(@Body() dto: AddTagDto) {
    return this.tags.createTag(dto);
  }

  @Post('recipes/:recipeId/tags')
  @ApiOperation({ summary: 'Vincular uma tag global a uma receita' })
  addToRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: LinkTagDto,
  ) {
    return this.tags.addToRecipe(recipeId, dto.tagId);
  }

  @Delete('recipes/:recipeId/tags/:tagId')
  @ApiOperation({ summary: 'Remover tag de uma receita' })
  removeFromRecipe(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.tags.removeFromRecipe(recipeId, tagId);
  }

  @Delete('tags/:id')
  @ApiOperation({ summary: 'Deletar uma tag (apenas se não estiver em uso)' })
  removeTag(@Param('id', ParseIntPipe) id: number) {
    return this.tags.removeTag(id);
  }
}
