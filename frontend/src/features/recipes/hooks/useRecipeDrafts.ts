import { useState } from 'react';
import type { Recipe, RecipeCategory } from '../types';

export interface RecipeDrafts {
  title: string;
  description: string;
  reference: string;
  category: RecipeCategory;
  isPublic: boolean;
  tags: { name: string; color: string }[];
  notes: { content: string }[];
}

export interface RecipeDraftSetters {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setReference: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<RecipeCategory>>;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  setTags: React.Dispatch<React.SetStateAction<{ name: string; color: string }[]>>;
  setNotes: React.Dispatch<React.SetStateAction<{ content: string }[]>>;
}

export function useRecipeDrafts() {
  const [titleDraft, setTitleDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [referenceDraft, setReferenceDraft] = useState('');
  const [catDraft, setCatDraft] = useState<RecipeCategory>('SAVORY');
  const [isPublicDraft, setIsPublicDraft] = useState(false);
  const [tagsDraft, setTagsDraft] = useState<{ name: string; color: string }[]>([]);
  const [notesDraft, setNotesDraft] = useState<{ content: string }[]>([]);

  function initDrafts(recipe?: Recipe | null) {
    if (!recipe) return;
    setTitleDraft(recipe.title);
    setDescDraft(recipe.description ?? '');
    setReferenceDraft(recipe.reference ?? '');
    setCatDraft(recipe.category);
    setIsPublicDraft(recipe.isPublic);
    setTagsDraft(
      recipe.tags?.map((t) => ({
        name: t.tag.name.toLowerCase(),
        color: t.tag.color,
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
    reference: referenceDraft,
    category: catDraft,
    isPublic: isPublicDraft,
    tags: tagsDraft,
    notes: notesDraft,
  };

  const setters: RecipeDraftSetters = {
    setTitle: setTitleDraft,
    setDescription: setDescDraft,
    setReference: setReferenceDraft,
    setCategory: setCatDraft,
    setIsPublic: setIsPublicDraft,
    setTags: setTagsDraft,
    setNotes: setNotesDraft,
  };

  return { drafts, setters, initDrafts } as const;
}
