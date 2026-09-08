import { Check, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import type { Categoria, Status } from "../types/edital";
import { statuses } from "../types/edital";
import { CategorySelect } from "./CategorySelect";
import styles from "./Editais.module.css";

interface EditaisFiltersProps {
  categoria: Categoria | "Todas";
  query: string;
  status: Status | "Todos";
  onCategoriaChange: (value: Categoria | "Todas") => void;
  onClear: () => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: Status | "Todos") => void;
}

export function EditaisFilters(props: EditaisFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = Boolean(props.query) || props.categoria !== "Todas" || props.status !== "Todos";
  const statusFilterCount = props.status === "Todos" ? 0 : 1;

  return (
    <>
      <div className={styles.filters} role="search" aria-label="Buscar e filtrar editais">
        <label className={styles.search}>
          <Search aria-hidden="true" />
          <span className="sr-only">Buscar editais</span>
          <input value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Busque por palavra-chave..." />
        </label>
        <CategorySelect value={props.categoria} onChange={props.onCategoriaChange} />
        <button className={styles.filterToggle} type="button" aria-expanded={showFilters} onClick={() => setShowFilters((current) => !current)}>
          <Filter aria-hidden="true" /> Filtros <span>{statusFilterCount}</span>
        </button>
        {hasFilters && <button className={styles.clear} type="button" onClick={props.onClear}><X aria-hidden="true" /> Limpar</button>}
      </div>

      {showFilters && (
        <div className={styles.statusFilters} aria-label="Filtrar por situação">
          <span>Mostrar:</span>
          {(["Todos", ...statuses] as const).map((status) => (
            <button key={status} className={props.status === status ? styles.active : ""} type="button" onClick={() => props.onStatusChange(status)}>
              {status}{props.status === status && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
