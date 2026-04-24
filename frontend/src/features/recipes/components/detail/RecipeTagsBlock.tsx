import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { TagSelector } from '../TagSelector';
import type { Recipe } from '../../types';
import type { RecipeDrafts, RecipeDraftSetters } from '../../hooks/useRecipeDrafts';

interface RecipeTagsBlockProps {
  recipe: Recipe;
  drafts: RecipeDrafts;
  setters: RecipeDraftSetters;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}

export function RecipeTagsBlock({
  recipe,
  drafts,
  setters,
  onSave,
  onCancel,
}: RecipeTagsBlockProps) {
  return (
    <EditableBlock
      eyebrow="marque com"
      title="Tags"
      onSave={onSave}
      onCancel={onCancel}
      editor={
        <TagSelector selected={drafts.tags} onChange={setters.setTags} />
      }
    >
      {recipe.tags && recipe.tags.length > 0 ? (
        <Flex gap={1.5} flexWrap="wrap">
          {recipe.tags.map((t) => (
            <Box
              key={t.tag.id}
              as="span"
              display="inline-flex"
              px={3}
              py={1}
              rounded="full"
              fontSize="12px"
              fontWeight="600"
              style={{
                backgroundColor: t.tag.color + '18',
                color: t.tag.color,
              }}
            >
              #{t.tag.name}
            </Box>
          ))}
        </Flex>
      ) : (
        <Text color="neutral.400" fontStyle="italic" fontSize="13px">
          Nenhuma tag ainda.
        </Text>
      )}
    </EditableBlock>
  );
}
