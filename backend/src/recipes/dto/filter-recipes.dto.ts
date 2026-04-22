import { ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterRecipesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: RecipeCategory })
  @IsOptional()
  @IsEnum(RecipeCategory)
  category?: RecipeCategory;

  @ApiPropertyOptional({ type: [String], example: ['vegano', 'rápido'] })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
