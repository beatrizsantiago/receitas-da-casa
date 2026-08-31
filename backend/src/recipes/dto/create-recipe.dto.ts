import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecipeCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bolo de chocolate' })
  @IsString({ message: 'O título deve ser um texto' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @ApiPropertyOptional({ example: 'Receita da vovó, sempre um sucesso!' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=xxxxx' })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'A referência deve ser um link válido (http ou https)' },
  )
  @MaxLength(2048, { message: 'O link é muito longo' })
  reference?: string | null;

  @ApiProperty({ enum: RecipeCategory, example: RecipeCategory.SWEET })
  @IsEnum(RecipeCategory, { message: 'A categoria deve ser Doce ou Salgada' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: RecipeCategory;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean({ message: 'A visibilidade deve ser verdadeira ou falsa' })
  isPublic?: boolean;
}
