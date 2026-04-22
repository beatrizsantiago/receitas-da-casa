export type RecipeCategory = 'SWEET' | 'SAVORY';
export type PhotoType = 'COVER' | 'USER';

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Ingredient {
  id: number;
  recipeId: number;
  name: string;
  quantity?: string;
  unit?: string;
  order: number;
}

export interface Step {
  id: number;
  recipeId: number;
  description: string;
  order: number;
  photoUrl?: string;
}

export interface Note {
  id: number;
  recipeId: number;
  content: string;
  description?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: number;
  recipeId: number;
  url: string;
  type: PhotoType;
  createdAt: string;
}

export interface CookHistory {
  id: number;
  recipeId: number;
  date: string;
  notes?: string | null;
  rating: number;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  category: RecipeCategory;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  notes?: Note[];
  tags?: { tag: Tag }[];
  photos?: Photo[];
  cookHistory?: CookHistory[];
  _count?: { cookHistory: number };
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  category: RecipeCategory;
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface CreateIngredientDto {
  name: string;
  quantity: string;
  unit: string;
}

export interface UpdateIngredientDto extends Partial<CreateIngredientDto> {}

export interface CreateStepDto {
  description: string;
  order: number;
  photoUrl?: string;
}

export interface UpdateStepDto extends Partial<CreateStepDto> {}

export interface CreateNoteDto {
  content: string;
  description?: string;
  priority?: number;
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {}

export interface CreateCookHistoryDto {
  notes?: string;
  rating: number;
  cookedAt?: string;
}

export interface AddTagDto {
  name: string;
  color: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
