import { useCallback, useEffect, useRef, useState } from 'react';
import { recipesService } from '../services/recipes.service';
import type { PaginatedResponse, Recipe, RecipeCategory } from '../types';

interface UseRecipesOptions {
  page?: number;
  limit?: number;
  category?: RecipeCategory;
}

export function useRecipes(options: UseRecipesOptions = {}) {
  const { page = 1, limit = 12, category } = options;
  const [result, setResult] = useState<PaginatedResponse<Recipe> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    try {
      const data = await recipesService.list({ page, limit, category });
      setResult(data);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name !== 'CanceledError') {
        setError('Erro ao carregar receitas');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, category]);

  useEffect(() => { void fetch(); }, [fetch]);

  return {
    result,
    data: result?.data ?? [],
    meta: result?.meta ?? null,
    isLoading,
    error,
    refetch: fetch,
  };
}

export function useRecipe(id: number) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await recipesService.get(id);
      setRecipe(data);
    } catch {
      setError('Receita não encontrada');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { recipe, isLoading, error, refetch: fetch };
}
