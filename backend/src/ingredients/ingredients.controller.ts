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
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientsService } from './ingredients.service';

@ApiTags('ingredients')
@ApiBearerAuth('access-token')
@Controller()
export class IngredientsController {
  constructor(private ingredients: IngredientsService) {}

  @Post('recipes/:recipeId/ingredients')
  @ApiOperation({ summary: 'Adicionar ingrediente a uma receita' })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: CreateIngredientDto,
  ) {
    return this.ingredients.create(user.sub, recipeId, dto);
  }

  @Get('recipes/:recipeId/ingredients')
  @ApiOperation({ summary: 'Listar ingredientes de uma receita' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.ingredients.findAll(user.sub, recipeId);
  }

  @Patch('ingredients/:id')
  @ApiOperation({ summary: 'Atualizar ingrediente' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.ingredients.update(user.sub, id, dto);
  }

  @Delete('ingredients/:id')
  @ApiOperation({ summary: 'Deletar ingrediente' })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ingredients.remove(user.sub, id);
  }
}
