import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import {
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} from '../hooks/useRecipes';
import type { Ingredient } from '../types';

export interface IngredientListHandle {
  save: () => Promise<void>;
}

interface Props {
  recipeId: number;
  ingredients: Ingredient[];
}

interface LocalRow {
  tempId: string;
  serverId?: number;
  amount: string;
  name: string;
  order: number;
}

let tempCounter = 0;

export const IngredientList = forwardRef<IngredientListHandle, Props>(
  function IngredientList({ recipeId, ingredients }, ref) {
    const [rows, setRows] = useState<LocalRow[]>(() =>
      ingredients.map((i) => ({
        tempId: `existing-${i.id}`,
        serverId: i.id,
        amount: i.amount,
        name: i.name,
        order: i.order,
      }))
    );
    const [deletedIds] = useState(() => new Set<number>());

    const addMut = useAddIngredientMutation();
    const updateMut = useUpdateIngredientMutation();
    const deleteMut = useDeleteIngredientMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        for (const id of deletedIds) {
          try {
            await deleteMut.mutateAsync(id);
          } catch {
            toast.error('Erro ao remover ingrediente');
          }
        }

        for (const [idx, row] of rows.entries()) {
          if (!row.serverId) continue;
          const original = ingredients.find((i) => i.id === row.serverId);
          if (!original) continue;
          const unchanged =
            row.amount === original.amount &&
            row.name === original.name &&
            row.order === original.order;
          if (unchanged) continue;
          try {
            await updateMut.mutateAsync({
              id: row.serverId,
              dto: {
                name: row.name,
                amount: row.amount,
                order: idx + 1,
              },
            });
          } catch {
            toast.error('Erro ao atualizar ingrediente');
          }
        }

        for (const [idx, row] of rows.entries()) {
          if (row.serverId) continue;
          if (!row.name.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: {
                name: row.name.trim(),
                amount: row.amount,
                order: idx + 1,
              },
            });
          } catch {
            toast.error('Erro ao adicionar ingrediente');
          }
        }
      },
    }));

    function addRow() {
      setRows((prev) => [
        ...prev,
        {
          tempId: `new-${++tempCounter}`,
          amount: '',
          name: '',
          order: prev.length + 1,
        },
      ]);
    }

    function updateRow(
      tempId: string,
      field: 'amount' | 'name',
      value: string
    ) {
      setRows((prev) =>
        prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
      );
    }

    function removeRow(row: LocalRow) {
      setRows((prev) =>
        prev
          .filter((r) => r.tempId !== row.tempId)
          .map((r, idx) => ({ ...r, order: idx + 1 }))
      );
      if (row.serverId !== undefined) {
        deletedIds.add(row.serverId);
      }
    }

    return (
      <Box>
        <Flex direction="column" gap={2}>
          {rows.map((row) => (
            <Flex key={row.tempId} align="center" gap={2}>
              <Input
                value={row.amount}
                onChange={(e) => updateRow(row.tempId, 'amount', e.target.value)}
                fontFamily="'JetBrains Mono', monospace"
                fontSize="12px"
                fontWeight="600"
                color="primary.600"
                bg="primary.50"
                border="none"
                rounded="8px"
                px={2.5}
                py={2}
                h="auto"
                w="120px"
                flexShrink={0}
                _focus={{ boxShadow: 'none' }}
                placeholder="Ex: 2 xícaras"
              />

              <Input
                value={row.name}
                onChange={(e) => updateRow(row.tempId, 'name', e.target.value)}
                flex={1}
                bg="white"
                fontSize="14px"
                color="neutral.800"
                px={3}
                py={2}
                h="auto"
                placeholder="Nome do ingrediente"
              />

              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="28px"
                h="28px"
                flexShrink={0}
                rounded="6px"
                color="neutral.300"
                cursor="pointer"
                border="none"
                bg="transparent"
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
          mt={2.5}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          bg="transparent"
          _hover={{ bg: 'beige.50' }}
          onClick={addRow}
        >
          + Adicionar ingrediente
        </Button>
      </Box>
    );
  }
);
