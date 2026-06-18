import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import {
  useAddPreparationMethodMutation,
  useUpdatePreparationMethodMutation,
  useDeletePreparationMethodMutation,
  useAddStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from '../hooks/useRecipes';
import type { PreparationMethod } from '../types';

export interface PreparationMethodListHandle {
  save: () => Promise<void>;
}

interface Props {
  recipeId: number;
  preparationMethods: PreparationMethod[];
}

interface LocalStep {
  tempId: string;
  serverId?: number;
  description: string;
}

interface LocalMethod {
  tempId: string;
  serverId?: number;
  title: string;
  steps: LocalStep[];
  deletedStepIds: Set<number>;
}

let tempCounter = 0;

function makeLocalMethod(overrides: Partial<LocalMethod> = {}): LocalMethod {
  return {
    tempId: `new-${++tempCounter}`,
    title: '',
    steps: [],
    deletedStepIds: new Set(),
    ...overrides,
  };
}

export const PreparationMethodList = forwardRef<PreparationMethodListHandle, Props>(
  function PreparationMethodList({ recipeId, preparationMethods }, ref) {
    const [methods, setMethods] = useState<LocalMethod[]>(() =>
      preparationMethods.map((m) =>
        makeLocalMethod({
          tempId: `existing-${m.id}`,
          serverId: m.id,
          title: m.title ?? '',
          steps: m.steps.map((s) => ({
            tempId: `existing-step-${s.id}`,
            serverId: s.id,
            description: s.description,
          })),
        })
      )
    );
    const [deletedMethodIds] = useState(() => new Set<number>());

    const addMethodMut = useAddPreparationMethodMutation();
    const updateMethodMut = useUpdatePreparationMethodMutation();
    const deleteMethodMut = useDeletePreparationMethodMutation();
    const addStepMut = useAddStepMutation();
    const updateStepMut = useUpdateStepMutation();
    const deleteStepMut = useDeleteStepMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        // 1. Delete removed methods (cascade deletes their steps)
        for (const methodId of deletedMethodIds) {
          try {
            await deleteMethodMut.mutateAsync(methodId);
          } catch {
            toast.error('Erro ao remover modo de preparo');
          }
        }

        for (const [methodIdx, method] of methods.entries()) {
          if (method.serverId) {
            // Update title if changed
            const original = preparationMethods.find((m) => m.id === method.serverId);
            if (original && method.title !== (original.title ?? '')) {
              try {
                await updateMethodMut.mutateAsync({
                  id: method.serverId,
                  dto: { title: method.title || undefined },
                });
              } catch {
                toast.error('Erro ao atualizar modo de preparo');
              }
            }

            // Delete removed steps
            for (const stepId of method.deletedStepIds) {
              try {
                await deleteStepMut.mutateAsync(stepId);
              } catch {
                toast.error('Erro ao remover passo');
              }
            }

            // Update changed steps
            for (const step of method.steps) {
              if (!step.serverId) continue;
              const originalStep = original?.steps.find((s) => s.id === step.serverId);
              if (!originalStep || step.description === originalStep.description) continue;
              try {
                await updateStepMut.mutateAsync({
                  id: step.serverId,
                  dto: { description: step.description },
                });
              } catch {
                toast.error('Erro ao atualizar passo');
              }
            }

            // Create new steps
            for (const [stepIdx, step] of method.steps.entries()) {
              if (step.serverId || !step.description.trim()) continue;
              try {
                await addStepMut.mutateAsync({
                  preparationMethodId: method.serverId,
                  dto: { description: step.description.trim(), order: stepIdx + 1 },
                });
              } catch {
                toast.error('Erro ao adicionar passo');
              }
            }
          } else {
            // New method: skip if empty
            const hasContent =
              method.title.trim() || method.steps.some((s) => s.description.trim());
            if (!hasContent) continue;

            try {
              const created = await addMethodMut.mutateAsync({
                recipeId,
                dto: { title: method.title || undefined, order: methodIdx + 1 },
              });

              for (const [stepIdx, step] of method.steps.entries()) {
                if (!step.description.trim()) continue;
                try {
                  await addStepMut.mutateAsync({
                    preparationMethodId: created.id,
                    dto: { description: step.description.trim(), order: stepIdx + 1 },
                  });
                } catch {
                  toast.error('Erro ao adicionar passo');
                }
              }
            } catch {
              toast.error('Erro ao adicionar modo de preparo');
            }
          }
        }
      },
    }));

    function addMethod() {
      setMethods((prev) => [...prev, makeLocalMethod()]);
    }

    function removeMethod(method: LocalMethod) {
      setMethods((prev) => prev.filter((m) => m.tempId !== method.tempId));
      if (method.serverId !== undefined) {
        deletedMethodIds.add(method.serverId);
      }
    }

    function updateMethodTitle(tempId: string, value: string) {
      setMethods((prev) =>
        prev.map((m) => (m.tempId === tempId ? { ...m, title: value } : m))
      );
    }

    function addStep(methodTempId: string) {
      setMethods((prev) =>
        prev.map((m) =>
          m.tempId === methodTempId
            ? {
                ...m,
                steps: [...m.steps, { tempId: `new-step-${++tempCounter}`, description: '' }],
              }
            : m
        )
      );
    }

    function updateStep(methodTempId: string, stepTempId: string, value: string) {
      setMethods((prev) =>
        prev.map((m) =>
          m.tempId === methodTempId
            ? {
                ...m,
                steps: m.steps.map((s) =>
                  s.tempId === stepTempId ? { ...s, description: value } : s
                ),
              }
            : m
        )
      );
    }

    function removeStep(methodTempId: string, step: LocalStep) {
      setMethods((prev) =>
        prev.map((m) => {
          if (m.tempId !== methodTempId) return m;
          if (step.serverId !== undefined) {
            m.deletedStepIds.add(step.serverId);
          }
          return { ...m, steps: m.steps.filter((s) => s.tempId !== step.tempId) };
        })
      );
    }

    return (
      <Box>
        <Flex direction="column" gap={5}>
          {methods.map((method, methodIdx) => (
            <Box
              key={method.tempId}
              borderTop={methodIdx > 0 ? '1px solid' : undefined}
              borderColor="beige.200"
              pt={methodIdx > 0 ? 5 : 0}
            >
              {/* Method header */}
              <Flex align="center" gap={2} mb={3}>
                <Input
                  value={method.title}
                  onChange={(e) => updateMethodTitle(method.tempId, e.target.value)}
                  placeholder="Título do modo de preparo (opcional)"
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
                  onClick={() => removeMethod(method)}
                >
                  <LuX size={14} />
                </Box>
              </Flex>

              {/* Steps */}
              <Flex direction="column" gap={3} pl={1}>
                {method.steps.map((step, stepIdx) => (
                  <Flex key={step.tempId} gap={3} align="flex-start">
                    <Flex
                      w="28px"
                      h="28px"
                      rounded="full"
                      bg="primary.500"
                      color="white"
                      align="center"
                      justify="center"
                      fontFamily="'Fraunces', Georgia, serif"
                      fontSize="13px"
                      fontWeight="500"
                      fontStyle="italic"
                      flexShrink={0}
                      mt="6px"
                    >
                      {stepIdx + 1}
                    </Flex>
                    <Textarea
                      flex={1}
                      value={step.description}
                      onChange={(e) => updateStep(method.tempId, step.tempId, e.target.value)}
                      rows={2}
                      bg="white"
                      fontSize="14px"
                      px={3}
                      py={2.5}
                      resize="vertical"
                      lineHeight={1.5}
                      placeholder="Descreva o passo..."
                    />
                    <Box
                      as="button"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      w="28px"
                      h="28px"
                      mt="6px"
                      rounded="6px"
                      color="neutral.300"
                      cursor="pointer"
                      border="none"
                      bg="transparent"
                      flexShrink={0}
                      _hover={{ color: 'red.400', bg: 'red.50' }}
                      onClick={() => removeStep(method.tempId, step)}
                    >
                      <LuX size={14} />
                    </Box>
                  </Flex>
                ))}
              </Flex>

              <Button
                w="full"
                variant="outline"
                borderStyle="dashed"
                borderColor="beige.200"
                color="neutral.400"
                fontSize="12px"
                fontWeight="500"
                mt={method.steps.length > 0 ? 3 : 0}
                display="inline-flex"
                alignItems="center"
                gap={1.5}
                bg="transparent"
                _hover={{ bg: 'beige.50' }}
                onClick={() => addStep(method.tempId)}
              >
                + Adicionar passo
              </Button>
            </Box>
          ))}
        </Flex>

        {methods.length === 0 && (
          <Text fontSize="13px" color="neutral.400" mb={3}>
            Nenhum modo de preparo adicionado.
          </Text>
        )}

        <Button
          w="full"
          variant="outline"
          borderStyle="dashed"
          borderColor="primary.200"
          color="primary.500"
          fontSize="13px"
          fontWeight="500"
          mt={methods.length > 0 ? 5 : 0}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          bg="transparent"
          _hover={{ bg: 'primary.50' }}
          onClick={addMethod}
        >
          + Adicionar modo de preparo
        </Button>
      </Box>
    );
  }
);
