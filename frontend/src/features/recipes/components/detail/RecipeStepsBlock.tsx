import { useRef } from 'react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { PreparationMethodList, type PreparationMethodListHandle } from '../PreparationMethodList';
import { PreparationMethodsView } from './PreparationMethodsView';
import type { Recipe } from '../../types';

interface RecipeStepsBlockProps {
  recipe: Recipe;
  recipeId: number;
  onCancel: () => void;
}

export function RecipeStepsBlock({
  recipe,
  recipeId,
  onCancel,
}: RecipeStepsBlockProps) {
  const listRef = useRef<PreparationMethodListHandle>(null);

  return (
    <EditableBlock
      eyebrow="modo de preparo"
      title="Passo a passo"
      onSave={async () => {
        await listRef.current?.save();
      }}
      onCancel={onCancel}
      editor={
        <PreparationMethodList
          ref={listRef}
          recipeId={recipeId}
          preparationMethods={recipe.preparationMethods ?? []}
        />
      }
    >
      <PreparationMethodsView preparationMethods={recipe.preparationMethods} />
    </EditableBlock>
  );
}
