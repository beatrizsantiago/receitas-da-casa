// Busca textual tolerante: ignora acentos, maiúsculas e ordem das palavras.

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function tokenize(query: string): string[] {
  return normalizeText(query).split(/\s+/).filter(Boolean);
}

export interface SearchField {
  values: (string | null | undefined)[];
  weight: number;
}

// Retorna 0 se algum termo não aparece em nenhum campo; senão, uma pontuação
// de relevância (maior = melhor), para ordenar os resultados.
export function searchScore(terms: string[], fields: SearchField[]): number {
  const normalized = fields.map((f) => ({
    weight: f.weight,
    values: f.values.filter((v): v is string => !!v).map(normalizeText),
  }));

  let score = 0;
  for (const term of terms) {
    let best = 0;
    for (const { weight, values } of normalized) {
      for (const v of values) {
        if (!v.includes(term)) continue;
        const startsWord = v.startsWith(term) || v.includes(` ${term}`);
        best = Math.max(best, startsWord ? weight * 2 : weight);
      }
    }
    if (best === 0) return 0;
    score += best;
  }
  return score;
}
