import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { NotesList } from '../NotesList';
import type { Recipe } from '../../types';

interface RecipeNotesBlockProps {
  recipe: Recipe;
  recipeId: number;
  notes: { content: string; description?: string; priority?: number }[];
  onCancel: () => void;
}

export function RecipeNotesBlock({
  recipe,
  recipeId,
  notes,
  onCancel,
}: RecipeNotesBlockProps) {
  return (
    <EditableBlock
      eyebrow="das suas margens"
      title="Anotações"
      onSave={async () => {}}
      onCancel={onCancel}
      editor={
        <NotesList
          recipeId={recipeId}
          notes={notes.map((n, idx) => ({
            ...n,
            id: idx,
            recipeId,
            priority: n.priority ?? 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))}
        />
      }
    >
      {recipe.notes && recipe.notes.length > 0 ? (
        <Flex direction="column" gap={2.5}>
          {recipe.notes.map((note) => (
            <Box
              key={note.id}
              position="relative"
              bg="yellow.50"
              rounded="12px"
              p={3.5}
              pl={5}
              borderLeft="3px solid"
              borderColor="yellow.400"
            >
              <Text
                fontSize="11px"
                fontWeight="550"
                color="#7A5A10"
                letterSpacing="0.04em"
                textTransform="uppercase"
                mb={1}
              >
                {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Text
                fontFamily="'Caveat', cursive"
                fontSize="18px"
                color="#4A3B12"
                lineHeight={1.35}
              >
                {note.content}
              </Text>
              {note.description && (
                <Text fontSize="12px" color="neutral.500" mt={1}>
                  {note.description}
                </Text>
              )}
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
            Nenhuma anotação ainda.
          </Text>
        </Box>
      )}
    </EditableBlock>
  );
}
