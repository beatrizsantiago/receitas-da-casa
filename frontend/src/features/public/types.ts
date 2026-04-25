export type PublicCategory = 'SWEET' | 'SAVORY';

export interface PublicTag {
  id: number;
  name: string;
  color: string;
}

export interface PublicPhoto {
  url: string;
  positionY: number | null;
}

export interface PublicRecipeSummary {
  id: number;
  title: string;
  category: PublicCategory;
  tags: { tag: PublicTag }[];
  photos: PublicPhoto[];
}

export interface PublicIngredient {
  id: number;
  name: string;
  quantity: string | null;
  unit: string | null;
  order: number;
}

export interface PublicStep {
  id: number;
  description: string;
  order: number;
}

export interface PublicRecipeDetail {
  id: number;
  title: string;
  photos: PublicPhoto[];
  ingredients: PublicIngredient[];
  steps: PublicStep[];
}

export interface PublicPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
