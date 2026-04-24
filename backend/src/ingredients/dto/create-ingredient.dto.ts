import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Farinha de trigo' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ example: '2' })
  @IsString({ message: 'A quantidade deve ser um texto' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  quantity: string;

  @ApiProperty({ example: 'xícaras' })
  @IsString({ message: 'A unidade deve ser um texto' })
  @IsNotEmpty({ message: 'A unidade é obrigatória' })
  unit: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;
}
