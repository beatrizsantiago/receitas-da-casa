import { useMemo } from 'react';
import type { Recipe } from '@/features/recipes/types';

export function useTagStats(recipes: Recipe[]) {
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recipes) {
      for (const t of r.tags ?? []) {
        const name = t.tag.name;
        map.set(name, (map.get(name) ?? 0) + 1);
      }
    }
    return map;
  }, [recipes]);

  const countFor = (name: string) => countMap.get(name) ?? 0;

  return { countFor };
}
