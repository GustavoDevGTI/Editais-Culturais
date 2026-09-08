import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import styles from "./EditalReader.module.css";

const readerBaseScale = 1.4;

interface PdfCanvasProps {
  document: PDFDocumentProxy;
  pageNumber: number;
  title: string;
  zoom: number;
}

export function PdfCanvas({ document, pageNumber, title, zoom }: PdfCanvasProps) {
  const pageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShouldRender(entry.isIntersecting),
      { rootMargin: "900px 0px" },
    );

    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let renderTask: RenderTask | null = null;

    if (!shouldRender) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 1;
        canvas.height = 1;
      }
      setRendering(false);
      return;
    }

    async function renderPage() {
      setRendering(true);
      const page = await document.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      const cssViewport = page.getViewport({ scale: readerBaseScale * zoom });
      const renderViewport = page.getViewport({ scale: readerBaseScale * zoom * pixelRatio });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(cssViewport.width)}px`;
      canvas.style.height = `${Math.floor(cssViewport.height)}px`;

      renderTask = page.render({ canvas, canvasContext: context, viewport: renderViewport });
      try {
        await renderTask.promise;
        if (!cancelled) setRendering(false);
      } catch {
        if (!cancelled) setRendering(false);
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [document, pageNumber, shouldRender, zoom]);

  return (
    <article
      ref={pageRef}
      id={`pdf-page-${pageNumber}`}
      className={styles.pageStage}
      data-pdf-page={pageNumber}
      aria-busy={rendering}
      style={{ width: `${595 * readerBaseScale * zoom}px`, aspectRatio: "595 / 842" }}
    >
      {rendering && <div className={styles.pageLoader}><LoaderCircle aria-hidden="true" /> Carregando página…</div>}
      <canvas ref={canvasRef} className={styles.pdfCanvas} aria-label={`${title}, página ${pageNumber}`} />
    </article>
  );
}
