import { useMemo, useState } from "react";
import { EditalDialog } from "./components/EditalDialog";
import { EditaisSection } from "./components/EditaisSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { editais } from "./data/editais";
import type { Categoria, Edital, Status } from "./types/edital";

export function App() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const [status, setStatus] = useState<Status | "Todos">("Todos");
  const [selected, setSelected] = useState<Edital | null>(null);

  const filteredEditais = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return editais.filter((edital) => {
      const searchableText = [edital.title, edital.summary, edital.category]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = categoria === "Todas" || edital.category === categoria;
      const matchesStatus = status === "Todos" || edital.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [categoria, query, status]);

  const clearFilters = () => {
    setQuery("");
    setCategoria("Todas");
    setStatus("Todos");
  };

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
          total={editais.length}
          onCategoriaChange={setCategoria}
          onClear={clearFilters}
          onOpen={setSelected}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
        />
      </main>
      <Footer />
      <EditalDialog edital={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
