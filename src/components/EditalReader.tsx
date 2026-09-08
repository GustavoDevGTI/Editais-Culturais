import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Download, FileText, Search, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);

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

  const changePage = (nextPage: number) => {
    setPageNumber(Math.min(Math.max(nextPage, 1), totalPages || 1));
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
            <span className={styles.status}>{activeEdital.status}</span>
            <p className="section-kicker">{activeEdital.label}</p>
            <h1>{activeEdital.title}</h1>
            <p>{activeEdital.summary}</p>
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

          <div className={styles.otherEditais}>
            <h2>Outros editais</h2>
            <p>Troque o documento sem sair desta página.</p>
            <div>
              {editais.map((edital) => (
                <button
                  key={edital.id}
                  type="button"
                  className={edital.id === activeEdital.id ? styles.activeEdital : ""}
                  onClick={() => onSelect(edital.id)}
                >
                  <FileText aria-hidden="true" />
                  <span><strong>{edital.title}</strong><small>{edital.pdfFile ? `${edital.pageCount} páginas` : "Documento em breve"}</small></span>
                </button>
              ))}
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
                <button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))} aria-label="Diminuir zoom"><ZoomOut /></button>
                <span>{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.8, value + 0.15))} aria-label="Aumentar zoom"><ZoomIn /></button>
                <a href={pdfUrl} download aria-label="Baixar PDF"><Download /></a>
              </div>
            </div>
          )}

          <div className={styles.documentViewport}>
            {loading && <div className={styles.documentMessage}><span className={styles.spinner} />Carregando o edital completo…</div>}
            {error && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>{error}</strong><span>Tente baixar o arquivo e abri-lo no seu dispositivo.</span></div>}
            {!pdfUrl && <div className={styles.documentMessage}><FileText aria-hidden="true" /><strong>Documento ainda não disponível</strong><span>As informações deste edital já podem ser consultadas, mas o PDF será publicado em breve.</span></div>}
            {pdfDocument && <PdfCanvas document={pdfDocument} pageNumber={pageNumber} title={activeEdital.title} zoom={zoom} />}
          </div>
        </section>
      </main>
    </div>
  );
}
