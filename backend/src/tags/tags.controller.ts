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

  @Post('recipes/:recipeId/tags')
  @ApiOperation({ summary: 'Adicionar tag a uma receita (cria se não existir)' })
  addToRecipe(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: AddTagDto,
  ) {
    return this.tags.addToRecipe(user.sub, recipeId, dto);
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
}
