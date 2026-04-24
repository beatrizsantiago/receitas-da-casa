import { Box, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { IngredientList } from '../IngredientList';
import type { Recipe } from '../../types';

interface RecipeIngredientsBlockProps {
  recipe: Recipe;
  recipeId: number;
  ingredients: { name: string; quantity: string; unit: string }[];
  onCancel: () => void;
}

export function RecipeIngredientsBlock({
  recipe,
  recipeId,
  ingredients,
  onCancel,
}: RecipeIngredientsBlockProps) {
  return (
    <EditableBlock
      eyebrow="você vai precisar de"
      title="Ingredientes"
      onSave={async () => {}}
      onCancel={onCancel}
      editor={
        <IngredientList
          recipeId={recipeId}
          ingredients={ingredients.map((i, idx) => ({
            ...i,
            id: idx,
            recipeId,
            order: idx,
          }))}
        />
      }
    >
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <Box as="ul" listStyleType="none" p={0} m={0}>
          {recipe.ingredients.map((ing) => (
            <Box
              key={ing.id}
              as="li"
              display="flex"
              alignItems="baseline"
              gap={3}
              py={2.5}
              px={3.5}
              bg="beige.50"
              rounded="10px"
              mb={2.5}
              fontSize="14px"
              color="neutral.800"
            >
              <Text
                as="span"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="12px"
                color="primary.500"
                fontWeight="600"
                minW="72px"
              >
                {ing.quantity}
                {ing.unit ? ` ${ing.unit}` : ''}
              </Text>
              <Text as="span">{ing.name}</Text>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          textAlign="center"
          p={6}
          bg="beige.50"
          border="1.5px dashed"
          borderColor="beige.200"
          rounded="16px"
        >
          <Text fontSize="13px" color="neutral.500">
            Nenhum ingrediente ainda.
          </Text>
        </Box>
      )}
    </EditableBlock>
  );
}
