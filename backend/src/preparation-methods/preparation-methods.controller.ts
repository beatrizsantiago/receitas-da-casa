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
import { CreatePreparationMethodDto } from './dto/create-preparation-method.dto';
import { UpdatePreparationMethodDto } from './dto/update-preparation-method.dto';
import { PreparationMethodsService } from './preparation-methods.service';

@ApiTags('preparation-methods')
@ApiBearerAuth('access-token')
@Controller()
export class PreparationMethodsController {
  constructor(private preparationMethods: PreparationMethodsService) {}

  @Post('recipes/:recipeId/preparation-methods')
  @ApiOperation({ summary: 'Adicionar modo de preparo a uma receita' })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: CreatePreparationMethodDto,
  ) {
    return this.preparationMethods.create(user.sub, recipeId, dto);
  }

  @Get('recipes/:recipeId/preparation-methods')
  @ApiOperation({ summary: 'Listar modos de preparo de uma receita (com passos)' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.preparationMethods.findAll(user.sub, recipeId);
  }

  @Patch('preparation-methods/:id')
  @ApiOperation({ summary: 'Atualizar modo de preparo' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePreparationMethodDto,
  ) {
    return this.preparationMethods.update(user.sub, id, dto);
  }

  @Delete('preparation-methods/:id')
  @ApiOperation({ summary: 'Deletar modo de preparo' })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.preparationMethods.remove(user.sub, id);
  }
}
