import { useState } from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { useBreakpointValue } from '@chakra-ui/react';
import {
  useTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
} from '../hooks/useTags';
import { useRecipesQuery } from '@/features/recipes/hooks/useRecipes';
import { useTagStats } from '../hooks/useTagStats';
import { TagForm } from '../components/TagForm';
import { TagList } from '../components/TagList';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { getApiErrorMessage } from '@/shared/utils/parseError';

const randomColor = () => {
  const colors = [
    '#C44A2F', '#5E6F3A', '#D4AE3F', '#88321F',
    '#4A4A4A', '#B69332', '#6A2617', '#394522',
    '#2F2F2F', '#7E654A', '#A63E27', '#4B5A2E',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function TagsPage() {
  const mobile = useBreakpointValue({ base: true, md: false });
  const { data: tagsData } = useTagsQuery();
  const { data: recipesData } = useRecipesQuery({ limit: 1000 });
  const tags = tagsData ?? [];
  const recipes = recipesData?.data ?? [];

  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: '', color: randomColor() });
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);

  const createTag = useCreateTagMutation();
  const deleteTag = useDeleteTagMutation();
  const { countFor } = useTagStats(recipes);

  const startNew = () => {
    setDraft({ name: '', color: randomColor() });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setDraft({ name: '', color: randomColor() });
  };

  const save = async () => {
    const name = draft.name.trim();
    if (!name) return;
    try {
      await createTag.mutateAsync({ name, color: draft.color });
      toast.success('Tag criada');
      cancel();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Erro ao salvar tag'));
    }
  };

  const remove = async () => {
    if (deleteTagId == null) return;
    try {
      await deleteTag.mutateAsync(deleteTagId);
      toast.success('Tag removida');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Erro ao remover tag'));
    } finally {
      setDeleteTagId(null);
    }
  };

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 5 : 8} pb={mobile ? 24 : 16}>
      <Flex justify="space-between" align="flex-end" gap={4} mb={6}>
        <Box>
          <Text
            fontFamily="'Caveat', cursive"
            fontSize="20px"
            color="primary.500"
            lineHeight={1}
          >
            organize seu caderno
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '28px' : '34px'}
            fontWeight="500"
            letterSpacing="-0.02em"
            color="neutral.800"
            lineHeight={1.1}
            mt={0.5}
          >
            Tags
          </Heading>
          <Text fontSize="13px" color="neutral.400" mt={1}>
            Crie as etiquetas que você usa para marcar receitas.
          </Text>
        </Box>
        {!showForm && (
          <Button
            bg="primary.500"
            color="white"
            fontWeight="550"
            fontSize="13px"
            px={4}
            flexShrink={0}
            _hover={{ bg: 'primary.600' }}
            onClick={startNew}
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            boxShadow="0 6px 14px rgba(196,74,47,0.25)"
          >
            <LuPlus size={15} />
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
          mutationError={createTag.error as never}
        />
      )}

      {tags.length === 0 && !showForm ? (
        <Box
          textAlign="center"
          p={10}
          bg="beige.50"
          border="1.5px dashed"
          borderColor="beige.200"
          rounded="16px"
        >
          <Text fontSize="4xl" mb={2}>🏷️</Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="20px"
            fontWeight="500"
            color="neutral.800"
            mb={1}
          >
            Nenhuma tag criada
          </Heading>
          <Text fontSize="13px" color="neutral.500" lineHeight={1.5} maxW="320px" mx="auto">
            Tags ajudam a encontrar receitas pela ocasião, ingrediente principal ou humor.
          </Text>
          <Box mt={4}>
            <Button
              bg="primary.500"
              color="white"
              fontWeight="550"
              fontSize="13px"
              px={4}
              _hover={{ bg: 'primary.600' }}
              onClick={startNew}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              boxShadow="0 6px 14px rgba(196,74,47,0.25)"
            >
              <LuPlus size={15} />
              Criar primeira tag
            </Button>
          </Box>
        </Box>
      ) : (
        <TagList
          tags={tags}
          countFor={countFor}
          onDelete={setDeleteTagId}
          mobile={!!mobile}
        />
      )}

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
