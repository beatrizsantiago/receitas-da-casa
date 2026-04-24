import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, useBreakpointValue } from '@chakra-ui/react';
import { LuCheck, LuPencil } from 'react-icons/lu';
import { CoverUploader } from '@/shared/components/ui/CoverUploader';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { toaster } from '@/shared/components/ui/toaster';
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
import { tagsService } from '@/features/tags/services/tags.service';
import { RecipeCoverSection } from '../components/detail/RecipeCoverSection';
import { RecipeTitleBlock } from '../components/detail/RecipeTitleBlock';
import { RecipeTagsBlock } from '../components/detail/RecipeTagsBlock';
import { RecipeIngredientsBlock } from '../components/detail/RecipeIngredientsBlock';
import { RecipeStepsBlock } from '../components/detail/RecipeStepsBlock';
import { RecipeNotesBlock } from '../components/detail/RecipeNotesBlock';
import { RecipeHistorySection } from '../components/detail/RecipeHistorySection';
import { RecipeGallerySection } from '../components/detail/RecipeGallerySection';
import type { Tag } from '../types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = Number(id);
  const { data: recipe, isLoading, error } = useRecipeQuery(recipeId);
  const mobile = useBreakpointValue({ base: true, md: false });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const { drafts, setters, initDrafts } = useRecipeDrafts();
  const {
    uploading,
    coverInputRef,
    galleryInputRef,
    onCoverFileChange,
    onGalleryFileChange,
    handlePhotoUpload,
  } = useRecipePhotoUpload(recipeId);

  const updateRecipe = useUpdateRecipeMutation();
  const deleteRecipe = useDeleteRecipeMutation();
  const addTagMut = useAddTagToRecipeMutation();
  const removeTagMut = useRemoveTagFromRecipeMutation();
  const addHistoryMut = useAddHistoryMutation();

  useEffect(() => {
    tagsService.list().then(setAllTags).catch(() => {});
  }, []);

  useEffect(() => {
    initDrafts(recipe);
  }, [recipe?.id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteRecipe.mutateAsync(recipeId);
      toaster.create({ title: 'Receita apagada', type: 'success' });
      navigate('/receitas');
    } catch {
      toaster.create({ title: 'Erro ao excluir receita', type: 'error' });
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
          rating: 5,
          ...(notes ? { notes } : {}),
        },
      });
      toaster.create({
        title: 'Bom apetite! Registrado no histórico.',
        type: 'success',
      });
    } catch {
      toaster.create({ title: 'Erro ao registrar histórico', type: 'error' });
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
          await addTagMut.mutateAsync({
            recipeId,
            dto: { name: nt.name, color: nt.color },
          });
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
      <Box position="relative">
        <RecipeCoverSection
          recipe={recipe}
          onBack={() => navigate('/receitas')}
          onDeleteClick={() => setDeleteOpen(true)}
          onEditCover={() => {
            initDrafts();
            setEditingCover(true);
          }}
          onCoverFileChange={onCoverFileChange}
          coverInputRef={coverInputRef}
          uploading={uploading}
        />

        {editingCover && (
          <Box
            position="fixed"
            inset={0}
            bg="rgba(47,30,10,0.55)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={mobile ? 4 : 7}
            zIndex={1000}
          >
            <Box
              bg="white"
              rounded="16px"
              p={mobile ? 4 : 5}
              maxW="520px"
              w="full"
              boxShadow="0 20px 40px rgba(0,0,0,0.25)"
            >
              <Box
                fontFamily="'Fraunces', Georgia, serif"
                fontSize="18px"
                fontWeight="500"
                color="neutral.800"
                mb={3}
                letterSpacing="-0.01em"
              >
                Alterar foto de capa
              </Box>
              <CoverUploader
                cover={drafts.cover.cover}
                hues={drafts.cover.hues}
                onChange={(c, h) =>
                  setters.setCover((prev) => ({
                    cover: c,
                    hues: h || prev.hues,
                  }))
                }
              />
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                mt={3.5}
                pt={3.5}
                borderTopWidth="1px"
                borderColor="beige.100"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  fontSize="13px"
                  fontWeight="550"
                  onClick={() => {
                    initDrafts();
                    setEditingCover(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  bg="primary.500"
                  color="white"
                  size="sm"
                  fontSize="13px"
                  fontWeight="550"
                  rounded="10px"
                  display="inline-flex"
                  alignItems="center"
                  gap={1.5}
                  boxShadow="0 6px 14px rgba(196,74,47,0.25)"
                  loading={uploading}
                  onClick={() => {
                    void handlePhotoUpload(new File([], 'cover.jpg'), 'COVER');
                    setEditingCover(false);
                  }}
                >
                  <LuCheck size={14} />
                  Salvar
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

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
          allTags={allTags}
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
          photos={recipe.photos}
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
