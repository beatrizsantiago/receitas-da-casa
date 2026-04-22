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
import { toaster } from '../../../components/ui/toaster';
import { recipesService } from '../services/recipes.service';
import type { Note } from '../types';

interface Props {
  recipeId: number;
  notes: Note[];
  onRefresh: () => void;
}

export function NotesList({ recipeId, notes, onRefresh }: Props) {
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('0');
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  async function handleAdd() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await recipesService.addNote(recipeId, {
        content: content.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(Number(priority) > 0 ? { priority: Number(priority) } : {}),
      });
      setContent('');
      setDescription('');
      setPriority('0');
      setAdding(false);
      onRefresh();
    } catch {
      toaster.create({ title: 'Erro ao adicionar anotação', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: number) {
    setSaving(true);
    try {
      await recipesService.updateNote(id, { content: editContent });
      setEditId(null);
      onRefresh();
    } catch {
      toaster.create({ title: 'Erro ao atualizar anotação', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: number) {
    try {
      await recipesService.removeNote(id);
      onRefresh();
    } catch {
      toaster.create({ title: 'Erro ao remover anotação', type: 'error' });
    }
  }

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
              <Textarea
                size="sm"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
              />
              <Flex gap={2}>
                <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={() => handleUpdate(note.id)}>
                  ✓
                </IconButton>
                <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setEditId(null)}>
                  ✕
                </IconButton>
              </Flex>
            </Flex>
          ) : (
            <Flex
              key={note.id}
              direction="column"
              gap={1}
              p={3}
              bg={note.priority > 0 ? 'yellow.50' : 'beige.50'}
              rounded="md"
              role="group"
            >
              <Flex justify="space-between" align="center">
                <Text fontWeight="medium" fontSize="sm">{note.content}</Text>
                <Flex gap={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.15s">
                  <IconButton
                    size="xs"
                    aria-label="Editar"
                    variant="ghost"
                    onClick={() => { setEditId(note.id); setEditContent(note.content); }}
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    size="xs"
                    aria-label="Remover"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => handleRemove(note.id)}
                  >
                    🗑
                  </IconButton>
                </Flex>
              </Flex>
              {note.description && (
                <Text fontSize="xs" color="neutral.500">
                  {note.description}
                </Text>
              )}
            </Flex>
          )
        )}
      </Flex>

      {adding && (
        <Flex direction="column" gap={2} mt={3} bg="white" p={3} rounded="md" shadow="sm">
          <Textarea
            size="sm"
            placeholder="Conteúdo da anotação"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
          <Input
            size="sm"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            size="sm"
            type="number"
            placeholder="Prioridade (0+)"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            maxW="120px"
          />
          <Flex gap={2}>
            <IconButton size="sm" aria-label="Salvar" loading={saving} onClick={handleAdd}>
              ✓
            </IconButton>
            <IconButton size="sm" aria-label="Cancelar" variant="ghost" onClick={() => setAdding(false)}>
              ✕
            </IconButton>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
