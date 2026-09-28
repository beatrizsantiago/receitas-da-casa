import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useUploadPhotoMutation } from '../hooks/usePhotoMutations';
import { getApiErrorMessage } from '@/shared/utils/parseError';
import { isImageFile, prepareImageForUpload } from '@/shared/utils/prepareImage';

const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB — acima disso o proxy em produção rejeita o upload

export function useRecipePhotoUpload(recipeId: number) {
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadMut = useUploadPhotoMutation();

  async function handlePhotoUpload(original: File, type: 'COVER' | 'USER') {
    if (!isImageFile(original)) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }

    setUploading(true);
    try {
      const file = await prepareImageForUpload(original);
      if (file.size > MAX_PHOTO_SIZE) {
        toast.error('A imagem é muito grande. Escolha uma foto de até 8MB.');
        return;
      }
      await uploadMut.mutateAsync({ file, type, recipeId });
      toast.success(type === 'COVER' ? 'Capa atualizada!' : 'Foto adicionada!');
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 413) {
        toast.error('A imagem é muito grande para o servidor. Tente uma foto menor.');
      } else {
        toast.error(getApiErrorMessage(err, 'Erro ao enviar foto'));
      }
    } finally {
      setUploading(false);
    }
  }

  function onCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handlePhotoUpload(file, 'COVER');
    e.target.value = '';
  }

  function onGalleryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handlePhotoUpload(file, 'USER');
    e.target.value = '';
  }

  return {
    uploading,
    coverInputRef,
    galleryInputRef,
    onCoverFileChange,
    onGalleryFileChange,
  } as const;
}
