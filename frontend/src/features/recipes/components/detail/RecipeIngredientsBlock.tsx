import { useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { IngredientList, type IngredientListHandle } from '../IngredientList';
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
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <Flex direction="column" gap={2}>
          {recipe.ingredients.map((ing) => (
            <Box
              key={ing.id}
              display="flex"
              alignItems="center"
              bg="beige.50"
              rounded="10px"
              gap={3}
            >
              <Text
                as="span"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="12px"
                color="primary.500"
                fontWeight="600"
                px={3.5}
                py={2.5}
                minW="90px"
                flexShrink={0}
              >
                {ing.quantity}
                {ing.unit ? ` ${ing.unit}` : ''}
              </Text>
              <Text as="span" flex={1} fontSize="14px" color="neutral.800">
                {ing.name}
              </Text>
            </Box>
          ))}
        </Flex>
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
