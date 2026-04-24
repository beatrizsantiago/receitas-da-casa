import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { CreateNoteDto, UpdateNoteDto } from '../types';

const RECIPE_KEY = 'recipe';

export function useAddNoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: CreateNoteDto }) =>
      recipesService.addNote(recipeId, dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

export function useUpdateNoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateNoteDto }) => recipesService.updateNote(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}

export function useDeleteNoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.removeNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}
