import { useEffect, useState } from 'react';
import { useTagsQuery, useCreateTagMutation } from '@/features/tags/hooks/useTags';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { toast } from 'react-toastify';
import {
  useRecipeQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useAddTagToRecipeMutation,
  useRemoveTagFromRecipeMutation,
  useAddHistoryMutation,
} from '../hooks/useRecipes';
import { useRecipeDrafts } from '../hooks/useRecipeDrafts';
import { useRecipePhotoUpload } from '../hooks/useRecipePhotoUpload';
import { useUpdatePhotoPositionMutation } from '../hooks/usePhotoMutations';
import { RecipeCoverSection } from '../components/detail/RecipeCoverSection';
import { RecipeTitleBlock } from '../components/detail/RecipeTitleBlock';
import { RecipeTagsBlock } from '../components/detail/RecipeTagsBlock';
import { RecipeIngredientsBlock } from '../components/detail/RecipeIngredientsBlock';
import { RecipeStepsBlock } from '../components/detail/RecipeStepsBlock';
import { RecipeNotesBlock } from '../components/detail/RecipeNotesBlock';
import { RecipeHistorySection } from '../components/detail/RecipeHistorySection';
import { RecipeGallerySection } from '../components/detail/RecipeGallerySection';
export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = Number(id);
  const { data: recipe, isLoading, error } = useRecipeQuery(recipeId);
  const mobile = useBreakpointValue({ base: true, md: false });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: allTags = [] } = useTagsQuery();

  const { drafts, setters, initDrafts } = useRecipeDrafts();
  const {
    uploading,
    coverInputRef,
    galleryInputRef,
    onCoverFileChange,
    onGalleryFileChange,
  } = useRecipePhotoUpload(recipeId);

  const updateRecipe = useUpdateRecipeMutation();
  const deleteRecipe = useDeleteRecipeMutation();
  const addTagMut = useAddTagToRecipeMutation();
  const removeTagMut = useRemoveTagFromRecipeMutation();
  const addHistoryMut = useAddHistoryMutation();
  const updatePositionMut = useUpdatePhotoPositionMutation();
  const createTagMut = useCreateTagMutation();

  async function handleSavePosition(photoId: number, positionY: number) {
    await updatePositionMut.mutateAsync({ photoId, positionY, recipeId });
  }

  useEffect(() => {
    initDrafts(recipe);
  }, [recipe?.id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteRecipe.mutateAsync(recipeId);
      toast.success('Receita apagada');
      navigate('/receitas');
    } catch {
      toast.error('Erro ao excluir receita');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function addHistory(notes?: string) {
    try {
      await addHistoryMut.mutateAsync({
        recipeId,
        dto: {
          date: new Date().toISOString(),
          ...(notes ? { notes } : {}),
        },
      });
      toast.success('Bom apetite! Registrado no histórico.');
    } catch {
      toast.error('Erro ao registrar histórico');
    }
  }

  async function saveTitleBlock() {
    await updateRecipe.mutateAsync({
      id: recipeId,
      dto: {
        title: drafts.title.trim(),
        description: drafts.description.trim() || undefined,
        category: drafts.category,
      },
    });
    const currentTags =
      recipe?.tags?.map((t) => ({
        id: t.tag.id,
        name: t.tag.name.toLowerCase(),
      })) ?? [];
    const newNames = drafts.tags.map((t) => t.name);
    for (const ct of currentTags) {
      if (!newNames.includes(ct.name)) {
        try {
          await removeTagMut.mutateAsync({ recipeId, tagId: ct.id });
        } catch {
          /* ignore */
        }
      }
    }
    for (const nt of drafts.tags) {
      if (!currentTags.some((ct) => ct.name === nt.name)) {
        try {
          const existingTag = allTags.find(
            (t) => t.name.toLowerCase() === nt.name.toLowerCase()
          );
          if (existingTag) {
            await addTagMut.mutateAsync({ recipeId, tagId: existingTag.id });
          } else {
            const newTag = await createTagMut.mutateAsync({ name: nt.name, color: nt.color });
            await addTagMut.mutateAsync({ recipeId, tagId: newTag.id });
          }
        } catch {
          /* ignore */
        }
      }
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

  const isEmpty = !recipe.title?.trim();

  return (
    <Box minH="100vh" bg="beige.100" pb={mobile ? 20 : 16}>
      <RecipeCoverSection
        recipe={recipe}
        onBack={() => navigate('/receitas')}
        onDeleteClick={() => setDeleteOpen(true)}
        onCoverFileChange={onCoverFileChange}
        coverInputRef={coverInputRef}
        uploading={uploading}
        onSavePosition={handleSavePosition}
      />

      <Box
        maxW="900px"
        mx="auto"
        px={mobile ? 5 : 10}
        py={mobile ? 5 : 7}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        {isEmpty && (
          <Box
            bg="yellow.50"
            rounded="12px"
            p={3}
            fontSize="13px"
            color="#7A5A10"
            display="flex"
            alignItems="center"
            gap={2.5}
          >
            <Box color="yellow.500" display="flex">
              <LuPencil size={16} />
            </Box>
            Edite os blocos abaixo para preencher sua nova receita.
          </Box>
        )}

        <RecipeTitleBlock
          recipe={recipe}
          drafts={drafts}
          setters={setters}
          onSave={saveTitleBlock}
          onCancel={initDrafts}
        />
        <RecipeTagsBlock
          recipe={recipe}
          drafts={drafts}
          setters={setters}
          onSave={saveTitleBlock}
          onCancel={initDrafts}
        />
        <RecipeIngredientsBlock
          recipe={recipe}
          recipeId={recipeId}
          onCancel={initDrafts}
        />
        <RecipeStepsBlock
          recipe={recipe}
          recipeId={recipeId}
          onCancel={initDrafts}
        />
        <RecipeNotesBlock
          recipe={recipe}
          recipeId={recipeId}
          onCancel={initDrafts}
        />
        <RecipeHistorySection
          history={recipe.cookHistory}
          onAddHistory={addHistory}
        />
        <RecipeGallerySection
          photos={recipe.photos?.filter((p) => p.type === 'USER')}
          onGalleryFileChange={onGalleryFileChange}
          galleryInputRef={galleryInputRef}
          recipeId={recipeId}
        />
      </Box>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Apagar "${recipe.title || 'esta receita'}"?`}
        description="Essa ação não pode ser desfeita. A receita, suas anotações e seu histórico serão removidos para sempre do seu caderno."
        confirmLabel="Apagar receita"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
}
