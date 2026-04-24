import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';

const RECIPE_KEY = 'recipe';

export function useUploadPhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, type, recipeId }: { file: File; type: 'COVER' | 'USER'; recipeId: number }) =>
      recipesService.uploadPhoto(file, type, recipeId),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

export function useUpdatePhotoPositionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ photoId, positionY }: { photoId: number; positionY: number; recipeId: number }) =>
      recipesService.updatePhotoPosition(photoId, positionY),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}
