export interface PdfSearchResult {
  pageNumber: number;
  snippet: string;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function searchPdfPages(pageTexts: string[], query: string) {
  const term = normalizeText(query.trim());
  if (term.length < 2) return [];

  const results: PdfSearchResult[] = [];

  pageTexts.forEach((text, index) => {
    const normalized = normalizeText(text);
    let matchAt = normalized.indexOf(term);

    while (matchAt >= 0 && results.length < 80) {
      const start = Math.max(0, matchAt - 58);
      const end = Math.min(text.length, matchAt + term.length + 86);
      const prefix = start > 0 ? "…" : "";
      const suffix = end < text.length ? "…" : "";

      results.push({
        pageNumber: index + 1,
        snippet: `${prefix}${text.slice(start, end).trim()}${suffix}`,
      });

      matchAt = normalized.indexOf(term, matchAt + term.length);
    }
  });

  return results;
}
