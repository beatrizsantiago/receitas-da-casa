import { PartialType } from '@nestjs/mapped-types';
import { CreatePreparationMethodDto } from './create-preparation-method.dto';

export class UpdatePreparationMethodDto extends PartialType(CreatePreparationMethodDto) {}
