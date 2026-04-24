import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddTagDto {
  @ApiProperty({ example: 'vegano' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ example: '#4CAF50' })
  @IsString({ message: 'A cor deve ser um texto' })
  @IsNotEmpty({ message: 'A cor é obrigatória' })
  color: string;
}
