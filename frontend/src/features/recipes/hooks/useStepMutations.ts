import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type { CreateStepDto, UpdateStepDto } from '../types';

const RECIPE_KEY = 'recipe';

export function useAddStepMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: CreateStepDto }) =>
      recipesService.addStep(recipeId, dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

export function useUpdateStepMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateStepDto }) => recipesService.updateStep(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}

export function useDeleteStepMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.removeStep,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}
