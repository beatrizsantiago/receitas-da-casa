import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRecipeNoteDto {
  @ApiProperty({ example: 'Usar chocolate meio amargo de boa qualidade.' })
  @IsString({ message: 'O conteúdo deve ser um texto' })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  content: string;
}
