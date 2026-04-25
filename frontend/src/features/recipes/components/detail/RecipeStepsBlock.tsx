import { useRef } from 'react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { StepList, type StepListHandle } from '../StepList';
import { StepsView } from './StepsView';
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
  const listRef = useRef<StepListHandle>(null);

  return (
    <EditableBlock
      eyebrow="modo de preparo"
      title="Passo a passo"
      onSave={async () => {
        await listRef.current?.save();
      }}
      onCancel={onCancel}
      editor={
        <StepList
          ref={listRef}
          recipeId={recipeId}
          steps={recipe.steps ?? []}
        />
      }
    >
      <StepsView steps={recipe.steps} />
    </EditableBlock>
  );
}
