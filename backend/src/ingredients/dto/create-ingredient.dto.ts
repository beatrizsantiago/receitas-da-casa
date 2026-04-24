import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Farinha de trigo' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2' })
  @IsString()
  quantity: string;

  @ApiProperty({ example: 'xícaras' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;
}
