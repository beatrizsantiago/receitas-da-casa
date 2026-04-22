import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useRecipe } from '../hooks/useRecipes';
import { recipesService } from '../services/recipes.service';
import { IngredientList } from '../components/IngredientList';
import { StepList } from '../components/StepList';
import { NotesList } from '../components/NotesList';
import { TagSelector } from '../components/TagSelector';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { toaster } from '../../../components/ui/toaster';
import type { RecipeCategory } from '../types';

const CATEGORY_LABEL: Record<string, string> = {
  SWEET: 'Doce',
  SAVORY: 'Salgado',
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = Number(id);
  const { recipe, isLoading, error, refetch } = useRecipe(recipeId);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<RecipeCategory>('SAVORY');
  const [editTags, setEditTags] = useState<{ name: string; color: string }[]>([]);
  const [savingBasic, setSavingBasic] = useState(false);

  function startEditing() {
    if (!recipe) return;
    setEditTitle(recipe.title);
    setEditDescription(recipe.description ?? '');
    setEditCategory(recipe.category);
    setEditTags(recipe.tags?.map((t) => ({ name: t.tag.name.toLowerCase(), color: t.tag.color })) ?? []);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function saveBasicInfo() {
    if (!editTitle.trim()) {
      toaster.create({ title: 'Título é obrigatório', type: 'error' });
      return;
    }
    setSavingBasic(true);
    try {
      await recipesService.update(recipeId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        category: editCategory,
      });

      // sync tags: remove old, add new
      const currentTags = recipe?.tags?.map((t) => ({ id: t.tag.id, name: t.tag.name.toLowerCase() })) ?? [];
      const newTagNames = editTags.map((t) => t.name);

      for (const ct of currentTags) {
        if (!newTagNames.includes(ct.name)) {
          try {
            await recipesService.removeTag(recipeId, ct.id);
          } catch { /* ignore */ }
        }
      }

      for (const nt of editTags) {
        if (!currentTags.some((ct) => ct.name === nt.name)) {
          try {
            await recipesService.addTag(recipeId, { name: nt.name, color: nt.color });
          } catch { /* ignore */ }
        }
      }

      toaster.create({ title: 'Receita atualizada', type: 'success' });
      setIsEditing(false);
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Erro ao atualizar receita';
      toaster.create({ title: Array.isArray(msg) ? msg[0] : msg, type: 'error' });
    } finally {
      setSavingBasic(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await recipesService.remove(recipeId);
      toaster.create({ title: 'Receita excluída', type: 'success' });
      navigate('/receitas');
    } catch {
      toaster.create({ title: 'Erro ao excluir receita', type: 'error' });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (isLoading) {
    return (
      <Box minH="100vh" bg="beige.100">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Box minH="100vh" bg="beige.100">
        <EmptyState title="Receita não encontrada" />
      </Box>
    );
  }

  const cover = recipe.photos?.find((p) => p.type === 'COVER');

  return (
    <Box minH="100vh" bg="beige.100">
      <Flex as="nav" bg="white" shadow="sm" px={6} py={4} justify="space-between" align="center">
        <Heading size="lg" color="primary.600">Receitas da Casa</Heading>
        <Flex gap={4}>
          <Button variant="ghost" onClick={() => navigate('/receitas')}>Minhas Receitas</Button>
          <Button colorPalette="primary" onClick={() => navigate('/receitas/nova')}>+ Nova Receita</Button>
        </Flex>
      </Flex>

      <Box maxW="900px" mx="auto" p={6}>
        <VStack align="start" gap={6} w="full">
          <Box bg="white" p={5} rounded="xl" shadow="sm" w="full">
            <Flex w="full" justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
              {isEditing ? (
                <VStack align="stretch" gap={3} flex={1}>
                  <Field.Root>
                    <Field.Label>Título</Field.Label>
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Descrição</Field.Label>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                    />
                  </Field.Root>
                  <Field.Root maxW="200px">
                    <Field.Label>Categoria</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as RecipeCategory)}
                      >
                        <option value="SAVORY">Salgado</option>
                        <option value="SWEET">Doce</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <TagSelector selected={editTags} onChange={setEditTags} />
                </VStack>
              ) : (
                <Box>
                  <Flex gap={3} align="center" mb={2}>
                    <Heading size="xl">{recipe.title}</Heading>
                    <Badge colorPalette={recipe.category === 'SWEET' ? 'yellow' : 'secondary'}>
                      {CATEGORY_LABEL[recipe.category]}
                    </Badge>
                  </Flex>
                  {recipe.description && <Text color="neutral.600">{recipe.description}</Text>}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <Flex gap={1} mt={2} flexWrap="wrap">
                      {recipe.tags.map((t) => (
                        <Badge
                          key={t.tag.id}
                          px={2}
                          py={0.5}
                          rounded="md"
                          fontSize="xs"
                          style={{ backgroundColor: t.tag.color, color: '#fff' }}
                        >
                          {t.tag.name}
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </Box>
              )}

              <Flex gap={2}>
                {isEditing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={cancelEditing} disabled={savingBasic}>
                      Cancelar
                    </Button>
                    <Button size="sm" colorPalette="primary" loading={savingBasic} onClick={saveBasicInfo}>
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={startEditing}>
                      Editar
                    </Button>
                    <Button size="sm" colorPalette="red" variant="outline" onClick={() => setDeleteOpen(true)}>
                      Excluir
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>

            {cover && (
              <Image
                src={cover.url}
                alt={recipe.title}
                w="full"
                h="300px"
                objectFit="cover"
                rounded="xl"
                mt={4}
              />
            )}
          </Box>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} w="full">
            <Box bg="white" p={5} rounded="xl" shadow="sm">
              <IngredientList
                recipeId={recipe.id}
                ingredients={recipe.ingredients ?? []}
                onRefresh={refetch}
              />
            </Box>
            <Box bg="white" p={5} rounded="xl" shadow="sm">
              <StepList recipeId={recipe.id} steps={recipe.steps ?? []} onRefresh={refetch} />
            </Box>
          </Grid>

          <Box bg="white" p={5} rounded="xl" shadow="sm" w="full">
            <NotesList recipeId={recipe.id} notes={recipe.notes ?? []} onRefresh={refetch} />
          </Box>

          {recipe.cookHistory && recipe.cookHistory.length > 0 && (
            <Box bg="white" p={5} rounded="xl" shadow="sm" w="full">
              <Heading size="md" mb={4}>Histórico de Cozinhadas</Heading>
              <VStack align="start" gap={3}>
                {recipe.cookHistory.map((h) => (
                  <Box key={h.id} p={3} bg="beige.50" rounded="md" w="full">
                    <Flex justify="space-between">
                      <Text fontWeight="medium">
                        {new Date(h.date).toLocaleDateString('pt-BR')}
                      </Text>
                      {h.rating != null && <Text>⭐ {h.rating}/5</Text>}
                    </Flex>
                    {h.notes && (
                      <Text fontSize="sm" color="neutral.600" mt={1}>
                        {h.notes}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir receita"
        description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
}
