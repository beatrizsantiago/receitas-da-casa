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
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { StepsService } from './steps.service';

@ApiTags('steps')
@ApiBearerAuth('access-token')
@Controller()
export class StepsController {
  constructor(private steps: StepsService) {}

  @Post('preparation-methods/:preparationMethodId/steps')
  @ApiOperation({ summary: 'Adicionar passo a um modo de preparo' })
  create(
    @CurrentUser() user: JwtPayload,
    @Param('preparationMethodId', ParseIntPipe) preparationMethodId: number,
    @Body() dto: CreateStepDto,
  ) {
    return this.steps.create(user.sub, preparationMethodId, dto);
  }

  @Get('preparation-methods/:preparationMethodId/steps')
  @ApiOperation({ summary: 'Listar passos de um modo de preparo (ordenados)' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Param('preparationMethodId', ParseIntPipe) preparationMethodId: number,
  ) {
    return this.steps.findAll(user.sub, preparationMethodId);
  }

  @Patch('steps/:id')
  @ApiOperation({ summary: 'Atualizar passo' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStepDto,
  ) {
    return this.steps.update(user.sub, id, dto);
  }

  @Delete('steps/:id')
  @ApiOperation({ summary: 'Deletar passo' })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.steps.remove(user.sub, id);
  }
}
