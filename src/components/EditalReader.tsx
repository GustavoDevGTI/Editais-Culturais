import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Download, FileText, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Edital } from "../types/edital";
import { usePdfDocument } from "../hooks/usePdfDocument";
import { searchPdfPages, type PdfSearchResult } from "../utils/pdfSearch";
import { PdfCanvas } from "./PdfCanvas";
import styles from "./EditalReader.module.css";

const emptySearchResults: PdfSearchResult[] = [];

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
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const documentViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery("");
    setActiveMatchId(null);
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
    setActiveMatchId(null);
    setPageNumber(boundedPage);
    window.requestAnimationFrame(() => {
      window.document.getElementById(`pdf-page-${boundedPage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectMatch = (result: PdfSearchResult) => {
    setPageNumber(result.pageNumber);
    setActiveMatchId(result.id);
    window.requestAnimationFrame(() => {
      window.document.getElementById(`pdf-page-${result.pageNumber}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    if (!viewport) return;

    const viewportTop = viewport.getBoundingClientRect().top + 24;
    const pages = Array.from(viewport.querySelectorAll<HTMLElement>("[data-pdf-page]"));
    const closest = pages.reduce<{ distance: number; page: number } | null>((current, page) => {
      const distance = Math.abs(page.getBoundingClientRect().top - viewportTop);
      const pageValue = Number(page.dataset.pdfPage);
      return !current || distance < current.distance ? { distance, page: pageValue } : current;
    }, null);

    if (closest && closest.page !== pageNumber) setPageNumber(closest.page);
  };

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
        <div>
          <p className="section-kicker">{activeEdital.label}</p>
          <h1 id="edital-title">{activeEdital.title}</h1>
        </div>
        <div className={styles.pageMeta}>
          <span className={`${styles.status} ${statusClass}`}>{activeEdital.status}</span>
          <span className={styles.deadline}><CalendarDays aria-hidden="true" />{activeEdital.deadline}</span>
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
                  setQuery(event.target.value);
                  setActiveMatchId(null);
                }}
                placeholder="Buscar dentro do edital…"
                disabled={!pdfUrl}
              />
            </label>

            <div className={styles.searchSummary} aria-live="polite">
              {indexing && "Preparando a busca…"}
              {!indexing && query.trim().length > 1 && `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
              {!indexing && query.trim().length === 1 && "Digite mais uma letra para buscar"}
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
                <button type="button" onClick={() => setZoom((value) => Math.max(0.65, value - 0.1))} aria-label="Diminuir zoom"><ZoomOut /></button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))} aria-label="Aumentar zoom"><ZoomIn /></button>
                <a href={pdfUrl} download aria-label="Baixar PDF"><Download /></a>
              </div>
            </div>
          )}

          <div ref={documentViewportRef} className={styles.documentViewport} onScroll={updateVisiblePage}>
            {loading && <div className={styles.documentMessage}><span className={styles.spinner} />Carregando o edital completo…</div>}
            {error && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>{error}</strong><span>Tente baixar o arquivo e abri-lo no seu dispositivo.</span></div>}
            {!pdfUrl && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>Documento ainda não disponível</strong><span>As informações deste edital já podem ser consultadas, mas o PDF será publicado em breve.</span></div>}
            {pdfDocument && (
              <div className={styles.pagesStack}>
                {Array.from({ length: pdfDocument.numPages }, (_, index) => (
                  <PdfCanvas
                    key={index + 1}
                    document={pdfDocument}
                    pageNumber={index + 1}
                    title={activeEdital.title}
                    zoom={zoom}
                    matches={matchesByPage.get(index + 1) ?? emptySearchResults}
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
