import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextLayer, type PDFDocumentProxy, type RenderTask } from "pdfjs-dist";
import type { PdfSearchResult } from "../utils/pdfSearch";
import styles from "./EditalReader.module.css";

const readerBaseScale = 1.4;

interface PdfCanvasProps {
  document: PDFDocumentProxy;
  pageNumber: number;
  title: string;
  zoom: number;
  matches: PdfSearchResult[];
  activeMatchId: string | null;
}

export function PdfCanvas({ document, pageNumber, title, zoom, matches, activeMatchId }: PdfCanvasProps) {
  const pageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const textDivsRef = useRef<HTMLElement[]>([]);
  const textItemsRef = useRef<string[]>([]);
  const [shouldRender, setShouldRender] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderWidth, setRenderWidth] = useState(0);
  const [textLayerRevision, setTextLayerRevision] = useState(0);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      setRenderWidth((current) => current === nextWidth ? current : nextWidth);
    });
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

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
    let textLayer: TextLayer | null = null;

    if (!shouldRender) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 1;
        canvas.height = 1;
      }
      textLayerRef.current?.replaceChildren();
      textDivsRef.current = [];
      textItemsRef.current = [];
      setRendering(false);
      return;
    }

    async function renderPage() {
      if (!renderWidth) return;
      setRendering(true);
      const page = await document.getPage(pageNumber);
      if (cancelled || !canvasRef.current || !textLayerRef.current) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      const naturalViewport = page.getViewport({ scale: 1 });
      const cssScale = renderWidth / naturalViewport.width;
      const cssViewport = page.getViewport({ scale: cssScale });
      const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(cssViewport.width)}px`;
      canvas.style.height = `${Math.floor(cssViewport.height)}px`;

      const textContainer = textLayerRef.current;
      textContainer.replaceChildren();
      textContainer.style.setProperty("--total-scale-factor", String(cssScale));
      const textContent = await page.getTextContent();
      if (cancelled) return;
      textLayer = new TextLayer({ textContentSource: textContent, container: textContainer, viewport: cssViewport });

      renderTask = page.render({ canvas, canvasContext: context, viewport: renderViewport });
      try {
        await Promise.all([renderTask.promise, textLayer.render()]);
        if (!cancelled) {
          textDivsRef.current = textLayer.textDivs;
          textItemsRef.current = textLayer.textContentItemsStr;
          setTextLayerRevision((revision) => revision + 1);
          setRendering(false);
        }
      } catch {
        if (!cancelled) setRendering(false);
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
    };
  }, [document, pageNumber, renderWidth, shouldRender, zoom]);

  useEffect(() => {
    const textDivs = textDivsRef.current;
    const textItems = textItemsRef.current;
    if (!textDivs.length) return;

    textDivs.forEach((textDiv, itemIndex) => {
      const text = textItems[itemIndex] ?? "";
      const itemSegments = matches
        .flatMap((match) => match.segments.map((segment, segmentIndex) => ({ match, segment, segmentIndex })))
        .filter(({ segment }) => segment.itemIndex === itemIndex)
        .sort((left, right) => left.segment.start - right.segment.start);

      if (!itemSegments.length) {
        textDiv.textContent = text;
        return;
      }

      const fragment = window.document.createDocumentFragment();
      let cursor = 0;
      itemSegments.forEach(({ match, segment, segmentIndex }) => {
        if (segment.start > cursor) fragment.append(text.slice(cursor, segment.start));
        const marker = window.document.createElement("mark");
        marker.className = match.id === activeMatchId
          ? `${styles.pdfMatch} ${styles.activePdfMatch}`
          : styles.pdfMatch;
        if (segmentIndex === 0) marker.id = match.id;
        marker.textContent = text.slice(segment.start, segment.start + segment.length);
        fragment.append(marker);
        cursor = segment.start + segment.length;
      });
      if (cursor < text.length) fragment.append(text.slice(cursor));
      textDiv.replaceChildren(fragment);
    });
  }, [activeMatchId, matches, textLayerRevision]);

  useEffect(() => {
    if (!activeMatchId || !shouldRender) return;
    const marker = window.document.getElementById(activeMatchId);
    if (!marker) return;
    window.requestAnimationFrame(() => marker.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [activeMatchId, shouldRender, textLayerRevision]);

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
      <div ref={textLayerRef} className={styles.textLayer} aria-hidden="true" />
    </article>
  );
}
