import { lazy, Suspense, useMemo, useState } from "react";
import { AllEditaisPage } from "./components/AllEditaisPage";
import { EditaisSection } from "./components/EditaisSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { editais } from "./data/editais";
import { useEditalRoute } from "./hooks/useEditalRoute";
import type { Categoria, Status } from "./types/edital";
import { compareEditais } from "./utils/editais";

const EditalReader = lazy(() =>
  import("./components/EditalReader").then((module) => ({ default: module.EditalReader })),
);

export function App() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const [status, setStatus] = useState<Status | "Todos">("Todos");
  const { closeAllEditais, closeEdital, editalId, openAllEditais, openEdital, showAllEditais } = useEditalRoute();

  const orderedEditais = useMemo(() => [...editais].sort(compareEditais), []);

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
          editais={editais}
          onBack={closeEdital}
          onSelect={openEdital}
        />
      </Suspense>
    );
  }

  if (showAllEditais) {
    return (
      <AllEditaisPage
        categoria={categoria}
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

  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <EditaisSection
          categoria={categoria}
          editais={filteredEditais}
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
