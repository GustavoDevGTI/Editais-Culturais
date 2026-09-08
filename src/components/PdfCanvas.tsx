import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import styles from "./EditalReader.module.css";

interface PdfCanvasProps {
  document: PDFDocumentProxy;
  pageNumber: number;
  title: string;
  zoom: number;
}

export function PdfCanvas({ document, pageNumber, title, zoom }: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let renderTask: RenderTask | null = null;

    async function renderPage() {
      setRendering(true);
      const page = await document.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const cssViewport = page.getViewport({ scale: 1.2 * zoom });
      const renderViewport = page.getViewport({ scale: 1.2 * zoom * pixelRatio });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(cssViewport.width)}px`;
      canvas.style.height = `${Math.floor(cssViewport.height)}px`;

      renderTask = page.render({ canvas, canvasContext: context, viewport: renderViewport });
      await renderTask.promise;
      if (!cancelled) setRendering(false);
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [document, pageNumber, zoom]);

  return (
    <div className={styles.pageStage} aria-busy={rendering}>
      {rendering && <div className={styles.pageLoader}><LoaderCircle aria-hidden="true" /> Carregando página…</div>}
      <canvas ref={canvasRef} className={styles.pdfCanvas} aria-label={`${title}, página ${pageNumber}`} />
    </div>
  );
}
