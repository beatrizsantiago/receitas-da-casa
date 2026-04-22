import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}
