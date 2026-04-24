import { useQuery } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { RecipeCategory } from '../types';

const RECIPES_KEY = 'recipes';
const RECIPE_KEY = 'recipe';

export function useRecipesQuery(options?: { page?: number; limit?: number; category?: RecipeCategory }) {
  const { page = 1, limit = 12, category } = options ?? {};
  return useQuery({
    queryKey: [RECIPES_KEY, { page, limit, category }],
    queryFn: () => recipesService.list({ page, limit, category }),
  });
}

export function useRecipeQuery(id: number) {
  return useQuery({
    queryKey: [RECIPE_KEY, id],
    queryFn: () => recipesService.get(id),
    enabled: !!id,
  });
}
