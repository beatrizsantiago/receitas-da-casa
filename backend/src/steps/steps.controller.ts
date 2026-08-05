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
    @Param('preparationMethodId', ParseIntPipe) preparationMethodId: number,
    @Body() dto: CreateStepDto,
  ) {
    return this.steps.create(preparationMethodId, dto);
  }

  @Get('preparation-methods/:preparationMethodId/steps')
  @ApiOperation({ summary: 'Listar passos de um modo de preparo (ordenados)' })
  findAll(@Param('preparationMethodId', ParseIntPipe) preparationMethodId: number) {
    return this.steps.findAll(preparationMethodId);
  }

  @Patch('steps/:id')
  @ApiOperation({ summary: 'Atualizar passo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStepDto) {
    return this.steps.update(id, dto);
  }

  @Delete('steps/:id')
  @ApiOperation({ summary: 'Deletar passo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.steps.remove(id);
  }
}
