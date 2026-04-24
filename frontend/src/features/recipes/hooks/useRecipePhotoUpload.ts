import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useUploadPhotoMutation,
  useCreatePhotoMutation,
} from '../hooks/usePhotoMutations';

export function useRecipePhotoUpload(recipeId: number) {
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadPhotoMut = useUploadPhotoMutation();
  const createPhotoMut = useCreatePhotoMutation();

  async function handlePhotoUpload(file: File, type: 'COVER' | 'USER') {
    setUploading(true);
    try {
      const { uploadUrl, publicUrl } = await uploadPhotoMut.mutateAsync({
        fileName: file.name,
        contentType: file.type,
      });
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      await createPhotoMut.mutateAsync({ url: publicUrl, type, recipeId });
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
    handlePhotoUpload,
  } as const;
}
