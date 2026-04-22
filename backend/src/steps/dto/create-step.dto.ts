import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateStepDto {
  @ApiProperty({ example: 'Misture os ingredientes secos em uma tigela.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  order: number;
}
