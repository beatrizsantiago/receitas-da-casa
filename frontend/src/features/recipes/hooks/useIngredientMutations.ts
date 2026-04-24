import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { CreateIngredientDto, UpdateIngredientDto } from '../types';

const RECIPE_KEY = 'recipe';

export function useAddIngredientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: CreateIngredientDto }) =>
      recipesService.addIngredient(recipeId, dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

export function useUpdateIngredientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateIngredientDto }) =>
      recipesService.updateIngredient(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}

export function useDeleteIngredientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.removeIngredient,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}
