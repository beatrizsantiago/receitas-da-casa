import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateCookHistoryDto {
  @ApiPropertyOptional({ example: '2025-04-21T19:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({ example: 'Ficou muito bom, mas precisa de mais açúcar.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
