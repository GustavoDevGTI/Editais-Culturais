import { ArrowLeft, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download, FileText, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type { Edital } from "../types/edital";
import { usePdfDocument } from "../hooks/usePdfDocument";
import { searchPdfPages, type PdfSearchResult } from "../utils/pdfSearch";
import { PdfCanvas } from "./PdfCanvas";
import styles from "./EditalReader.module.css";

const emptySearchResults: PdfSearchResult[] = [];
const minZoom = 0.5;
const maxZoom = 4;
const zoomStep = 0.25;
const pageSwipeThreshold = 52;

interface TouchPoint {
  x: number;
  y: number;
}

interface TouchGesture {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startDistance: number;
  startZoom: number;
  pinching: boolean;
}

interface EditalReaderProps {
  activeId: string;
  editais: Edital[];
  onBack: () => void;
  onSelect: (id: string) => void;
}

export function EditalReader({ activeId, editais, onBack, onSelect }: EditalReaderProps) {
  const activeEdital = editais.find((edital) => edital.id === activeId) ?? editais[0];
  const pdfUrl = activeEdital.pdfFile
    ? `${import.meta.env.BASE_URL}${activeEdital.pdfFile}`
    : undefined;
  const { document: pdfDocument, error, indexing, loading, pageTextItems } = usePdfDocument(pdfUrl);
  const [query, setQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [singlePageMode, setSinglePageMode] = useState(() => window.matchMedia("(max-width: 720px)").matches);
  const [draggingDocument, setDraggingDocument] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const documentViewportRef = useRef<HTMLDivElement>(null);
  const matchNavigationPageRef = useRef<number | null>(null);
  const dragStateRef = useRef<{ pointerId: number; x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const touchPointsRef = useRef(new Map<number, TouchPoint>());
  const touchGestureRef = useRef<TouchGesture | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const updateMode = () => setSinglePageMode(media.matches);
    updateMode();
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => {
    setQuery("");
    setActiveMatchId(null);
    matchNavigationPageRef.current = null;
    setPageNumber(1);
    setZoom(1);
    window.document.title = `${activeEdital.title} | Editais Culturais`;
    return () => { window.document.title = "Editais Culturais | Amargosa"; };
  }, [activeEdital.id, activeEdital.title]);

  const results = useMemo(
    () => searchPdfPages(pageTextItems, query),
    [pageTextItems, query],
  );
  const matchesByPage = useMemo(() => {
    const grouped = new Map<number, PdfSearchResult[]>();
    results.forEach((result) => {
      const pageMatches = grouped.get(result.pageNumber) ?? [];
      pageMatches.push(result);
      grouped.set(result.pageNumber, pageMatches);
    });
    return grouped;
  }, [results]);
  const totalPages = pdfDocument?.numPages ?? activeEdital.pageCount ?? 0;
  const normalizedListQuery = listQuery.trim().toLocaleLowerCase("pt-BR");
  const visibleEditais = useMemo(
    () => [...editais]
      .sort((left, right) => right.publishedDate.localeCompare(left.publishedDate))
      .filter((edital) => !normalizedListQuery || [edital.title, edital.category, edital.label]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedListQuery)),
    [editais, normalizedListQuery],
  );
  const statusClass = activeEdital.status === "Encerrado"
    ? styles.statusClosed
    : activeEdital.status === "Em breve"
      ? styles.statusSoon
      : styles.statusOpen;

  const changePage = (nextPage: number) => {
    const boundedPage = Math.min(Math.max(nextPage, 1), totalPages || 1);
    matchNavigationPageRef.current = null;
    setActiveMatchId(null);
    setPageNumber(boundedPage);
    window.requestAnimationFrame(() => {
      if (singlePageMode) {
        documentViewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } else {
        window.document.getElementById(`pdf-page-${boundedPage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const selectMatch = (result: PdfSearchResult) => {
    matchNavigationPageRef.current = result.pageNumber === pageNumber ? null : result.pageNumber;
    setPageNumber(result.pageNumber);
    setActiveMatchId(result.id);
    window.requestAnimationFrame(() => {
      window.document.getElementById(`pdf-page-${result.pageNumber}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const navigateMatch = (direction: -1 | 1) => {
    if (!results.length) return;

    const currentIndex = results.findIndex((result) => result.id === activeMatchId);
    if (currentIndex >= 0) {
      selectMatch(results[(currentIndex + direction + results.length) % results.length]);
      return;
    }

    if (direction > 0) {
      selectMatch(results.find((result) => result.pageNumber >= pageNumber) ?? results[0]);
      return;
    }

    selectMatch(
      [...results].reverse().find((result) => result.pageNumber <= pageNumber)
        ?? results[results.length - 1],
    );
  };

  const renderHighlightedText = (text: string) => {
    const term = query.trim();
    if (term.length < 2) return text;
    const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
    const normalizedTerm = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
    const parts: ReactNode[] = [];
    let cursor = 0;
    let matchAt = normalizedText.indexOf(normalizedTerm);

    while (matchAt >= 0) {
      if (matchAt > cursor) parts.push(text.slice(cursor, matchAt));
      parts.push(<mark key={`${matchAt}-${parts.length}`}>{text.slice(matchAt, matchAt + normalizedTerm.length)}</mark>);
      cursor = matchAt + normalizedTerm.length;
      matchAt = normalizedText.indexOf(normalizedTerm, cursor);
    }
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  };

  const updateVisiblePage = () => {
    const viewport = documentViewportRef.current;
    if (!viewport || singlePageMode) return;

    const viewportTop = viewport.getBoundingClientRect().top + 24;
    const pages = Array.from(viewport.querySelectorAll<HTMLElement>("[data-pdf-page]"));
    const closest = pages.reduce<{ distance: number; page: number } | null>((current, page) => {
      const distance = Math.abs(page.getBoundingClientRect().top - viewportTop);
      const pageValue = Number(page.dataset.pdfPage);
      return !current || distance < current.distance ? { distance, page: pageValue } : current;
    }, null);

    if (closest && closest.page !== pageNumber) {
      if (matchNavigationPageRef.current === closest.page) {
        matchNavigationPageRef.current = null;
      } else if (matchNavigationPageRef.current === null) {
        setActiveMatchId(null);
      }
      setPageNumber(closest.page);
    }
  };

  const changeZoom = (direction: -1 | 1) => {
    setZoom((value) => Math.min(maxZoom, Math.max(minZoom, Number((value + direction * zoomStep).toFixed(2)))));
  };

  const distanceBetweenTouches = () => {
    const [first, second] = Array.from(touchPointsRef.current.values());
    return first && second ? Math.hypot(second.x - first.x, second.y - first.y) : 0;
  };

  const startDocumentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = documentViewportRef.current;
    if (!viewport) return;

    if (event.pointerType === "touch") {
      touchPointsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      viewport.setPointerCapture(event.pointerId);

      if (touchPointsRef.current.size === 1) {
        touchGestureRef.current = {
          startX: event.clientX,
          startY: event.clientY,
          lastX: event.clientX,
          lastY: event.clientY,
          startDistance: 0,
          startZoom: zoom,
          pinching: false,
        };
      } else if (touchPointsRef.current.size === 2 && touchGestureRef.current) {
        touchGestureRef.current.startDistance = distanceBetweenTouches();
        touchGestureRef.current.startZoom = zoom;
        touchGestureRef.current.pinching = true;
      }

      event.preventDefault();
      return;
    }

    if (zoom <= 1 || event.button !== 0) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    viewport.setPointerCapture(event.pointerId);
    setDraggingDocument(true);
    event.preventDefault();
  };

  const moveDocument = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = documentViewportRef.current;
    if (!viewport) return;

    if (event.pointerType === "touch") {
      if (!touchPointsRef.current.has(event.pointerId)) return;
      touchPointsRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const gesture = touchGestureRef.current;
      if (!gesture) return;

      if (touchPointsRef.current.size >= 2 && gesture.startDistance > 0) {
        const nextZoom = Math.min(
          maxZoom,
          Math.max(minZoom, Number((gesture.startZoom * distanceBetweenTouches() / gesture.startDistance).toFixed(2))),
        );
        setZoom((current) => Math.abs(current - nextZoom) >= 0.02 ? nextZoom : current);
      } else if (zoom > 1 && !gesture.pinching) {
        viewport.scrollLeft -= event.clientX - gesture.lastX;
        viewport.scrollTop -= event.clientY - gesture.lastY;
      }

      gesture.lastX = event.clientX;
      gesture.lastY = event.clientY;
      event.preventDefault();
      return;
    }

    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    viewport.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.x);
    viewport.scrollTop = dragState.scrollTop - (event.clientY - dragState.y);
    event.preventDefault();
  };

  const stopDocumentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = documentViewportRef.current;

    if (event.pointerType === "touch") {
      const gesture = touchGestureRef.current;
      const endedPoint = touchPointsRef.current.get(event.pointerId) ?? { x: event.clientX, y: event.clientY };
      touchPointsRef.current.delete(event.pointerId);

      if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (touchPointsRef.current.size === 0) {
        if (gesture && !gesture.pinching && zoom <= 1) {
          const deltaX = endedPoint.x - gesture.startX;
          const deltaY = endedPoint.y - gesture.startY;
          if (Math.abs(deltaY) >= pageSwipeThreshold && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
            changePage(deltaY < 0 ? pageNumber + 1 : pageNumber - 1);
          }
        }
        touchGestureRef.current = null;
      }
      return;
    }

    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
    setDraggingDocument(false);
  };

  const cancelDocumentDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = documentViewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);

    if (event.pointerType === "touch") {
      touchPointsRef.current.delete(event.pointerId);
      if (touchPointsRef.current.size === 0) touchGestureRef.current = null;
      return;
    }

    dragStateRef.current = null;
    setDraggingDocument(false);
  };

  const displayedPages = pdfDocument
    ? singlePageMode
      ? [pageNumber]
      : Array.from({ length: pdfDocument.numPages }, (_, index) => index + 1)
    : [];

  return (
    <div className={styles.readerShell}>
      <header className={styles.topbar}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" /> Voltar aos editais
        </button>
        <button className={styles.brand} type="button" onClick={onBack} aria-label="Voltar à página inicial">
          <img src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`} alt="Prefeitura de Amargosa" />
        </button>
      </header>

      <section className={styles.pageHeader} aria-labelledby="edital-title">
        <div className={styles.pageHeading}>
          <div className={styles.pageHeadingTop}>
            <p className={`section-kicker ${styles.pageLabel}`}>{activeEdital.label}</p>
            <div className={styles.pageMeta}>
              <span className={`${styles.status} ${statusClass}`}>{activeEdital.status}</span>
              <span className={styles.deadline}><CalendarDays aria-hidden="true" />{activeEdital.deadline}</span>
            </div>
          </div>
          <h1 id="edital-title">{activeEdital.title}</h1>
        </div>
      </section>

      <main className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="Busca e navegação dos editais">
          <section className={styles.searchBlock}>
            <h2>Buscar neste edital</h2>
            <label className={styles.documentSearch}>
              <Search aria-hidden="true" />
              <span className="sr-only">Buscar dentro do edital</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  matchNavigationPageRef.current = null;
                  setQuery(event.target.value);
                  setActiveMatchId(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    navigateMatch(1);
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    navigateMatch(-1);
                    return;
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    navigateMatch(1);
                  }
                }}
                placeholder="Buscar dentro do edital…"
                disabled={!pdfUrl}
              />
            </label>

            <div className={styles.searchStatusRow}>
              <div className={styles.searchSummary} aria-live="polite">
                {indexing && "Preparando a busca…"}
                {!indexing && query.trim().length > 1 && `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
                {!indexing && query.trim().length === 1 && "Digite mais uma letra para buscar"}
              </div>
              {!indexing && results.length > 0 && (
                <div className={styles.matchControls} aria-label="Navegar pelas ocorrências">
                  <button type="button" onClick={() => navigateMatch(-1)} aria-label="Ocorrência anterior"><ChevronUp /></button>
                  <button type="button" onClick={() => navigateMatch(1)} aria-label="Próxima ocorrência"><ChevronDown /></button>
                </div>
              )}
            </div>

            {query.trim().length > 1 && !indexing && (
              <div className={styles.searchResults}>
                {results.length > 0 ? results.map((result, index) => (
                  <button
                    key={`${result.pageNumber}-${index}`}
                    type="button"
                    className={activeMatchId === result.id ? styles.activeResult : ""}
                    onClick={() => selectMatch(result)}
                  >
                    <strong>Página {result.pageNumber}</strong>
                    <span>{renderHighlightedText(result.snippet)}</span>
                  </button>
                )) : <p>Nenhuma ocorrência encontrada.</p>}
              </div>
            )}
          </section>

          <section className={styles.allEditais}>
            <h2>Todos os editais</h2>
            <label className={styles.editalSearch}>
              <Search aria-hidden="true" />
              <span className="sr-only">Buscar na lista de editais</span>
              <input
                type="search"
                value={listQuery}
                onChange={(event) => setListQuery(event.target.value)}
                placeholder="Buscar edital…"
              />
            </label>
            <div>
              {visibleEditais.map((edital) => (
                <button
                  key={edital.id}
                  type="button"
                  className={edital.id === activeEdital.id ? styles.activeEdital : ""}
                  onClick={() => onSelect(edital.id)}
                >
                  <FileText aria-hidden="true" />
                  <span>
                    <strong>{edital.title}</strong>
                    <small>{edital.publishedAt.replace("Publicado em ", "")}{edital.pdfFile ? ` · ${edital.pageCount} páginas` : " · Documento em breve"}</small>
                  </span>
                </button>
              ))}
              {visibleEditais.length === 0 && <p className={styles.noEditais}>Nenhum edital encontrado.</p>}
            </div>
          </section>
        </aside>

        <section className={styles.documentPanel} aria-label={`Documento: ${activeEdital.title}`}>
          {pdfUrl && (
            <div className={styles.documentToolbar}>
              <div className={styles.pageControls}>
                <button type="button" onClick={() => changePage(pageNumber - 1)} disabled={pageNumber <= 1} aria-label="Página anterior"><ChevronLeft /></button>
                <label><span className="sr-only">Página atual</span><input type="number" min="1" max={totalPages} value={pageNumber} onChange={(event) => changePage(Number(event.target.value))} /></label>
                <span>de {totalPages || "—"}</span>
                <button type="button" onClick={() => changePage(pageNumber + 1)} disabled={pageNumber >= totalPages} aria-label="Próxima página"><ChevronRight /></button>
              </div>
              <div className={styles.zoomControls}>
                <button type="button" onClick={() => changeZoom(-1)} disabled={zoom <= minZoom} aria-label="Diminuir zoom"><ZoomOut /></button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => changeZoom(1)} disabled={zoom >= maxZoom} aria-label="Aumentar zoom"><ZoomIn /></button>
                <a href={pdfUrl} download aria-label="Baixar PDF"><Download /></a>
              </div>
            </div>
          )}

          <div
            ref={documentViewportRef}
            className={`${styles.documentViewport} ${zoom > 1 ? styles.pannableDocument : ""} ${draggingDocument ? styles.draggingDocument : ""}`}
            onPointerDown={startDocumentDrag}
            onPointerMove={moveDocument}
            onPointerUp={stopDocumentDrag}
            onPointerCancel={cancelDocumentDrag}
            onScroll={updateVisiblePage}
          >
            {loading && <div className={styles.documentMessage}><span className={styles.spinner} />Carregando o edital completo…</div>}
            {error && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>{error}</strong><span>Tente baixar o arquivo e abri-lo no seu dispositivo.</span></div>}
            {!pdfUrl && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>Documento ainda não disponível</strong><span>As informações deste edital já podem ser consultadas, mas o PDF será publicado em breve.</span></div>}
            {pdfDocument && (
              <div className={styles.pagesStack}>
                {displayedPages.map((displayedPage) => (
                  <PdfCanvas
                    key={displayedPage}
                    document={pdfDocument}
                    pageNumber={displayedPage}
                    title={activeEdital.title}
                    zoom={zoom}
                    matches={matchesByPage.get(displayedPage) ?? emptySearchResults}
                    activeMatchId={activeMatchId}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
