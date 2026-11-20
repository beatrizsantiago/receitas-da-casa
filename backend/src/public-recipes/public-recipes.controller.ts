import {
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FilterRecipesDto } from '../recipes/dto/filter-recipes.dto';
import { PublicRecipesService } from './public-recipes.service';
import { renderRecipePreview } from './recipe-preview.html';

@ApiTags('public-recipes')
@Public()
@Controller('public/recipes')
export class PublicRecipesController {
  constructor(
    private readonly publicRecipes: PublicRecipesService,
    private readonly config: ConfigService,
  ) {}

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

  @Get(':id/preview')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({
    summary: 'HTML com meta tags Open Graph para prévia de link',
  })
  async preview(@Param('id', ParseIntPipe) id: number) {
    const recipe = await this.publicRecipes.findPreview(id);
    return renderRecipePreview(
      recipe,
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:5173',
    );
  }
}
