import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { CreateCookHistoryDto } from '../types';

const RECIPE_KEY = 'recipe';

export function useAddHistoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: CreateCookHistoryDto }) =>
      recipesService.addHistory(recipeId, dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}
