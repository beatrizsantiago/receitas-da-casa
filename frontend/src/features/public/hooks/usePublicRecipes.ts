import { useQuery } from '@tanstack/react-query';
import { publicRecipesService } from '../services/publicRecipesService';
import type { PublicCategory } from '../types';

interface UsePublicRecipesParams {
  limit?: number;
  category?: PublicCategory;
}

export function usePublicRecipesQuery(params?: UsePublicRecipesParams) {
  return useQuery({
    queryKey: ['public-recipes', params],
    queryFn: () => publicRecipesService.list({ limit: 200, ...params }),
  });
}

export function usePublicRecipeQuery(id: number) {
  return useQuery({
    queryKey: ['public-recipe', id],
    queryFn: () => publicRecipesService.get(id),
    enabled: !!id,
  });
}
