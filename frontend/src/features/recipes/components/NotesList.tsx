import { Box, Button, Flex, Textarea } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
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

interface LocalNote {
  tempId: string;
  serverId?: number;
  content: string;
}

let tempCounter = 0;

export const NotesList = forwardRef<NotesListHandle, Props>(
  function NotesList({ recipeId, notes }, ref) {
    const [rows, setRows] = useState<LocalNote[]>(() =>
      notes.map((n) => ({
        tempId: `existing-${n.id}`,
        serverId: n.id,
        content: n.content,
      }))
    );
    const [deletedIds] = useState(() => new Set<number>());

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
          if (row.content === original.content) continue;
          try {
            await updateMut.mutateAsync({
              id: row.serverId,
              dto: { content: row.content },
            });
          } catch {
            toast.error('Erro ao atualizar anotação');
          }
        }

        for (const row of rows) {
          if (row.serverId) continue;
          if (!row.content.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: { content: row.content.trim() },
            });
          } catch {
            toast.error('Erro ao adicionar anotação');
          }
        }
      },
    }));

    function addRow() {
      setRows((prev) => [
        ...prev,
        { tempId: `new-${++tempCounter}`, content: '' },
      ]);
    }

    function updateContent(tempId: string, value: string) {
      setRows((prev) =>
        prev.map((r) => (r.tempId === tempId ? { ...r, content: value } : r))
      );
    }

    function removeRow(row: LocalNote) {
      setRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
      if (row.serverId !== undefined) {
        deletedIds.add(row.serverId);
      }
    }

    return (
      <Box>
        <Flex direction="column" gap={2.5}>
          {rows.map((row) => (
            <Flex key={row.tempId} gap={2} align="flex-start">
              <Textarea
                flex={1}
                value={row.content}
                onChange={(e) => updateContent(row.tempId, e.target.value)}
                rows={2}
                rounded="10px"
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
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="28px"
                h="28px"
                mt="6px"
                rounded="6px"
                color="neutral.300"
                cursor="pointer"
                border="none"
                bg="transparent"
                flexShrink={0}
                _hover={{ color: 'red.400', bg: 'red.50' }}
                onClick={() => removeRow(row)}
              >
                <LuX size={14} />
              </Box>
            </Flex>
          ))}
        </Flex>

        <Button
          w="full"
          variant="outline"
          borderStyle="dashed"
          borderColor="beige.200"
          color="neutral.500"
          fontSize="13px"
          fontWeight="500"
          rounded="10px"
          h="38px"
          mt={2.5}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          bg="transparent"
          _hover={{ bg: 'beige.50' }}
          onClick={addRow}
        >
          + Adicionar anotação
        </Button>
      </Box>
    );
  }
);
