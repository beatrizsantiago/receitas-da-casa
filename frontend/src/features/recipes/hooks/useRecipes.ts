import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../services/recipes.service';
import type {
  CreateCookHistoryDto,
  CreateIngredientDto,
  CreateNoteDto,
  CreateStepDto,
  RecipeCategory,
  UpdateIngredientDto,
  UpdateNoteDto,
  UpdateRecipeDto,
  UpdateStepDto,
} from '../types';

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

// ─── Ingredients ───
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
    onSuccess: () => {
      // We don't know the recipeId here, so invalidate all recipes broadly
      qc.invalidateQueries({ queryKey: [RECIPE_KEY] });
    },
  });
}

export function useDeleteIngredientMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: recipesService.removeIngredient,
    onSuccess: () => qc.invalidateQueries({ queryKey: [RECIPE_KEY] }),
  });
}

// ─── Steps ───
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

// ─── Notes ───
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

// ─── History ───
export function useAddHistoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: CreateCookHistoryDto }) =>
      recipesService.addHistory(recipeId, dto),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: [RECIPE_KEY, vars.recipeId] }),
  });
}

// ─── Tags on recipe ───
export function useAddTagToRecipeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: number; dto: { name: string; color: string } }) =>
      recipesService.addTag(recipeId, dto),
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

// ─── Photos ───
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
