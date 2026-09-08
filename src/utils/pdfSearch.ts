export interface PdfSearchResult {
  id: string;
  pageNumber: number;
  occurrenceIndex: number;
  snippet: string;
  segments: Array<{
    itemIndex: number;
    start: number;
    length: number;
  }>;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function searchPdfPages(pageTextItems: string[][], query: string) {
  const term = normalizeText(query.trim());
  if (term.length < 2) return [];

  const results: PdfSearchResult[] = [];

  pageTextItems.forEach((items, index) => {
    const offsets: Array<{ start: number; end: number }> = [];
    let cursor = 0;
    items.forEach((item) => {
      offsets.push({ start: cursor, end: cursor + item.length });
      cursor += item.length + 1;
    });

    const text = items.join(" ");
    const normalized = normalizeText(text);
    let matchAt = normalized.indexOf(term);
    let occurrenceIndex = 0;

    while (matchAt >= 0 && results.length < 80) {
      const start = Math.max(0, matchAt - 58);
      const end = Math.min(text.length, matchAt + term.length + 86);
      const prefix = start > 0 ? "…" : "";
      const suffix = end < text.length ? "…" : "";
      const matchEnd = matchAt + term.length;
      const segments = offsets.flatMap((offset, itemIndex) => {
        const segmentStart = Math.max(matchAt, offset.start);
        const segmentEnd = Math.min(matchEnd, offset.end);
        if (segmentStart >= segmentEnd) return [];
        return [{
          itemIndex,
          start: segmentStart - offset.start,
          length: segmentEnd - segmentStart,
        }];
      });

      results.push({
        id: `pdf-match-${index + 1}-${occurrenceIndex}`,
        pageNumber: index + 1,
        occurrenceIndex,
        snippet: `${prefix}${text.slice(start, end).trim()}${suffix}`,
        segments,
      });

      occurrenceIndex += 1;
      matchAt = normalized.indexOf(term, matchAt + term.length);
    }
  });

  return results;
}
