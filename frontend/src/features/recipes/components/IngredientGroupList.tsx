import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import { AddRowButton } from '@/shared/components/ui/AddRowButton';
import { RemoveRowButton } from '@/shared/components/ui/RemoveRowButton';
import {
  useAddIngredientGroupMutation,
  useUpdateIngredientGroupMutation,
  useDeleteIngredientGroupMutation,
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} from '../hooks/useRecipes';
import { getApiErrorMessage } from '@/shared/utils/parseError';
import type { IngredientGroup } from '../types';

export interface IngredientGroupListHandle {
  save: () => Promise<void>;
}

interface Props {
  recipeId: number;
  ingredientGroups: IngredientGroup[];
}

interface LocalRow {
  tempId: string;
  serverId?: number;
  amount: string;
  name: string;
}

interface LocalGroup {
  tempId: string;
  serverId?: number;
  title: string;
  rows: LocalRow[];
  deletedRowIds: Set<number>;
}

let tempCounter = 0;

function makeLocalGroup(overrides: Partial<LocalGroup> = {}): LocalGroup {
  return {
    tempId: `new-${++tempCounter}`,
    title: '',
    rows: [],
    deletedRowIds: new Set(),
    ...overrides,
  };
}

export const IngredientGroupList = forwardRef<IngredientGroupListHandle, Props>(
  function IngredientGroupList({ recipeId, ingredientGroups }, ref) {
    const [groups, setGroups] = useState<LocalGroup[]>(() =>
      ingredientGroups.map((g) =>
        makeLocalGroup({
          tempId: `existing-${g.id}`,
          serverId: g.id,
          title: g.title ?? '',
          rows: g.ingredients.map((i) => ({
            tempId: `existing-row-${i.id}`,
            serverId: i.id,
            amount: i.amount,
            name: i.name,
          })),
        })
      )
    );
    const [deletedGroupIds] = useState(() => new Set<number>());
    const [rowErrors, setRowErrors] = useState<Set<string>>(new Set());

    const addGroupMut = useAddIngredientGroupMutation();
    const updateGroupMut = useUpdateIngredientGroupMutation();
    const deleteGroupMut = useDeleteIngredientGroupMutation();
    const addRowMut = useAddIngredientMutation();
    const updateRowMut = useUpdateIngredientMutation();
    const deleteRowMut = useDeleteIngredientMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        // 1. Delete removed groups (cascade deletes their ingredients)
        for (const groupId of deletedGroupIds) {
          try {
            await deleteGroupMut.mutateAsync(groupId);
          } catch {
            toast.error('Erro ao remover grupo de ingredientes');
          }
        }

        // Rows with any content (or already persisted) must have both
        // name and amount filled in — the backend rejects blank values.
        const invalid = new Set<string>();
        for (const group of groups) {
          for (const row of group.rows) {
            const hasContent = row.serverId || row.name.trim() || row.amount.trim();
            if (hasContent && (!row.name.trim() || !row.amount.trim())) {
              invalid.add(row.tempId);
            }
          }
        }
        setRowErrors(invalid);
        if (invalid.size > 0) {
          toast.error('Preencha nome e quantidade de todos os ingredientes');
        }

        for (const [groupIdx, group] of groups.entries()) {
          if (group.serverId) {
            // Update title and/or order if changed — order must stay compacted
            // (no gaps) since it's unique per recipe.
            const original = ingredientGroups.find((g) => g.id === group.serverId);
            const newOrder = groupIdx + 1;
            if (original && (group.title !== (original.title ?? '') || newOrder !== original.order)) {
              try {
                await updateGroupMut.mutateAsync({
                  id: group.serverId,
                  dto: { title: group.title || undefined, order: newOrder },
                });
              } catch {
                toast.error('Erro ao atualizar grupo de ingredientes');
              }
            }

            // Delete removed rows
            for (const rowId of group.deletedRowIds) {
              try {
                await deleteRowMut.mutateAsync(rowId);
              } catch {
                toast.error('Erro ao remover ingrediente');
              }
            }

            // Update changed rows
            for (const [rowIdx, row] of group.rows.entries()) {
              if (!row.serverId || invalid.has(row.tempId)) continue;
              const originalRow = original?.ingredients.find((i) => i.id === row.serverId);
              if (!originalRow) continue;
              const unchanged = row.amount === originalRow.amount && row.name === originalRow.name;
              if (unchanged) continue;
              try {
                await updateRowMut.mutateAsync({
                  id: row.serverId,
                  dto: { name: row.name.trim(), amount: row.amount.trim(), order: rowIdx + 1 },
                });
              } catch (err) {
                toast.error(getApiErrorMessage(err, 'Erro ao atualizar ingrediente'));
              }
            }

            // Create new rows
            for (const [rowIdx, row] of group.rows.entries()) {
              if (row.serverId || invalid.has(row.tempId)) continue;
              if (!row.name.trim() && !row.amount.trim()) continue;
              try {
                await addRowMut.mutateAsync({
                  ingredientGroupId: group.serverId,
                  dto: { name: row.name.trim(), amount: row.amount.trim(), order: rowIdx + 1 },
                });
              } catch (err) {
                toast.error(getApiErrorMessage(err, 'Erro ao adicionar ingrediente'));
              }
            }
          } else {
            // New group: skip if empty
            const hasContent =
              group.title.trim() || group.rows.some((r) => r.name.trim() || r.amount.trim());
            if (!hasContent) continue;

            try {
              const created = await addGroupMut.mutateAsync({
                recipeId,
                dto: { title: group.title || undefined, order: groupIdx + 1 },
              });

              for (const [rowIdx, row] of group.rows.entries()) {
                if (!row.name.trim() && !row.amount.trim()) continue;
                if (invalid.has(row.tempId)) continue;
                try {
                  await addRowMut.mutateAsync({
                    ingredientGroupId: created.id,
                    dto: { name: row.name.trim(), amount: row.amount.trim(), order: rowIdx + 1 },
                  });
                } catch (err) {
                  toast.error(getApiErrorMessage(err, 'Erro ao adicionar ingrediente'));
                }
              }
            } catch {
              toast.error('Erro ao adicionar grupo de ingredientes');
            }
          }
        }
      },
    }));

    function addGroup() {
      setGroups((prev) => [...prev, makeLocalGroup()]);
    }

    function removeGroup(group: LocalGroup) {
      setGroups((prev) => prev.filter((g) => g.tempId !== group.tempId));
      if (group.serverId !== undefined) {
        deletedGroupIds.add(group.serverId);
      }
    }

    function updateGroupTitle(tempId: string, value: string) {
      setGroups((prev) => prev.map((g) => (g.tempId === tempId ? { ...g, title: value } : g)));
    }

    function addRow(groupTempId: string) {
      setGroups((prev) =>
        prev.map((g) =>
          g.tempId === groupTempId
            ? { ...g, rows: [...g.rows, { tempId: `new-row-${++tempCounter}`, amount: '', name: '' }] }
            : g
        )
      );
    }

    function handleUpdateRow(groupTempId: string, rowTempId: string, field: 'amount' | 'name', value: string) {
      setGroups((prev) =>
        prev.map((g) =>
          g.tempId === groupTempId
            ? { ...g, rows: g.rows.map((r) => (r.tempId === rowTempId ? { ...r, [field]: value } : r)) }
            : g
        )
      );
      setRowErrors((prev) => {
        if (!prev.has(rowTempId)) return prev;
        const next = new Set(prev);
        next.delete(rowTempId);
        return next;
      });
    }

    function removeRow(groupTempId: string, row: LocalRow) {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.tempId !== groupTempId) return g;
          if (row.serverId !== undefined) {
            g.deletedRowIds.add(row.serverId);
          }
          return { ...g, rows: g.rows.filter((r) => r.tempId !== row.tempId) };
        })
      );
    }

    return (
      <Box>
        <Flex direction="column" gap={5}>
          {groups.map((group, groupIdx) => (
            <Box
              key={group.tempId}
              borderTop={groupIdx > 0 ? '1px solid' : undefined}
              borderColor="beige.200"
              pt={groupIdx > 0 ? 5 : 0}
            >
              {/* Group header */}
              <Flex align="center" gap={2} mb={3}>
                <Input
                  value={group.title}
                  onChange={(e) => updateGroupTitle(group.tempId, e.target.value)}
                  placeholder="Título do grupo (opcional)"
                  fontSize="13px"
                  fontWeight="600"
                  color="neutral.700"
                  bg="beige.50"
                  border="1px solid"
                  borderColor="beige.200"
                  rounded="8px"
                  px={3}
                  py={2}
                  h="auto"
                  flex={1}
                  _placeholder={{ color: 'neutral.400', fontWeight: '400' }}
                  _focus={{ borderColor: 'primary.300', boxShadow: 'none' }}
                />
                <RemoveRowButton onClick={() => removeGroup(group)} />
              </Flex>

              {/* Rows */}
              <Flex direction="column" gap={2}>
                {group.rows.map((row) => {
                  const invalid = rowErrors.has(row.tempId);
                  return (
                    <Flex key={row.tempId} align="center" gap={2}>
                      <Input
                        value={row.amount}
                        onChange={(e) => handleUpdateRow(group.tempId, row.tempId, 'amount', e.target.value)}
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
                        onChange={(e) => handleUpdateRow(group.tempId, row.tempId, 'name', e.target.value)}
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

                      <RemoveRowButton onClick={() => removeRow(group.tempId, row)} />
                    </Flex>
                  );
                })}
              </Flex>

              <AddRowButton
                color="neutral.400"
                fontSize="12px"
                mt={group.rows.length > 0 ? 2.5 : 0}
                onClick={() => addRow(group.tempId)}
              >
                + Adicionar ingrediente
              </AddRowButton>
            </Box>
          ))}
        </Flex>

        {groups.length === 0 && (
          <Text fontSize="13px" color="neutral.400" mb={3}>
            Nenhum grupo de ingredientes adicionado.
          </Text>
        )}

        <AddRowButton
          color="primary.500"
          borderColor="primary.200"
          hoverBg="primary.50"
          mt={groups.length > 0 ? 5 : 0}
          onClick={addGroup}
        >
          + Adicionar grupo de ingredientes
        </AddRowButton>
      </Box>
    );
  }
);
