import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class LinkTagDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O ID da tag deve ser um número inteiro' })
  tagId: number;
}
