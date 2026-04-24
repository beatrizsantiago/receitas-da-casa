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
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
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
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: LinkTagDto,
  ) {
    return this.tags.addToRecipe(user.sub, recipeId, dto.tagId);
  }

  @Delete('recipes/:recipeId/tags/:tagId')
  @ApiOperation({ summary: 'Remover tag de uma receita' })
  removeFromRecipe(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.tags.removeFromRecipe(user.sub, recipeId, tagId);
  }

  @Delete('tags/:id')
  @ApiOperation({ summary: 'Deletar uma tag (apenas se não estiver em uso)' })
  removeTag(
    @CurrentUser() _user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tags.removeTag(id);
  }
}
