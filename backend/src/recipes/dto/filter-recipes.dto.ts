import { ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterRecipesDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Busca em título, tags, ingredientes e descrição (ignora acentos; todas as palavras precisam aparecer)',
    example: 'bolo cenoura',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: RecipeCategory })
  @IsOptional()
  @IsEnum(RecipeCategory)
  category?: RecipeCategory;

  @ApiPropertyOptional({
    type: [String],
    example: ['vegano', 'rápido'],
    description: 'A receita precisa ter todas as tags informadas',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as unknown[]) : [value],
  )
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags?: string[];
}
