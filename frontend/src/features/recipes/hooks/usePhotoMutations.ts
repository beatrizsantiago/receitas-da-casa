import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';

const RECIPE_KEY = 'recipe';
const RECIPES_KEY = 'recipes';

// A capa aparece nos cards da lista e do dashboard: invalida os dois caches
function invalidateRecipe(qc: QueryClient, recipeId: number) {
  qc.invalidateQueries({ queryKey: [RECIPE_KEY, recipeId] });
  qc.invalidateQueries({ queryKey: [RECIPES_KEY] });
}

export function useUploadPhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, type, recipeId }: { file: File; type: 'COVER' | 'USER'; recipeId: number }) =>
      recipesService.uploadPhoto(file, type, recipeId),
    onSuccess: (_, vars) => invalidateRecipe(qc, vars.recipeId),
  });
}

export function useUpdatePhotoPositionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ photoId, positionY }: { photoId: number; positionY: number; recipeId: number }) =>
      recipesService.updatePhotoPosition(photoId, positionY),
    onSuccess: (_, vars) => invalidateRecipe(qc, vars.recipeId),
  });
}
