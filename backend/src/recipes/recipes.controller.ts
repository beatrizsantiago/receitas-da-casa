import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { FilterRecipesDto } from './dto/filter-recipes.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';

@ApiTags('recipes')
@ApiBearerAuth('access-token')
@Controller('recipes')
export class RecipesController {
  constructor(private recipes: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar receita' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateRecipeDto) {
    return this.recipes.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar receitas com filtros e paginação' })
  findAll(@Query() filter: FilterRecipesDto) {
    return this.recipes.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar receita por ID (com todos os detalhes)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipes.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar receita' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeDto) {
    return this.recipes.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar receita definitivamente (com fotos)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipes.remove(id);
  }
}
