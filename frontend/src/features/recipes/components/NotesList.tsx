import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { toaster } from '@/shared/components/ui/toaster';
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../hooks/useRecipes';
import type { Note } from '../types';

interface Props {
  recipeId: number;
  notes: Note[];
}

export function NotesList({ recipeId, notes }: Props) {
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('0');
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const addMut = useAddNoteMutation();
  const updateMut = useUpdateNoteMutation();
  const deleteMut = useDeleteNoteMutation();

  async function handleAdd() {
    if (!content.trim()) return;
    try {
      await addMut.mutateAsync({
        recipeId,
        dto: {
          content: content.trim(),
          ...(description.trim() ? { description: description.trim() } : {}),
          ...(Number(priority) > 0 ? { priority: Number(priority) } : {}),
        },
      });
      setContent('');
      setDescription('');
      setPriority('0');
      setAdding(false);
    } catch {
      toaster.create({ title: 'Erro ao adicionar anotação', type: 'error' });
    }
  }

  async function handleUpdate(id: number) {
    try {
      await updateMut.mutateAsync({ id, dto: { content: editContent } });
      setEditId(null);
    } catch {
      toaster.create({ title: 'Erro ao atualizar anotação', type: 'error' });
    }
  }

  async function handleRemove(id: number) {
    try {
      await deleteMut.mutateAsync(id);
    } catch {
      toaster.create({ title: 'Erro ao remover anotação', type: 'error' });
    }
  }

  const saving = addMut.isPending || updateMut.isPending;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold" fontSize="lg">Anotações</Text>
        <Button size="sm" colorPalette="primary" variant="ghost" onClick={() => setAdding(true)}>
          + Adicionar
        </Button>
      </Flex>

      <Flex direction="column" gap={3}>
        {notes.map((note) =>
          editId === note.id ? (
            <Flex key={note.id} direction="column" gap={2} bg="beige.50" p={3} rounded="md">
              <Textarea size="sm" value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} />
              <Flex gap={2}>
                <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={() => handleUpdate(note.id)}>✓</IconButton>
                <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setEditId(null)}>✕</IconButton>
              </Flex>
            </Flex>
          ) : (
            <Flex key={note.id} direction="column" gap={1} p={3} bg={note.priority > 0 ? 'yellow.50' : 'beige.50'} rounded="md" role="group">
              <Flex justify="space-between" align="center">
                <Text fontWeight="medium" fontSize="sm">{note.content}</Text>
                <Flex gap={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                  <IconButton size="xs" aria-label="Editar" variant="ghost" onClick={() => { setEditId(note.id); setEditContent(note.content); }}>✏️</IconButton>
                  <IconButton size="xs" aria-label="Remover" variant="ghost" colorPalette="red" onClick={() => handleRemove(note.id)}>🗑</IconButton>
                </Flex>
              </Flex>
              {note.description && (
                <Text fontSize="xs" color="neutral.500">{note.description}</Text>
              )}
            </Flex>
          )
        )}
      </Flex>

      {adding && (
        <Flex direction="column" gap={2} mt={3} bg="white" p={3} rounded="md" shadow="sm">
          <Textarea size="sm" placeholder="Conteúdo da anotação" value={content} onChange={(e) => setContent(e.target.value)} rows={2} />
          <Input size="sm" placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input size="sm" type="number" placeholder="Prioridade (0+)" value={priority} onChange={(e) => setPriority(e.target.value)} maxW="120px" />
          <Flex gap={2}>
            <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={handleAdd}>✓</IconButton>
            <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setAdding(false)}>✕</IconButton>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
