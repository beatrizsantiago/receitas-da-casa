import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateRecipeNoteDto {
  @ApiProperty({ example: 'Usar chocolate meio amargo de boa qualidade.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'Dica importante' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, default: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;
}
