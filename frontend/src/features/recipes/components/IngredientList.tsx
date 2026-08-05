import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import {
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} from '../hooks/useRecipes';
import { getApiErrorMessage } from '@/shared/utils/parseError';
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
    const [rowErrors, setRowErrors] = useState<Set<string>>(new Set());

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

        // Rows with any content (or already persisted) must have both
        // name and amount filled in — the backend rejects blank values.
        const invalid = new Set<string>();
        for (const row of rows) {
          const hasContent = row.serverId || row.name.trim() || row.amount.trim();
          if (hasContent && (!row.name.trim() || !row.amount.trim())) {
            invalid.add(row.tempId);
          }
        }
        setRowErrors(invalid);
        if (invalid.size > 0) {
          toast.error('Preencha nome e quantidade de todos os ingredientes');
        }

        for (const [idx, row] of rows.entries()) {
          if (!row.serverId || invalid.has(row.tempId)) continue;
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
                name: row.name.trim(),
                amount: row.amount.trim(),
                order: idx + 1,
              },
            });
          } catch (err) {
            toast.error(getApiErrorMessage(err, 'Erro ao atualizar ingrediente'));
          }
        }

        for (const [idx, row] of rows.entries()) {
          if (row.serverId || invalid.has(row.tempId)) continue;
          if (!row.name.trim() && !row.amount.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: {
                name: row.name.trim(),
                amount: row.amount.trim(),
                order: idx + 1,
              },
            });
          } catch (err) {
            toast.error(getApiErrorMessage(err, 'Erro ao adicionar ingrediente'));
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
      setRowErrors((prev) => {
        if (!prev.has(tempId)) return prev;
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
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
          {rows.map((row) => {
            const invalid = rowErrors.has(row.tempId);
            return (
              <Flex key={row.tempId} align="center" gap={2}>
                <Input
                  value={row.amount}
                  onChange={(e) => updateRow(row.tempId, 'amount', e.target.value)}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="12px"
                  fontWeight="600"
                  color="primary.600"
                  bg="primary.50"
                  border="1.5px solid"
                  borderColor={invalid && !row.amount.trim() ? 'red.400' : 'transparent'}
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
                  border="1.5px solid"
                  borderColor={invalid && !row.name.trim() ? 'red.400' : 'transparent'}
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
            );
          })}
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
