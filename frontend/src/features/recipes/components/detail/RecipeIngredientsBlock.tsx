import { useRef } from 'react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { IngredientList, type IngredientListHandle } from '../IngredientList';
import { IngredientsView } from './IngredientsView';
import type { Recipe } from '../../types';

interface RecipeIngredientsBlockProps {
  recipe: Recipe;
  recipeId: number;
  onCancel: () => void;
}

export function RecipeIngredientsBlock({
  recipe,
  recipeId,
  onCancel,
}: RecipeIngredientsBlockProps) {
  const listRef = useRef<IngredientListHandle>(null);

  return (
    <EditableBlock
      eyebrow="você vai precisar de"
      title="Ingredientes"
      onSave={async () => {
        await listRef.current?.save();
      }}
      onCancel={onCancel}
      editor={
        <IngredientList
          ref={listRef}
          recipeId={recipeId}
          ingredients={recipe.ingredients ?? []}
        />
      }
    >
      <IngredientsView ingredients={recipe.ingredients} />
    </EditableBlock>
  );
}
