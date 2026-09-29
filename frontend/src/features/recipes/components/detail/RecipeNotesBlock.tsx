import { useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { EmptyHint } from '@/shared/components/ui/EmptyHint';
import { NotesList, type NotesListHandle } from '../NotesList';
import type { Recipe } from '../../types';

interface RecipeNotesBlockProps {
  recipe: Recipe;
  recipeId: number;
  onCancel: () => void;
}

export function RecipeNotesBlock({
  recipe,
  recipeId,
  onCancel,
}: RecipeNotesBlockProps) {
  const listRef = useRef<NotesListHandle>(null);

  return (
    <EditableBlock
      eyebrow="das suas margens"
      title="Anotações"
      onSave={async () => {
        await listRef.current?.save();
      }}
      onCancel={onCancel}
      editor={
        <NotesList
          ref={listRef}
          recipeId={recipeId}
          notes={recipe.notes ?? []}
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
              borderLeft="3px solid"
              borderColor="yellow.300"
            >
              <Text
                fontSize="11px"
                fontWeight="550"
                color="#7A5A10"
                letterSpacing="0.04em"
                mb={1}
              >
                {note.createdAt && (
                  <>
                    {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {' · '}
                    {new Date(note.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </>
                )}
              </Text>
              <Text
                fontFamily="'Caveat', cursive"
                fontSize="18px"
                color="#4A3B12"
                lineHeight={1.35}
              >
                {note.content}
              </Text>
            </Box>
          ))}
        </Flex>
      ) : (
        <EmptyHint>Nenhuma anotação ainda.</EmptyHint>
      )}
    </EditableBlock>
  );
}
