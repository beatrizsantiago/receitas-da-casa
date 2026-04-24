import { ApiProperty } from '@nestjs/swagger';
import { PhotoType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ example: 'https://bucket.s3.amazonaws.com/recipes/abc.jpg' })
  @IsString({ message: 'A URL deve ser um texto' })
  @IsNotEmpty({ message: 'A URL é obrigatória' })
  url: string;

  @ApiProperty({ enum: PhotoType, example: PhotoType.COVER })
  @IsEnum(PhotoType, { message: 'O tipo deve ser COVER ou USER' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  type: PhotoType;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O ID da receita deve ser um número inteiro' })
  recipeId: number;
}
