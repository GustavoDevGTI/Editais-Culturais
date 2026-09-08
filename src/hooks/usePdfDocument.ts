import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

export function usePdfDocument(url?: string) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageTexts, setPageTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setDocument(null);
      setPageTexts([]);
      setLoading(false);
      setIndexing(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const task = getDocument({ url });
    setDocument(null);
    setLoading(true);
    setIndexing(false);
    setError(null);
    setPageTexts([]);

    task.promise
      .then(async (pdf) => {
        if (cancelled) return;
        setDocument(pdf);
        setLoading(false);
        setIndexing(true);

        const texts = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, index) => {
            const page = await pdf.getPage(index + 1);
            const content = await page.getTextContent();
            return content.items
              .map((item) => ("str" in item ? item.str : ""))
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
          }),
        );

        if (!cancelled) {
          setPageTexts(texts);
          setIndexing(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível abrir este documento.");
          setLoading(false);
          setIndexing(false);
        }
      });

    return () => {
      cancelled = true;
      void task.destroy();
    };
  }, [url]);

  return { document, error, indexing, loading, pageTexts };
}
