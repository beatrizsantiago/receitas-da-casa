import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCookHistoryDto } from './dto/create-cook-history.dto';
import { HistoryService } from './history.service';

@ApiTags('history')
@ApiBearerAuth('access-token')
@Controller('recipes/:recipeId/history')
export class HistoryController {
  constructor(private history: HistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar que a receita foi cozinhada' })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() dto: CreateCookHistoryDto,
  ) {
    return this.history.create(user.sub, recipeId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de cozimento de uma receita' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.history.findAll(user.sub, recipeId);
  }
}
