import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Download, FileText, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Edital } from "../types/edital";
import { usePdfDocument } from "../hooks/usePdfDocument";
import { searchPdfPages } from "../utils/pdfSearch";
import { PdfCanvas } from "./PdfCanvas";
import styles from "./EditalReader.module.css";

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
  const { document: pdfDocument, error, indexing, loading, pageTexts } = usePdfDocument(pdfUrl);
  const [query, setQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const documentViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery("");
    setPageNumber(1);
    setZoom(1);
    window.document.title = `${activeEdital.title} | Editais Culturais`;
    return () => { window.document.title = "Editais Culturais | Amargosa"; };
  }, [activeEdital.id, activeEdital.title]);

  const results = useMemo(
    () => searchPdfPages(pageTexts, query),
    [pageTexts, query],
  );
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
    setPageNumber(boundedPage);
    window.requestAnimationFrame(() => {
      window.document.getElementById(`pdf-page-${boundedPage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
        <p title={activeEdital.title}>{activeEdital.title}</p>
      </header>

      <main className={styles.workspace}>
        <aside className={styles.sidebar} aria-label="Busca e navegação dos editais">
          <div className={styles.currentInfo}>
            <span className={`${styles.status} ${statusClass}`}>{activeEdital.status}</span>
            <p className="section-kicker">{activeEdital.label}</p>
            <h1>{activeEdital.title}</h1>
            <span className={styles.deadline}><CalendarDays aria-hidden="true" />{activeEdital.deadline}</span>
          </div>

          <div className={styles.searchBlock}>
            <label className={styles.documentSearch}>
              <Search aria-hidden="true" />
              <span className="sr-only">Buscar dentro do edital</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
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
                    className={pageNumber === result.pageNumber ? styles.activeResult : ""}
                    onClick={() => changePage(result.pageNumber)}
                  >
                    <strong>Página {result.pageNumber}</strong>
                    <span>{result.snippet}</span>
                  </button>
                )) : <p>Nenhuma ocorrência encontrada.</p>}
              </div>
            )}
          </div>

          <div className={styles.allEditais}>
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
          </div>
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
