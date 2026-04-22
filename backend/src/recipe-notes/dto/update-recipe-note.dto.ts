import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeNoteDto } from './create-recipe-note.dto';

export class UpdateRecipeNoteDto extends PartialType(CreateRecipeNoteDto) {}
