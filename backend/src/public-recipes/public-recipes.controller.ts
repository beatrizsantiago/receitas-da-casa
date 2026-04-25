import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FilterRecipesDto } from '../recipes/dto/filter-recipes.dto';
import { PublicRecipesService } from './public-recipes.service';

@ApiTags('public-recipes')
@Public()
@Controller('public/recipes')
export class PublicRecipesController {
  constructor(private readonly publicRecipes: PublicRecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar receitas públicas com filtros' })
  findAll(@Query() filter: FilterRecipesDto) {
    return this.publicRecipes.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes públicos de uma receita' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicRecipes.findOne(id);
  }
}
