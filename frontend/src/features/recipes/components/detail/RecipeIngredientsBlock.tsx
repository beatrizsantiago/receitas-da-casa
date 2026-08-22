import { useRef } from 'react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { IngredientGroupList, type IngredientGroupListHandle } from '../IngredientGroupList';
import { IngredientGroupsView } from './IngredientGroupsView';
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
  const listRef = useRef<IngredientGroupListHandle>(null);

  return (
    <EditableBlock
      eyebrow="você vai precisar de"
      title="Ingredientes"
      onSave={async () => {
        await listRef.current?.save();
      }}
      onCancel={onCancel}
      editor={
        <IngredientGroupList
          ref={listRef}
          recipeId={recipeId}
          ingredientGroups={recipe.ingredientGroups ?? []}
        />
      }
    >
      <IngredientGroupsView ingredientGroups={recipe.ingredientGroups} />
    </EditableBlock>
  );
}
