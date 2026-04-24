import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';

const RECIPE_KEY = 'recipe';

export function useUploadPhotoMutation() {
  return useMutation({
    mutationFn: ({ fileName, contentType }: { fileName: string; contentType: string }) =>
      recipesService.generateUploadUrl(fileName, contentType),
  });
}

export function useCreatePhotoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { url: string; type: 'COVER' | 'USER'; recipeId: number }) =>
      recipesService.createPhoto(dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}
