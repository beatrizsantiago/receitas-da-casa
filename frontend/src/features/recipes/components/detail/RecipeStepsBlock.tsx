import { useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { StepList, type StepListHandle } from '../StepList';
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
      {recipe.steps && recipe.steps.length > 0 ? (
        <Box as="ol" listStyleType="none" p={0} m={0}>
          {recipe.steps.map((step, i) => (
            <Box key={step.id} as="li" display="flex" alignItems="center" gap={3.5} mb={3.5}>
              <Flex
                w="32px"
                h="32px"
                rounded="full"
                bg="primary.500"
                color="white"
                align="center"
                justify="center"
                fontFamily="'Fraunces', Georgia, serif"
                fontSize="14px"
                fontWeight="500"
                fontStyle="italic"
                flexShrink={0}
              >
                {i + 1}
              </Flex>
              <Text
                flex={1}
                fontSize="14px"
                color="neutral.800"
                lineHeight={1.55}
              >
                {step.description}
              </Text>
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
            Nenhum passo ainda.
          </Text>
        </Box>
      )}
    </EditableBlock>
  );
}
