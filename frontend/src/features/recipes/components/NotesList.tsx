import { Box, Flex, Textarea } from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import { AddRowButton } from '@/shared/components/ui/AddRowButton';
import { RemoveRowButton } from '@/shared/components/ui/RemoveRowButton';
import { useDraftRows } from '@/shared/hooks/useDraftRows';
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../hooks/useRecipes';
import type { Note } from '../types';

export interface NotesListHandle {
  save: () => Promise<void>;
}

interface Props {
  recipeId: number;
  notes: Note[];
}

interface NoteFields {
  content: string;
}

export const NotesList = forwardRef<NotesListHandle, Props>(
  function NotesList({ recipeId, notes }, ref) {
    const { rows, deletedIds, addRow, updateRow, removeRow } = useDraftRows<Note, NoteFields>(
      notes,
      (n) => ({ serverId: n.id, fields: { content: n.content } })
    );

    const addMut = useAddNoteMutation();
    const updateMut = useUpdateNoteMutation();
    const deleteMut = useDeleteNoteMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        for (const id of deletedIds) {
          try {
            await deleteMut.mutateAsync(id);
          } catch {
            toast.error('Erro ao remover anotação');
          }
        }

        for (const row of rows) {
          if (!row.serverId) continue;
          const original = notes.find((n) => n.id === row.serverId);
          if (!original) continue;
          if (row.fields.content === original.content) continue;
          try {
            await updateMut.mutateAsync({
              id: row.serverId,
              dto: { content: row.fields.content },
            });
          } catch {
            toast.error('Erro ao atualizar anotação');
          }
        }

        for (const row of rows) {
          if (row.serverId) continue;
          if (!row.fields.content.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: { content: row.fields.content.trim() },
            });
          } catch {
            toast.error('Erro ao adicionar anotação');
          }
        }
      },
    }));

    return (
      <Box>
        <Flex direction="column" gap={2.5}>
          {rows.map((row) => (
            <Flex key={row.tempId} gap={2} align="flex-start">
              <Textarea
                flex={1}
                value={row.fields.content}
                onChange={(e) => updateRow(row.tempId, { content: e.target.value })}
                rows={2}
                borderColor="yellow.200"
                bg="yellow.50"
                fontSize="15px"
                fontFamily="'Caveat', cursive"
                color="#4A3B12"
                px={3.5}
                py={3}
                resize="vertical"
                lineHeight={1.4}
                _focus={{ borderColor: 'yellow.300', boxShadow: 'none' }}
                placeholder="Escreva sua anotação..."
              />
              <RemoveRowButton mt="6px" onClick={() => removeRow(row)} />
            </Flex>
          ))}
        </Flex>

        <AddRowButton mt={2.5} onClick={() => addRow({ content: '' })}>
          + Adicionar anotação
        </AddRowButton>
      </Box>
    );
  }
);
