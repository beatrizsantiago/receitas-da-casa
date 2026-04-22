import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTagDto {
  @ApiProperty({ example: 'vegano' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#4CAF50' })
  @IsString()
  color: string;
}
