import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRecipeNoteDto {
  @ApiProperty({ example: 'Usar chocolate meio amargo de boa qualidade.' })
  @IsString()
  content: string;
}
