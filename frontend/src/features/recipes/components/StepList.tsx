import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '@/shared/components/ui/toaster';
import {
  useAddStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from '../hooks/useRecipes';
import type { Step } from '../types';

interface Props {
  recipeId: number;
  steps: Step[];
}

export function StepList({ recipeId, steps }: Props) {
  const [adding, setAdding] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');

  const addMut = useAddStepMutation();
  const updateMut = useUpdateStepMutation();
  const deleteMut = useDeleteStepMutation();

  async function handleAdd() {
    if (!newDesc.trim()) return;
    try {
      await addMut.mutateAsync({ recipeId, dto: { description: newDesc.trim(), order: steps.length + 1 } });
      setNewDesc('');
      setAdding(false);
    } catch {
      toaster.create({ title: 'Erro ao adicionar passo', type: 'error' });
    }
  }

  async function handleUpdate(id: number) {
    try {
      await updateMut.mutateAsync({ id, dto: { description: editDesc } });
      setEditId(null);
    } catch {
      toaster.create({ title: 'Erro ao atualizar passo', type: 'error' });
    }
  }

  async function handleRemove(id: number) {
    try {
      await deleteMut.mutateAsync(id);
    } catch {
      toaster.create({ title: 'Erro ao remover passo', type: 'error' });
    }
  }

  const saving = addMut.isPending || updateMut.isPending;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold" fontSize="lg">Modo de Preparo</Text>
        <Button size="sm" colorPalette="primary" variant="ghost" onClick={() => setAdding(true)}>
          + Adicionar
        </Button>
      </Flex>

      <Flex direction="column" gap={3}>
        {steps.map((step, index) => (
          <Flex key={step.id} gap={3} align="flex-start" role="group">
            <Flex w={8} h={8} rounded="full" bg="primary.500" color="white" align="center" justify="center" fontWeight="bold" fontSize="sm" flexShrink={0} mt={editId === step.id ? 0 : 1}>
              {index + 1}
            </Flex>

            {editId === step.id ? (
              <Flex flex={1} direction="column" gap={2}>
                <Textarea size="sm" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} />
                <Flex gap={2}>
                  <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={() => handleUpdate(step.id)}>✓</IconButton>
                  <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setEditId(null)}>✕</IconButton>
                </Flex>
              </Flex>
            ) : (
              <Flex flex={1} align="flex-start" gap={2}>
                <Text flex={1} fontSize="sm" pt={1}>{step.description}</Text>
                <Flex gap={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                  <IconButton size="xs" aria-label="Editar" variant="ghost" onClick={() => { setEditId(step.id); setEditDesc(step.description); }}>✏️</IconButton>
                  <IconButton size="xs" aria-label="Remover" variant="ghost" colorPalette="red" onClick={() => handleRemove(step.id)}>🗑</IconButton>
                </Flex>
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>

      {adding && (
        <Box mt={4}>
          <Flex gap={3} align="flex-start">
            <Flex w={8} h={8} rounded="full" bg="neutral.200" color="neutral.600" align="center" justify="center" fontWeight="bold" fontSize="sm" flexShrink={0}>
              {steps.length + 1}
            </Flex>
            <Flex flex={1} direction="column" gap={2}>
              <Textarea size="sm" placeholder="Descreva o passo..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} />
              <Flex gap={2}>
                <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={handleAdd}>✓</IconButton>
                <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setAdding(false)}>✕</IconButton>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
