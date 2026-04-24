import { ApiProperty } from '@nestjs/swagger';
import { PhotoType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ enum: PhotoType, example: PhotoType.COVER })
  @IsEnum(PhotoType, { message: 'O tipo deve ser COVER ou USER' })
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  type!: PhotoType;

  @ApiProperty({ example: 1 })
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsInt({ message: 'O ID da receita deve ser um número inteiro' })
  recipeId!: number;
}
