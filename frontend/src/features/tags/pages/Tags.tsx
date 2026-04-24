import { useState } from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { useBreakpointValue } from '@chakra-ui/react';
import { useTagsQuery, useCreateTagMutation, useDeleteTagMutation } from '../hooks/useTags';
import { useRecipesQuery } from '@/features/recipes/hooks/useRecipes';
import { useTagStats } from '../hooks/useTagStats';
import { TagForm } from '../components/TagForm';
import { TagList } from '../components/TagList';
import { PALETTE } from '../utils/constants';
import { toaster } from '@/shared/components/ui/toaster';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { getApiErrorMessage } from '@/shared/utils/parseError';

export default function TagsPage() {
  const mobile = useBreakpointValue({ base: true, md: false });
  const { data: tagsData } = useTagsQuery();
  const { data: recipesData } = useRecipesQuery({ limit: 1000 });
  const tags = tagsData ?? [];
  const recipes = recipesData?.data ?? [];

  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: '', color: PALETTE[0] });
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);

  const createTag = useCreateTagMutation();
  const deleteTag = useDeleteTagMutation();
  const { countFor } = useTagStats(recipes);

  const startNew = () => {
    setShowForm(true);
    setDraft({ name: '', color: PALETTE[Math.floor(Math.random() * PALETTE.length)] });
  };

  const cancel = () => {
    setShowForm(false);
    setDraft({ name: '', color: PALETTE[0] });
  };

  const save = async () => {
    const name = draft.name.trim();
    if (!name) return;
    try {
      await createTag.mutateAsync({ name, color: draft.color });
      toaster.create({ title: 'Tag criada', type: 'success' });
      cancel();
    } catch (err: unknown) {
      toaster.create({ title: getApiErrorMessage(err, 'Erro ao salvar tag'), type: 'error' });
    }
  };

  const remove = async () => {
    if (deleteTagId == null) return;
    try {
      await deleteTag.mutateAsync(deleteTagId);
      toaster.create({ title: 'Tag removida', type: 'success' });
    } catch (err: unknown) {
      toaster.create({ title: getApiErrorMessage(err, 'Erro ao remover tag'), type: 'error' });
    } finally {
      setDeleteTagId(null);
    }
  };

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 5 : 8} pb={mobile ? 24 : 16}>
      <Flex justify="space-between" align="flex-end" gap={4} mb={5}>
        <Box>
          <Text fontFamily="'Caveat', cursive" fontSize="22px" color="primary.500" lineHeight={1}>
            organize seu caderno
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '28px' : '34px'}
            fontWeight="500"
            letterSpacing="-0.02em"
            color="neutral.800"
            mt={0.5}
          >
            Tags
          </Heading>
          <Text fontSize="13px" color="neutral.500" mt={1}>
            Crie etiquetas para organizar suas receitas.
          </Text>
        </Box>
        {!showForm && (
          <Button
            bg="primary.500"
            color="white"
            fontWeight="550"
            fontSize="14px"
            letterSpacing="-0.005em"
            rounded="12px"
            px={5}
            py={2.5}
            h="42px"
            _hover={{ bg: 'primary.600' }}
            onClick={startNew}
            display="inline-flex"
            alignItems="center"
            gap={2}
            boxShadow="0 6px 14px rgba(196,74,47,0.25)"
          >
            <LuPlus size={16} />
            Nova tag
          </Button>
        )}
      </Flex>

      {showForm && (
        <TagForm
          draft={draft}
          onChange={setDraft}
          onSave={save}
          onCancel={cancel}
          isPending={createTag.isPending}
          mobile={!!mobile}
        />
      )}

      {tags.length === 0 && !showForm && (
        <Box textAlign="center" p={10} bg="beige.50" border="1.5px dashed" borderColor="beige.200" rounded="16px">
          <Text fontSize="4xl" mb={2}>🏷️</Text>
          <Heading fontFamily="'Fraunces', Georgia, serif" fontSize="20px" fontWeight="500" color="neutral.800" mb={1}>
            Nenhuma tag criada
          </Heading>
          <Text fontSize="13px" color="neutral.500" lineHeight={1.5} maxW="320px" mx="auto">
            Tags ajudam a encontrar receitas pela ocasião, ingrediente principal ou humor. Crie a primeira.
          </Text>
          <Box mt={3.5}>
            <Button
              bg="primary.500"
              color="white"
              fontWeight="550"
              fontSize="14px"
              rounded="12px"
              px={5}
              py={2.5}
              h="42px"
              _hover={{ bg: 'primary.600' }}
              onClick={startNew}
              display="inline-flex"
              alignItems="center"
              gap={2}
              boxShadow="0 6px 14px rgba(196,74,47,0.25)"
            >
              <LuPlus size={16} />
              Criar tag
            </Button>
          </Box>
        </Box>
      )}

      <TagList tags={tags} countFor={countFor} onDelete={setDeleteTagId} mobile={!!mobile} />

      <ConfirmDialog
        open={deleteTagId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTagId(null); }}
        title="Apagar tag?"
        description="Se essa tag estiver sendo usada em receitas, ela não poderá ser excluída."
        confirmLabel="Apagar tag"
        onConfirm={remove}
      />
    </Box>
  );
}
