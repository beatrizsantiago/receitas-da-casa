import api from '../../../services/api';
import type {
  AddTagDto,
  CookHistory,
  CreateCookHistoryDto,
  CreateIngredientDto,
  CreateNoteDto,
  CreateRecipeDto,
  CreateStepDto,
  Ingredient,
  Note,
  PaginatedResponse,
  Recipe,
  Step,
  Tag,
  UpdateIngredientDto,
  UpdateNoteDto,
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

  async listIngredients(recipeId: number): Promise<Ingredient[]> {
    const { data } = await api.get<Ingredient[]>(`/recipes/${recipeId}/ingredients`);
    return data;
  },

  async addIngredient(recipeId: number, dto: CreateIngredientDto): Promise<Ingredient> {
    const { data } = await api.post<Ingredient>(`/recipes/${recipeId}/ingredients`, dto);
    return data;
  },

  async updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    const { data } = await api.patch<Ingredient>(`/ingredients/${id}`, dto);
    return data;
  },

  async removeIngredient(id: number): Promise<void> {
    await api.delete(`/ingredients/${id}`);
  },

  async listSteps(recipeId: number): Promise<Step[]> {
    const { data } = await api.get<Step[]>(`/recipes/${recipeId}/steps`);
    return data;
  },

  async addStep(recipeId: number, dto: CreateStepDto): Promise<Step> {
    const { data } = await api.post<Step>(`/recipes/${recipeId}/steps`, dto);
    return data;
  },

  async updateStep(id: number, dto: UpdateStepDto): Promise<Step> {
    const { data } = await api.patch<Step>(`/steps/${id}`, dto);
    return data;
  },

  async removeStep(id: number): Promise<void> {
    await api.delete(`/steps/${id}`);
  },

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

  async listTags(): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/tags');
    return data;
  },

  async addTag(recipeId: number, dto: AddTagDto): Promise<void> {
    await api.post(`/recipes/${recipeId}/tags`, dto);
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
};
