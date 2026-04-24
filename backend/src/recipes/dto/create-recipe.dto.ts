import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bolo de chocolate' })
  @IsString({ message: 'O título deve ser um texto' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @ApiPropertyOptional({ example: 'Receita da vovó, sempre um sucesso!' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RecipeCategory, example: RecipeCategory.SWEET })
  @IsEnum(RecipeCategory, { message: 'A categoria deve ser Doce ou Salgado' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: RecipeCategory;
}
