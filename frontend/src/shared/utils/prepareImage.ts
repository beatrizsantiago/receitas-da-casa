const MAX_DIMENSION = 1920; // o backend já limita a 1920px, então não há por que enviar mais
const JPEG_QUALITY = 0.85;

// Alguns navegadores (ex.: fotos HEIC vindas do app Arquivos no iOS) entregam file.type vazio
const HEIC_EXTENSION = /\.(heic|heif)$/i;

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || HEIC_EXTENSION.test(file.name);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler a imagem'));
    };
    img.src = url;
  });
}

/**
 * Redimensiona e converte a imagem para JPEG no navegador antes do upload.
 * Resolve fotos HEIC do iPhone (que a API não aceita) e fotos grandes demais
 * para o limite de 8MB. GIFs são enviados como estão para não perder a animação.
 * Se o navegador não conseguir decodificar a imagem, devolve o arquivo original.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (file.type === 'image/gif') return file;

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}
