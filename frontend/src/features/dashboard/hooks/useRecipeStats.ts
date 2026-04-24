import { useMemo } from 'react';
import type { Recipe } from '@/features/recipes/types';

export function useRecipeStats(recipes: Recipe[], mobile: boolean) {
  const recent = useMemo(
    () =>
      [...recipes]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, mobile ? 3 : 4),
    [recipes, mobile]
  );

  const mostCooked = useMemo(
    () => [...recipes].sort((a, b) => (b.cooks ?? 0) - (a.cooks ?? 0)).slice(0, 3),
    [recipes]
  );

  const categoryCounts = useMemo(() => {
    const meta: Record<string, { label: string; bg: string; fg: string }> = {
      SWEET: { label: 'Doce', bg: 'yellow.50', fg: 'yellow.800' },
      SAVORY: { label: 'Salgado', bg: 'secondary.50', fg: 'secondary.800' },
    };
    return Object.entries(
      recipes.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .map(([cat, count]) => ({ cat, count, meta: meta[cat] }))
      .filter((c) => c.count > 0);
  }, [recipes]);

  return { recent, mostCooked, categoryCounts };
}
