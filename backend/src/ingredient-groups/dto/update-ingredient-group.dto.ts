import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientGroupDto } from './create-ingredient-group.dto';

export class UpdateIngredientGroupDto extends PartialType(
  CreateIngredientGroupDto,
) {}
