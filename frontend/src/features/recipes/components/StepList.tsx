import { Box, Button, Flex, Textarea } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import {
  useAddStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from '../hooks/useRecipes';
import type { Step } from '../types';

export interface StepListHandle {
  save: () => Promise<void>;
}

interface Props {
  recipeId: number;
  steps: Step[];
}

interface LocalStep {
  tempId: string;
  serverId?: number;
  description: string;
}

let tempCounter = 0;

export const StepList = forwardRef<StepListHandle, Props>(
  function StepList({ recipeId, steps }, ref) {
    const [rows, setRows] = useState<LocalStep[]>(() =>
      steps.map((s) => ({
        tempId: `existing-${s.id}`,
        serverId: s.id,
        description: s.description,
      }))
    );
    const [deletedIds] = useState(() => new Set<number>());

    const addMut = useAddStepMutation();
    const updateMut = useUpdateStepMutation();
    const deleteMut = useDeleteStepMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        for (const id of deletedIds) {
          try {
            await deleteMut.mutateAsync(id);
          } catch {
            toast.error('Erro ao remover passo');
          }
        }

        for (const row of rows) {
          if (!row.serverId) continue;
          const original = steps.find((s) => s.id === row.serverId);
          if (!original) continue;
          if (row.description === original.description) continue;
          try {
            await updateMut.mutateAsync({
              id: row.serverId,
              dto: { description: row.description },
            });
          } catch {
            toast.error('Erro ao atualizar passo');
          }
        }

        for (const [idx, row] of rows.entries()) {
          if (row.serverId) continue;
          if (!row.description.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: { description: row.description.trim(), order: idx + 1 },
            });
          } catch {
            toast.error('Erro ao adicionar passo');
          }
        }
      },
    }));

    function addRow() {
      setRows((prev) => [
        ...prev,
        { tempId: `new-${++tempCounter}`, description: '' },
      ]);
    }

    function updateDescription(tempId: string, value: string) {
      setRows((prev) =>
        prev.map((r) => (r.tempId === tempId ? { ...r, description: value } : r))
      );
    }

    function removeRow(row: LocalStep) {
      setRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
      if (row.serverId !== undefined) {
        deletedIds.add(row.serverId);
      }
    }

    return (
      <Box>
        <Flex direction="column" gap={3}>
          {rows.map((row, index) => (
            <Flex key={row.tempId} gap={3} align="flex-start">
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
                mt="6px"
              >
                {index + 1}
              </Flex>
              <Textarea
                flex={1}
                value={row.description}
                onChange={(e) => updateDescription(row.tempId, e.target.value)}
                rows={2}
                bg="white"
                fontSize="14px"
                px={3}
                py={2.5}
                resize="vertical"
                lineHeight={1.5}
                placeholder="Descreva o passo..."
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
          mt={3}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          bg="transparent"
          _hover={{ bg: 'beige.50' }}
          onClick={addRow}
        >
          + Adicionar passo
        </Button>
      </Box>
    );
  }
);
