import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AccessibilityPage } from "./components/AccessibilityPage";
import { AboutPage } from "./components/AboutPage";
import { AllEditaisPage } from "./components/AllEditaisPage";
import { EditaisSection } from "./components/EditaisSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { editais } from "./data/editais";
import { useEditalRoute } from "./hooks/useEditalRoute";
import type { Categoria, Status } from "./types/edital";
import { compareEditais, getEditalNumbers, getLastUpdatedLabel, resolveEditalDeadline } from "./utils/editais";

const EditalReader = lazy(() =>
  import("./components/EditalReader").then((module) => ({ default: module.EditalReader })),
);

export function App() {
  const [now, setNow] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const [status, setStatus] = useState<Status | "Todos">("Todos");
  const { closeAccessibility, closeAbout, closeAllEditais, closeEdital, documentId, editalId, openAllEditais, openDocument, openEdital, showAccessibility, showAbout, showAllEditais } = useEditalRoute();

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const nextDeadline = editais
      .map((edital) => edital.deadlineAt ? Date.parse(edital.deadlineAt) : Infinity)
      .filter((deadline) => deadline > Date.now())
      .sort((left, right) => left - right)[0];
    const timeout = nextDeadline === undefined ? undefined : window.setTimeout(refresh, nextDeadline - Date.now());
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [now]);

  const currentEditais = useMemo(() => editais.map((edital) => resolveEditalDeadline(edital, now)), [now]);

  const orderedEditais = useMemo(() => [...currentEditais].sort(compareEditais), [currentEditais]);
  const editalNumbers = useMemo(() => getEditalNumbers(editais), []);
  const categorias = useMemo(
    () => Array.from(new Set(editais.map((edital) => edital.category)))
      .sort((left, right) => left.localeCompare(right, "pt-BR", { sensitivity: "base" })),
    [],
  );
  const lastUpdatedLabel = useMemo(() => getLastUpdatedLabel(currentEditais), [currentEditais]);

  const filteredEditais = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return orderedEditais
      .filter((edital) => {
        const searchableText = [edital.title, edital.summary, edital.category]
          .join(" ")
          .toLocaleLowerCase("pt-BR");
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
        const matchesCategory = categoria === "Todas" || edital.category === categoria;
        const matchesStatus = status === "Todos" || edital.status === status;

        return matchesQuery && matchesCategory && matchesStatus;
      });
  }, [categoria, orderedEditais, query, status]);

  const clearFilters = () => {
    setQuery("");
    setCategoria("Todas");
    setStatus("Todos");
  };

  if (editalId) {
    return (
      <Suspense fallback={<div className="route-loading" role="status">Abrindo o edital…</div>}>
        <EditalReader
          activeId={editalId}
          documentId={documentId}
          editais={currentEditais}
          onBack={closeEdital}
          onDocumentSelect={openDocument}
          onSelect={openEdital}
        />
      </Suspense>
    );
  }

  if (showAllEditais) {
    return (
      <AllEditaisPage
        categoria={categoria}
        categorias={categorias}
        editais={filteredEditais}
        query={query}
        status={status}
        onBack={closeAllEditais}
        onCategoriaChange={setCategoria}
        onClear={clearFilters}
        onOpen={openEdital}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
      />
    );
  }

  if (showAbout) {
    return <AboutPage onBack={closeAbout} />;
  }

  if (showAccessibility) {
    return <AccessibilityPage editais={orderedEditais} onBack={closeAccessibility} onOpen={openEdital} />;
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero onExplore={openAllEditais} />
        <EditaisSection
          categoria={categoria}
          categorias={categorias}
          editais={filteredEditais}
          editalNumbers={editalNumbers}
          lastUpdatedLabel={lastUpdatedLabel}
          query={query}
          status={status}
          onCategoriaChange={setCategoria}
          onClear={clearFilters}
          onOpen={(edital) => openEdital(edital.id)}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          onViewAll={openAllEditais}
        />
      </main>
      <Footer />
    </div>
  );
}
