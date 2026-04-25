import publicApi from '../api/publicApi';
import type {
  PublicCategory,
  PublicPaginatedResponse,
  PublicRecipeDetail,
  PublicRecipeSummary,
} from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  category?: PublicCategory;
  tags?: string[];
}

export const publicRecipesService = {
  async list(params?: ListParams): Promise<PublicPaginatedResponse<PublicRecipeSummary>> {
    const { data } = await publicApi.get<PublicPaginatedResponse<PublicRecipeSummary>>(
      '/public/recipes',
      { params },
    );
    return data;
  },

  async get(id: number): Promise<PublicRecipeDetail> {
    const { data } = await publicApi.get<PublicRecipeDetail>(`/public/recipes/${id}`);
    return data;
  },
};
