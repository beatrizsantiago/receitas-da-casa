import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateIngredientGroupDto {
  @ApiPropertyOptional({ example: 'Massa' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;
}
