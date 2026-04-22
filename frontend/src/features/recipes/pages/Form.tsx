import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { recipesService } from '../services/recipes.service';
import { toaster } from '../../../components/ui/toaster';
import type { RecipeCategory } from '../types';

export default function RecipeCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('SAVORY');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toaster.create({ title: 'Título é obrigatório', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const created = await recipesService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      toaster.create({ title: 'Receita criada!', type: 'success' });
      navigate(`/receitas/${created.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Erro ao criar receita';
      toaster.create({
        title: Array.isArray(msg) ? msg[0] : msg,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box minH="100vh" bg="beige.100">
      <Flex as="nav" bg="white" shadow="sm" px={6} py={4} justify="space-between" align="center">
        <Heading size="lg" color="primary.600">Receitas da Casa</Heading>
        <Flex gap={4}>
          <Button variant="ghost" onClick={() => navigate('/receitas')}>Minhas Receitas</Button>
        </Flex>
      </Flex>

      <Box maxW="600px" mx="auto" p={6}>
        <Heading size="lg" mb={6} color="primary.600">Nova Receita</Heading>
        <Box bg="white" p={6} rounded="xl" shadow="sm">
          <VStack as="form" onSubmit={handleSubmit} gap={4} align="stretch">
            <Field.Root>
              <Field.Label>Título</Field.Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da receita"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Descrição</Field.Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma breve descrição"
                rows={3}
              />
            </Field.Root>

            <Field.Root maxW="200px">
              <Field.Label>Categoria</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                >
                  <option value="SAVORY">Salgado</option>
                  <option value="SWEET">Doce</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <Flex gap={3} justify="flex-end" mt={2}>
              <Button variant="outline" onClick={() => navigate('/receitas')} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" colorPalette="primary" loading={saving}>
                Criar receita
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
