import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '@/shared/components/ui/toaster';
import {
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} from '../hooks/useRecipes';
import type { Ingredient } from '../types';

interface Props {
  recipeId: number;
  ingredients: Ingredient[];
}

interface EditState {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

export function IngredientList({ recipeId, ingredients }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [edit, setEdit] = useState<EditState | null>(null);

  const addMut = useAddIngredientMutation();
  const updateMut = useUpdateIngredientMutation();
  const deleteMut = useDeleteIngredientMutation();

  async function handleAdd() {
    if (!newName.trim()) return;
    try {
      await addMut.mutateAsync({ recipeId, dto: { name: newName.trim(), quantity: newQty || '', unit: newUnit || '' } });
      setNewName(''); setNewQty(''); setNewUnit('');
      setAdding(false);
    } catch {
      toaster.create({ title: 'Erro ao adicionar ingrediente', type: 'error' });
    }
  }

  async function handleUpdate() {
    if (!edit) return;
    try {
      await updateMut.mutateAsync({ id: edit.id, dto: { name: edit.name, quantity: edit.quantity || '', unit: edit.unit || '' } });
      setEdit(null);
    } catch {
      toaster.create({ title: 'Erro ao atualizar ingrediente', type: 'error' });
    }
  }

  async function handleRemove(id: number) {
    try {
      await deleteMut.mutateAsync(id);
    } catch {
      toaster.create({ title: 'Erro ao remover ingrediente', type: 'error' });
    }
  }

  const saving = addMut.isPending || updateMut.isPending;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold" fontSize="lg">Ingredientes</Text>
        <Button size="sm" colorPalette="primary" variant="ghost" onClick={() => setAdding(true)}>
          + Adicionar
        </Button>
      </Flex>

      <Flex direction="column" gap={2}>
        {ingredients.map((ing) =>
          edit?.id === ing.id ? (
            <Flex key={ing.id} gap={2} align="center">
              <Input
                size="sm"
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                placeholder="Nome"
              />
              <Input
                size="sm"
                value={edit.quantity}
                onChange={(e) => setEdit({ ...edit, quantity: e.target.value })}
                placeholder="Qtd"
                w="80px"
              />
              <Input
                size="sm"
                value={edit.unit}
                onChange={(e) => setEdit({ ...edit, unit: e.target.value })}
                placeholder="Unidade"
                w="80px"
              />
              <IconButton size="sm" aria-label="Salvar" variant="ghost" loading={saving} onClick={handleUpdate}>✓</IconButton>
              <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setEdit(null)}>✕</IconButton>
            </Flex>
          ) : (
            <Flex
              key={ing.id}
              align="center"
              gap={2}
              p={2}
              rounded="md"
              _hover={{ bg: 'beige.100' }}
              role="group"
            >
              <Text flex={1} fontSize="sm">
                {ing.quantity && <Text as="span" fontWeight="medium">{ing.quantity}{ing.unit ? ` ${ing.unit}` : ''} </Text>}
                {ing.name}
              </Text>
              <Flex gap={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                <IconButton size="xs" aria-label="Editar" variant="ghost" onClick={() => setEdit({ id: ing.id, name: ing.name, quantity: ing.quantity ?? '', unit: ing.unit ?? '' })}>✏️</IconButton>
                <IconButton size="xs" aria-label="Remover" variant="ghost" colorPalette="red" onClick={() => handleRemove(ing.id)}>🗑</IconButton>
              </Flex>
            </Flex>
          )
        )}
      </Flex>

      {adding && (
        <Flex gap={2} mt={3} align="center">
          <Input size="sm" placeholder="Nome do ingrediente" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
          <Input size="sm" placeholder="Qtd" value={newQty} onChange={(e) => setNewQty(e.target.value)} w="80px" />
          <Input size="sm" placeholder="Unid." value={newUnit} onChange={(e) => setNewUnit(e.target.value)} w="80px" />
          <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={handleAdd}>✓</IconButton>
          <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setAdding(false)}>✕</IconButton>
        </Flex>
      )}
    </Box>
  );
}
