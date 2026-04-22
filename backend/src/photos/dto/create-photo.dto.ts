import { ApiProperty } from '@nestjs/swagger';
import { PhotoType } from '@prisma/client';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ example: 'https://bucket.s3.amazonaws.com/recipes/abc.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ enum: PhotoType, example: PhotoType.COVER })
  @IsEnum(PhotoType)
  type: PhotoType;

  @ApiProperty({ example: 1 })
  @IsInt()
  recipeId: number;
}
