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
import { CreateIngredientGroupDto } from './dto/create-ingredient-group.dto';
import { UpdateIngredientGroupDto } from './dto/update-ingredient-group.dto';
import { IngredientGroupsService } from './ingredient-groups.service';

@ApiTags('ingredient-groups')
@ApiBearerAuth('access-token')
@Controller()
export class IngredientGroupsController {
  constructor(private ingredientGroups: IngredientGroupsService) {}

  @Post('recipes/:recipeId/ingredient-groups')
  @ApiOperation({ summary: 'Adicionar grupo de ingredientes a uma receita' })
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: CreateIngredientGroupDto,
  ) {
    return this.ingredientGroups.create(recipeId, dto);
  }

  @Get('recipes/:recipeId/ingredient-groups')
  @ApiOperation({
    summary: 'Listar grupos de ingredientes de uma receita (com ingredientes)',
  })
  findAll(@Param('recipeId', ParseIntPipe) recipeId: number) {
    return this.ingredientGroups.findAll(recipeId);
  }

  @Patch('ingredient-groups/:id')
  @ApiOperation({ summary: 'Atualizar grupo de ingredientes' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIngredientGroupDto,
  ) {
    return this.ingredientGroups.update(id, dto);
  }

  @Delete('ingredient-groups/:id')
  @ApiOperation({ summary: 'Deletar grupo de ingredientes' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientGroups.remove(id);
  }
}
