import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { UpdateRecipeDto } from '../types';

const RECIPES_KEY = 'recipes';
const RECIPE_KEY = 'recipe';

export function useCreateRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPES_KEY] }),
  });
}

export function useUpdateRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateRecipeDto }) => recipesService.update(id, dto),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.id] });
      qc.invalidateQueries({ queryKey: [RECIPES_KEY] });
    },
  });
}

export function useDeleteRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPES_KEY] }),
  });
}
