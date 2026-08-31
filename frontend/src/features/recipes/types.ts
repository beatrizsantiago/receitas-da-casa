import type { Tag } from '@/features/tags/types';
import type { PaginatedResponse } from '@/shared/types';

export type RecipeCategory = 'SWEET' | 'SAVORY';
export type PhotoType = 'COVER' | 'USER';

export interface Ingredient {
  id: number;
  ingredientGroupId: number;
  name: string;
  amount: string;
  order: number;
}

export interface IngredientGroup {
  id: number;
  recipeId: number;
  title?: string | null;
  order: number;
  ingredients: Ingredient[];
}

export interface Step {
  id: number;
  preparationMethodId: number;
  description: string;
  order: number;
}

export interface PreparationMethod {
  id: number;
  recipeId: number;
  title?: string | null;
  order: number;
  steps: Step[];
}

export interface Note {
  id: number;
  recipeId: number;
  content: string;
  createdAt: string;
}

export interface Photo {
  id: number;
  recipeId: number;
  url: string;
  type: PhotoType;
  positionY: number;
  createdAt: string;
}

export interface CookHistory {
  id: number;
  recipeId: number;
  date: string;
  notes?: string | null;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  reference?: string | null;
  category: RecipeCategory;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ingredientGroups?: IngredientGroup[];
  preparationMethods?: PreparationMethod[];
  notes?: Note[];
  tags?: { tag: Tag }[];
  photos?: Photo[];
  cookHistory?: CookHistory[];
  cooks?: number;
  lastCooked?: string | null;
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  reference?: string | null;
  category: RecipeCategory;
  isPublic?: boolean;
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface CreateIngredientDto {
  name: string;
  amount: string;
  order: number;
}

export interface UpdateIngredientDto extends Partial<CreateIngredientDto> {}

export interface CreateIngredientGroupDto {
  title?: string;
  order: number;
}

export interface UpdateIngredientGroupDto extends Partial<CreateIngredientGroupDto> {}

export interface CreatePreparationMethodDto {
  title?: string;
  order: number;
}

export interface UpdatePreparationMethodDto extends Partial<CreatePreparationMethodDto> {}

export interface CreateStepDto {
  description: string;
}

export interface UpdateStepDto extends Partial<CreateStepDto> {}

export interface CreateNoteDto {
  content: string;
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {}

export interface CreateCookHistoryDto {
  notes?: string;
  date?: string;
}

export type { PaginatedResponse };
export type { Tag };
