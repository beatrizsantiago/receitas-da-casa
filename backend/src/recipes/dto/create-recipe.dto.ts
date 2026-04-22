import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeCategory } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bolo de chocolate' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Receita da vovó, sempre um sucesso!' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RecipeCategory, example: RecipeCategory.SWEET })
  @IsEnum(RecipeCategory)
  category: RecipeCategory;
}
