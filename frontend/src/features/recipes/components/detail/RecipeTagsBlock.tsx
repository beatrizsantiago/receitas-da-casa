import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { TagSelector } from '../TagSelector';
import type { Recipe, Tag } from '../../types';
import type { RecipeDrafts, RecipeDraftSetters } from '../../hooks/useRecipeDrafts';

interface RecipeTagsBlockProps {
  recipe: Recipe;
  drafts: RecipeDrafts;
  setters: RecipeDraftSetters;
  allTags: Tag[];
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}

export function RecipeTagsBlock({
  recipe,
  drafts,
  setters,
  allTags,
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
        <Box>
          <TagSelector selected={drafts.tags} onChange={setters.setTags} />
          {allTags.length > 0 && (
            <Box mt={2.5}>
              <Text
                fontSize="11px"
                color="neutral.500"
                fontWeight="600"
                letterSpacing="0.05em"
                textTransform="uppercase"
                mb={1.5}
              >
                Das suas tags
              </Text>
              <Flex gap={1.5} flexWrap="wrap">
                {allTags
                  .filter(
                    (ut) =>
                      !drafts.tags.some(
                        (t) => t.name === ut.name.toLowerCase()
                      )
                  )
                  .map((ut) => (
                    <Box
                      key={ut.id}
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                      px={2.5}
                      py={1}
                      rounded="full"
                      fontSize="12px"
                      fontWeight="600"
                      cursor="pointer"
                      style={{
                        backgroundColor: ut.color + '22',
                        color: ut.color,
                        border: `1px solid ${ut.color}44`,
                      }}
                      onClick={() =>
                        setters.setTags((prev) => [
                          ...prev,
                          { name: ut.name.toLowerCase(), color: ut.color },
                        ])
                      }
                    >
                      + #{ut.name}
                    </Box>
                  ))}
              </Flex>
            </Box>
          )}
        </Box>
      }
    >
      {recipe.tags && recipe.tags.length > 0 ? (
        <Flex gap={1.5} flexWrap="wrap">
          {recipe.tags.map((t) => (
            <Box
              key={t.tag.id}
              as="span"
              display="inline-flex"
              px={2.5}
              py={1}
              rounded="full"
              fontSize="12px"
              fontWeight="600"
              style={{
                backgroundColor: t.tag.color + '22',
                color: t.tag.color,
                border: `1px solid ${t.tag.color}44`,
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
