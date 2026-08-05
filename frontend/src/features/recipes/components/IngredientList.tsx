import { Box, Flex, Input } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import { AddRowButton } from '@/shared/components/ui/AddRowButton';
import { RemoveRowButton } from '@/shared/components/ui/RemoveRowButton';
import { useDraftRows, type DraftRow } from '@/shared/hooks/useDraftRows';
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

interface IngredientFields {
  amount: string;
  name: string;
  order: number;
}

export const IngredientList = forwardRef<IngredientListHandle, Props>(
  function IngredientList({ recipeId, ingredients }, ref) {
    const { rows, setRows, deletedIds, addRow, updateRow } = useDraftRows<
      Ingredient,
      IngredientFields
    >(ingredients, (i) => ({
      serverId: i.id,
      fields: { amount: i.amount, name: i.name, order: i.order },
    }));
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
          const hasContent = row.serverId || row.fields.name.trim() || row.fields.amount.trim();
          if (hasContent && (!row.fields.name.trim() || !row.fields.amount.trim())) {
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
            row.fields.amount === original.amount &&
            row.fields.name === original.name &&
            row.fields.order === original.order;
          if (unchanged) continue;
          try {
            await updateMut.mutateAsync({
              id: row.serverId,
              dto: {
                name: row.fields.name.trim(),
                amount: row.fields.amount.trim(),
                order: idx + 1,
              },
            });
          } catch (err) {
            toast.error(getApiErrorMessage(err, 'Erro ao atualizar ingrediente'));
          }
        }

        for (const [idx, row] of rows.entries()) {
          if (row.serverId || invalid.has(row.tempId)) continue;
          if (!row.fields.name.trim() && !row.fields.amount.trim()) continue;
          try {
            await addMut.mutateAsync({
              recipeId,
              dto: {
                name: row.fields.name.trim(),
                amount: row.fields.amount.trim(),
                order: idx + 1,
              },
            });
          } catch (err) {
            toast.error(getApiErrorMessage(err, 'Erro ao adicionar ingrediente'));
          }
        }
      },
    }));

    function handleUpdateRow(tempId: string, field: 'amount' | 'name', value: string) {
      updateRow(tempId, { [field]: value });
      setRowErrors((prev) => {
        if (!prev.has(tempId)) return prev;
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }

    function handleRemoveRow(row: DraftRow<IngredientFields>) {
      setRows((prev) =>
        prev
          .filter((r) => r.tempId !== row.tempId)
          .map((r, idx) => ({ ...r, fields: { ...r.fields, order: idx + 1 } }))
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
                  value={row.fields.amount}
                  onChange={(e) => handleUpdateRow(row.tempId, 'amount', e.target.value)}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="12px"
                  fontWeight="600"
                  color="primary.600"
                  bg="primary.50"
                  border="1.5px solid"
                  borderColor={invalid && !row.fields.amount.trim() ? 'red.400' : 'transparent'}
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
                  value={row.fields.name}
                  onChange={(e) => handleUpdateRow(row.tempId, 'name', e.target.value)}
                  flex={1}
                  bg="white"
                  fontSize="14px"
                  color="neutral.800"
                  border="1.5px solid"
                  borderColor={invalid && !row.fields.name.trim() ? 'red.400' : 'transparent'}
                  px={3}
                  py={2}
                  h="auto"
                  placeholder="Nome do ingrediente"
                />

                <RemoveRowButton onClick={() => handleRemoveRow(row)} />
              </Flex>
            );
          })}
        </Flex>

        <AddRowButton
          mt={2.5}
          onClick={() => addRow({ amount: '', name: '', order: rows.length + 1 })}
        >
          + Adicionar ingrediente
        </AddRowButton>
      </Box>
    );
  }
);
