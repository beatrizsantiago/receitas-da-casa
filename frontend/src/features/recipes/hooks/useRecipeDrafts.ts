import { useState } from 'react';
import type { Recipe, RecipeCategory } from '../types';

export interface RecipeDrafts {
  title: string;
  description: string;
  category: RecipeCategory;
  tags: { name: string; color: string }[];
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; order: number }[];
  notes: { content: string }[];
  cover: { cover: boolean; hues: [number, number] };
}

export interface RecipeDraftSetters {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<RecipeCategory>>;
  setTags: React.Dispatch<React.SetStateAction<{ name: string; color: string }[]>>;
  setIngredients: React.Dispatch<React.SetStateAction<{ name: string; quantity: string; unit: string }[]>>;
  setSteps: React.Dispatch<React.SetStateAction<{ description: string; order: number }[]>>;
  setNotes: React.Dispatch<React.SetStateAction<{ content: string }[]>>;
  setCover: React.Dispatch<React.SetStateAction<{ cover: boolean; hues: [number, number] }>>;
}

export function useRecipeDrafts() {
  const [titleDraft, setTitleDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [catDraft, setCatDraft] = useState<RecipeCategory>('SAVORY');
  const [tagsDraft, setTagsDraft] = useState<{ name: string; color: string }[]>([]);
  const [ingDraft, setIngDraft] = useState<{ name: string; quantity: string; unit: string }[]>([]);
  const [stepsDraft, setStepsDraft] = useState<{ description: string; order: number }[]>([]);
  const [notesDraft, setNotesDraft] = useState<{ content: string }[]>([]);
  const [coverDraft, setCoverDraft] = useState<{ cover: boolean; hues: [number, number] }>({ cover: false, hues: [25, 35] });

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
        quantity: i.quantity ?? '',
        unit: i.unit ?? '',
      })) ?? []
    );
    setStepsDraft(
      recipe.steps?.map((s) => ({
        description: s.description,
        order: s.order,
      })) ?? []
    );
    setNotesDraft(
      recipe.notes?.map((n) => ({
        content: n.content,
      })) ?? []
    );
    setCoverDraft({
      cover: recipe.photos?.some((p) => p.type === 'COVER') ?? false,
      hues: recipe.hues ?? [25, 35],
    });
  }

  const drafts: RecipeDrafts = {
    title: titleDraft,
    description: descDraft,
    category: catDraft,
    tags: tagsDraft,
    ingredients: ingDraft,
    steps: stepsDraft,
    notes: notesDraft,
    cover: coverDraft,
  };

  const setters: RecipeDraftSetters = {
    setTitle: setTitleDraft,
    setDescription: setDescDraft,
    setCategory: setCatDraft,
    setTags: setTagsDraft,
    setIngredients: setIngDraft,
    setSteps: setStepsDraft,
    setNotes: setNotesDraft,
    setCover: setCoverDraft,
  };

  return { drafts, setters, initDrafts } as const;
}
