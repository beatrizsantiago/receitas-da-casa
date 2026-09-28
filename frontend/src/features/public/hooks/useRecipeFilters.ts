import { useState, useEffect, useRef, useMemo } from 'react';
import { searchScore, tokenize } from '@/shared/utils/search';
import type { PublicCategory, PublicRecipeSummary, PublicTag } from '../types';

export interface RecipeFiltersState {
  inputValue: string;
  setInputValue: (v: string) => void;
  category: PublicCategory | 'all';
  setCategory: (c: PublicCategory | 'all') => void;
  tagFilter: string[];
  setTagFilter: (tags: string[]) => void;
  draftCategory: PublicCategory | 'all';
  setDraftCategory: (c: PublicCategory | 'all') => void;
  draftTags: string[];
  setDraftTags: (tags: string[]) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filterRef: React.RefObject<HTMLDivElement | null>;
  allTags: PublicTag[];
  filtered: PublicRecipeSummary[];
  activeFilterCount: number;
  openFilter: () => void;
  applyFilter: () => void;
  toggleDraftTag: (name: string) => void;
  clearFilters: () => void;
}

export function useRecipeFilters(recipes: PublicRecipeSummary[]): RecipeFiltersState {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PublicCategory | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<PublicCategory | 'all'>('all');
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filterOpen]);

  const allTags = useMemo(() => {
    const tagMap = new Map<string, PublicTag>();
    for (const r of recipes) {
      for (const { tag } of r.tags) {
        if (!tagMap.has(tag.name)) tagMap.set(tag.name, tag);
      }
    }
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes]);

  const filtered = useMemo(() => {
    const terms = tokenize(search);
    return recipes.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (tagFilter.length > 0 && !tagFilter.every((t) => r.tags.some((rt) => rt.tag.name === t)))
        return false;
      if (
        terms.length > 0 &&
        searchScore(terms, [
          { values: [r.title], weight: 10 },
          { values: r.tags.map((rt) => rt.tag.name), weight: 5 },
        ]) === 0
      )
        return false;
      return true;
    });
  }, [recipes, category, tagFilter, search]);

  const activeFilterCount = (category !== 'all' ? 1 : 0) + tagFilter.length;

  function openFilter() {
    setDraftCategory(category);
    setDraftTags([...tagFilter]);
    setFilterOpen(true);
  }

  function applyFilter() {
    setCategory(draftCategory);
    setTagFilter(draftTags);
    setFilterOpen(false);
  }

  function toggleDraftTag(name: string) {
    setDraftTags((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  }

  function clearFilters() {
    setInputValue('');
    setSearch('');
    setCategory('all');
    setTagFilter([]);
  }

  return {
    inputValue,
    setInputValue,
    category,
    setCategory,
    tagFilter,
    setTagFilter,
    draftCategory,
    setDraftCategory,
    draftTags,
    setDraftTags,
    filterOpen,
    setFilterOpen,
    filterRef,
    allTags,
    filtered,
    activeFilterCount,
    openFilter,
    applyFilter,
    toggleDraftTag,
    clearFilters,
  };
}
