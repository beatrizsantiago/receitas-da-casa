import { useState } from 'react';
import type { Recipe, RecipeCategory } from '../types';

export interface RecipeDrafts {
  title: string;
  description: string;
  category: RecipeCategory;
  tags: { name: string; color: string }[];
  ingredients: { name: string; amount: string }[];
  notes: { content: string }[];
}

export interface RecipeDraftSetters {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<RecipeCategory>>;
  setTags: React.Dispatch<React.SetStateAction<{ name: string; color: string }[]>>;
  setIngredients: React.Dispatch<React.SetStateAction<{ name: string; amount: string }[]>>;
  setNotes: React.Dispatch<React.SetStateAction<{ content: string }[]>>;
}

export function useRecipeDrafts() {
  const [titleDraft, setTitleDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [catDraft, setCatDraft] = useState<RecipeCategory>('SAVORY');
  const [tagsDraft, setTagsDraft] = useState<{ name: string; color: string }[]>([]);
  const [ingDraft, setIngDraft] = useState<{ name: string; amount: string }[]>([]);
  const [notesDraft, setNotesDraft] = useState<{ content: string }[]>([]);

  function initDrafts(recipe?: Recipe | null) {
    if (!recipe) return;
    setTitleDraft(recipe.title);
    setDescDraft(recipe.description ?? '');
    setCatDraft(recipe.category);
    setTagsDraft(
      recipe.tags?.map((t) => ({
        name: t.tag.name.toLowerCase(),
        color: t.tag.color,
      })) ?? []
    );
    setIngDraft(
      recipe.ingredients?.map((i) => ({
        name: i.name,
        amount: i.amount ?? '',
      })) ?? []
    );
    setNotesDraft(
      recipe.notes?.map((n) => ({
        content: n.content,
      })) ?? []
    );
  }

  const drafts: RecipeDrafts = {
    title: titleDraft,
    description: descDraft,
    category: catDraft,
    tags: tagsDraft,
    ingredients: ingDraft,
    notes: notesDraft,
  };

  const setters: RecipeDraftSetters = {
    setTitle: setTitleDraft,
    setDescription: setDescDraft,
    setCategory: setCatDraft,
    setTags: setTagsDraft,
    setIngredients: setIngDraft,
    setNotes: setNotesDraft,
  };

  return { drafts, setters, initDrafts } as const;
}
