import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useUploadPhotoMutation } from '../hooks/usePhotoMutations';

export function useRecipePhotoUpload(recipeId: number) {
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadMut = useUploadPhotoMutation();

  async function handlePhotoUpload(file: File, type: 'COVER' | 'USER') {
    setUploading(true);
    try {
      await uploadMut.mutateAsync({ file, type, recipeId });
      toast.success(type === 'COVER' ? 'Capa atualizada!' : 'Foto adicionada!');
    } catch {
      toast.error('Erro ao enviar foto');
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
