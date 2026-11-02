import { toast } from 'react-toastify';

export function getPublicRecipeUrl(id: number) {
  return `${window.location.origin}/detalhes-da-receita/${id}`;
}

export async function shareRecipe(id: number, title?: string) {
  const url = getPublicRecipeUrl(id);

  if (navigator.share) {
    try {
      await navigator.share({ title: title || 'Receita', url });
      return;
    } catch (err) {
      // Usuário fechou o menu de compartilhamento
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  } catch {
    toast.error('Não foi possível copiar o link');
  }
}
