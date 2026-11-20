const SITE_NAME = 'Receitas da Casa';
const DEFAULT_DESCRIPTION = 'Uma receita do Receitas da Casa';
const DESCRIPTION_MAX_LENGTH = 200;

export interface RecipePreviewData {
  id: number;
  title: string;
  description: string | null;
  photoUrl: string | null;
}

// Tudo que vem do banco passa por aqui antes de entrar no HTML
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Aceita só URLs absolutas http(s); qualquer outra coisa vira null
function safeAbsoluteUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function summarize(text: string | null): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return DEFAULT_DESCRIPTION;
  return clean.length > DESCRIPTION_MAX_LENGTH
    ? `${clean.slice(0, DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`
    : clean;
}

/**
 * HTML mínimo com as meta tags Open Graph/Twitter de uma receita pública.
 * Só é servido para robôs de prévia de link (WhatsApp, Telegram...), que não
 * executam JavaScript; pessoas continuam recebendo o SPA pelo nginx.
 */
export function renderRecipePreview(
  recipe: RecipePreviewData,
  frontendUrl: string,
): string {
  const siteUrl = frontendUrl.replace(/\/+$/, '');
  const pageUrl = `${siteUrl}/detalhes-da-receita/${recipe.id}`;
  const image =
    safeAbsoluteUrl(recipe.photoUrl) ?? `${siteUrl}/android-chrome-512x512.png`;

  const title = escapeHtml(recipe.title);
  const description = escapeHtml(summarize(recipe.description));
  const url = escapeHtml(pageUrl);
  const imageUrl = escapeHtml(image);
  const siteName = escapeHtml(SITE_NAME);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${title} | ${siteName}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="${title}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
    <a href="${url}">Ver receita</a>
  </body>
</html>
`;
}
