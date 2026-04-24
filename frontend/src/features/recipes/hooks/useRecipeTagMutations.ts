import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';

const RECIPE_KEY = 'recipe';

export function useAddTagToRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, tagId }: { recipeId: number; tagId: number }) =>
      recipesService.addTag(recipeId, tagId),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

export function useRemoveTagFromRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, tagId }: { recipeId: number; tagId: number }) =>
      recipesService.removeTag(recipeId, tagId),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}
