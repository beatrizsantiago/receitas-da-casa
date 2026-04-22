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
  Text,
} from '@chakra-ui/react';
import { recipesService } from '../services/recipes.service';
import { toaster } from '../../../components/ui/toaster';
import { TagSelector } from './TagSelector';
import type { Recipe, RecipeCategory } from '../types';

interface Props {
  recipe?: Recipe;
}

interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}

interface StepInput {
  description: string;
}

interface NoteInput {
  content: string;
  description: string;
  priority: number;
}

export function RecipeForm({ recipe }: Props) {
  const navigate = useNavigate();
  const isEdit = !!recipe;
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(recipe?.title ?? '');
  const [description, setDescription] = useState(recipe?.description ?? '');
  const [category, setCategory] = useState<RecipeCategory>(recipe?.category ?? 'SAVORY');
  const [tags, setTags] = useState<{ name: string; color: string }[]>(
    recipe?.tags?.map((t) => ({ name: t.tag.name.toLowerCase(), color: t.tag.color })) ?? []
  );

  const [ingredients, setIngredients] = useState<IngredientInput[]>([]);
  const [steps, setSteps] = useState<StepInput[]>([]);
  const [notes, setNotes] = useState<NoteInput[]>([]);

  function addIngredient() {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  }

  function updateIngredient(index: number, field: keyof IngredientInput, value: string) {
    const next = [...ingredients];
    next[index][field] = value;
    setIngredients(next);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function addStep() {
    setSteps([...steps, { description: '' }]);
  }

  function updateStep(index: number, value: string) {
    const next = [...steps];
    next[index].description = value;
    setSteps(next);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function addNote() {
    setNotes([...notes, { content: '', description: '', priority: 0 }]);
  }

  function updateNote(index: number, field: keyof NoteInput, value: string | number) {
    const next = [...notes];
    (next[index][field] as unknown) = value;
    setNotes(next);
  }

  function removeNote(index: number) {
    setNotes(notes.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toaster.create({ title: 'Título é obrigatório', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      let recipeId = recipe?.id;

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      };

      if (isEdit && recipeId) {
        await recipesService.update(recipeId, payload);
      } else {
        const created = await recipesService.create(payload);
        recipeId = created.id;
      }

      if (recipeId) {
        for (const tag of tags) {
          try {
            await recipesService.addTag(recipeId, { name: tag.name, color: tag.color });
          } catch {
            // ignore duplicate tag errors
          }
        }

        if (!isEdit) {
          for (const ing of ingredients) {
            if (!ing.name.trim()) continue;
            await recipesService.addIngredient(recipeId, {
              name: ing.name.trim(),
              quantity: ing.quantity || '',
              unit: ing.unit || '',
            });
          }

          for (let i = 0; i < steps.length; i++) {
            if (!steps[i].description.trim()) continue;
            await recipesService.addStep(recipeId, {
              description: steps[i].description.trim(),
              order: i + 1,
            });
          }

          for (const note of notes) {
            if (!note.content.trim()) continue;
            await recipesService.addNote(recipeId, {
              content: note.content.trim(),
              ...(note.description ? { description: note.description } : {}),
              ...(note.priority > 0 ? { priority: note.priority } : {}),
            });
          }
        }
      }

      toaster.create({
        title: isEdit ? 'Receita atualizada' : 'Receita criada',
        type: 'success',
      });
      navigate(`/receitas/${recipeId}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Erro ao salvar receita';
      toaster.create({
        title: Array.isArray(msg) ? msg[0] : msg,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        <Box bg="white" p={6} rounded="xl" shadow="sm">
          <Heading size="sm" mb={4} color="primary.600">
            Informações Básicas
          </Heading>
          <VStack gap={4} align="stretch">
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
          </VStack>
        </Box>

        <Box bg="white" p={6} rounded="xl" shadow="sm">
          <TagSelector selected={tags} onChange={setTags} />
        </Box>

        {!isEdit && (
          <>
            <Box bg="white" p={6} rounded="xl" shadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="primary.600">
                  Ingredientes
                </Heading>
                <Button size="sm" variant="outline" onClick={addIngredient}>
                  + Adicionar
                </Button>
              </Flex>
              <VStack gap={3} align="stretch">
                {ingredients.map((ing, i) => (
                  <Flex key={i} gap={2} align="center">
                    <Input
                      size="sm"
                      placeholder="Nome"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(i, 'name', e.target.value)
                      }
                      flex={2}
                    />
                    <Input
                      size="sm"
                      placeholder="Qtd"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(i, 'quantity', e.target.value)
                      }
                      w="80px"
                    />
                    <Input
                      size="sm"
                      placeholder="Unid"
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(i, 'unit', e.target.value)
                      }
                      w="80px"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => removeIngredient(i)}
                    >
                      ✕
                    </Button>
                  </Flex>
                ))}
                {ingredients.length === 0 && (
                  <Text color="neutral.500" fontSize="sm">
                    Nenhum ingrediente adicionado.
                  </Text>
                )}
              </VStack>
            </Box>

            <Box bg="white" p={6} rounded="xl" shadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="primary.600">
                  Modo de Preparo
                </Heading>
                <Button size="sm" variant="outline" onClick={addStep}>
                  + Adicionar passo
                </Button>
              </Flex>
              <VStack gap={3} align="stretch">
                {steps.map((step, i) => (
                  <Flex key={i} gap={2} align="flex-start">
                    <Flex
                      w={8}
                      h={8}
                      rounded="full"
                      bg="primary.500"
                      color="white"
                      align="center"
                      justify="center"
                      fontWeight="bold"
                      fontSize="sm"
                      flexShrink={0}
                    >
                      {i + 1}
                    </Flex>
                    <Textarea
                      size="sm"
                      placeholder="Descreva o passo"
                      value={step.description}
                      onChange={(e) => updateStep(i, e.target.value)}
                      rows={2}
                      flex={1}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => removeStep(i)}
                      mt={1}
                    >
                      ✕
                    </Button>
                  </Flex>
                ))}
                {steps.length === 0 && (
                  <Text color="neutral.500" fontSize="sm">
                    Nenhum passo adicionado.
                  </Text>
                )}
              </VStack>
            </Box>

            <Box bg="white" p={6} rounded="xl" shadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="primary.600">
                  Anotações
                </Heading>
                <Button size="sm" variant="outline" onClick={addNote}>
                  + Adicionar nota
                </Button>
              </Flex>
              <VStack gap={3} align="stretch">
                {notes.map((note, i) => (
                  <Flex key={i} direction="column" gap={2} p={3} bg="beige.50" rounded="md">
                    <Input
                      size="sm"
                      placeholder="Conteúdo"
                      value={note.content}
                      onChange={(e) =>
                        updateNote(i, 'content', e.target.value)
                      }
                    />
                    <Input
                      size="sm"
                      placeholder="Descrição (opcional)"
                      value={note.description}
                      onChange={(e) =>
                        updateNote(i, 'description', e.target.value)
                      }
                    />
                    <Flex gap={2} align="center">
                      <Input
                        size="sm"
                        type="number"
                        placeholder="Prioridade"
                        value={note.priority}
                        onChange={(e) =>
                          updateNote(i, 'priority', Number(e.target.value))
                        }
                        maxW="100px"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => removeNote(i)}
                      >
                        Remover
                      </Button>
                    </Flex>
                  </Flex>
                ))}
                {notes.length === 0 && (
                  <Text color="neutral.500" fontSize="sm">
                    Nenhuma nota adicionada.
                  </Text>
                )}
              </VStack>
            </Box>
          </>
        )}

        <Flex gap={3} justify="flex-end">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" colorPalette="primary" loading={saving}>
            {isEdit ? 'Salvar alterações' : 'Criar receita'}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
