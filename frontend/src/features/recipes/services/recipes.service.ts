import api from '@/shared/services/api';
import type {
  CookHistory,
  CreateCookHistoryDto,
  CreateIngredientDto,
  CreateIngredientGroupDto,
  CreateNoteDto,
  CreatePreparationMethodDto,
  CreateRecipeDto,
  CreateStepDto,
  Ingredient,
  IngredientGroup,
  Note,
  PaginatedResponse,
  Photo,
  PreparationMethod,
  Recipe,
  Step,
  UpdateIngredientDto,
  UpdateIngredientGroupDto,
  UpdateNoteDto,
  UpdatePreparationMethodDto,
  UpdateRecipeDto,
  UpdateStepDto,
} from '../types';

export const recipesService = {
  async list(params?: { page?: number; limit?: number; category?: string }): Promise<PaginatedResponse<Recipe>> {
    const { data } = await api.get<PaginatedResponse<Recipe>>('/recipes', { params });
    return data;
  },

  async get(id: number): Promise<Recipe> {
    const { data } = await api.get<Recipe>(`/recipes/${id}`);
    return data;
  },

  async create(dto: CreateRecipeDto): Promise<Recipe> {
    const { data } = await api.post<Recipe>('/recipes', dto);
    return data;
  },

  async update(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
    const { data } = await api.patch<Recipe>(`/recipes/${id}`, dto);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  // ─── Ingredient Groups ───

  async addIngredientGroup(recipeId: number, dto: CreateIngredientGroupDto): Promise<IngredientGroup> {
    const { data } = await api.post<IngredientGroup>(`/recipes/${recipeId}/ingredient-groups`, dto);
    return data;
  },

  async updateIngredientGroup(id: number, dto: UpdateIngredientGroupDto): Promise<IngredientGroup> {
    const { data } = await api.patch<IngredientGroup>(`/ingredient-groups/${id}`, dto);
    return data;
  },

  async removeIngredientGroup(id: number): Promise<void> {
    await api.delete(`/ingredient-groups/${id}`);
  },

  // ─── Ingredients ───

  async listIngredients(ingredientGroupId: number): Promise<Ingredient[]> {
    const { data } = await api.get<Ingredient[]>(`/ingredient-groups/${ingredientGroupId}/ingredients`);
    return data;
  },

  async addIngredient(ingredientGroupId: number, dto: CreateIngredientDto): Promise<Ingredient> {
    const { data } = await api.post<Ingredient>(`/ingredient-groups/${ingredientGroupId}/ingredients`, dto);
    return data;
  },

  async updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    const { data } = await api.patch<Ingredient>(`/ingredients/${id}`, dto);
    return data;
  },

  async removeIngredient(id: number): Promise<void> {
    await api.delete(`/ingredients/${id}`);
  },

  // ─── Preparation Methods ───

  async addPreparationMethod(recipeId: number, dto: CreatePreparationMethodDto): Promise<PreparationMethod> {
    const { data } = await api.post<PreparationMethod>(`/recipes/${recipeId}/preparation-methods`, dto);
    return data;
  },

  async updatePreparationMethod(id: number, dto: UpdatePreparationMethodDto): Promise<PreparationMethod> {
    const { data } = await api.patch<PreparationMethod>(`/preparation-methods/${id}`, dto);
    return data;
  },

  async removePreparationMethod(id: number): Promise<void> {
    await api.delete(`/preparation-methods/${id}`);
  },

  // ─── Steps ───

  async addStep(preparationMethodId: number, dto: CreateStepDto): Promise<Step> {
    const { data } = await api.post<Step>(`/preparation-methods/${preparationMethodId}/steps`, dto);
    return data;
  },

  async updateStep(id: number, dto: UpdateStepDto): Promise<Step> {
    const { data } = await api.patch<Step>(`/steps/${id}`, dto);
    return data;
  },

  async removeStep(id: number): Promise<void> {
    await api.delete(`/steps/${id}`);
  },

  // ─── Notes ───

  async listNotes(recipeId: number): Promise<Note[]> {
    const { data } = await api.get<Note[]>(`/recipes/${recipeId}/notes`);
    return data;
  },

  async addNote(recipeId: number, dto: CreateNoteDto): Promise<Note> {
    const { data } = await api.post<Note>(`/recipes/${recipeId}/notes`, dto);
    return data;
  },

  async updateNote(id: number, dto: UpdateNoteDto): Promise<Note> {
    const { data } = await api.patch<Note>(`/notes/${id}`, dto);
    return data;
  },

  async removeNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async addTag(recipeId: number, tagId: number): Promise<void> {
    await api.post(`/recipes/${recipeId}/tags`, { tagId });
  },

  async removeTag(recipeId: number, tagId: number): Promise<void> {
    await api.delete(`/recipes/${recipeId}/tags/${tagId}`);
  },

  async listHistory(recipeId: number): Promise<CookHistory[]> {
    const { data } = await api.get<CookHistory[]>(`/recipes/${recipeId}/history`);
    return data;
  },

  async addHistory(recipeId: number, dto: CreateCookHistoryDto): Promise<CookHistory> {
    const { data } = await api.post<CookHistory>(`/recipes/${recipeId}/history`, dto);
    return data;
  },

  async uploadPhoto(file: File, type: 'COVER' | 'USER', recipeId: number): Promise<Photo> {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    form.append('recipeId', String(recipeId));
    const { data } = await api.post<Photo>('/photos', form);
    return data;
  },

  async updatePhotoPosition(photoId: number, positionY: number): Promise<Photo> {
    const { data } = await api.patch<Photo>(`/photos/${photoId}`, { positionY });
    return data;
  },
};
