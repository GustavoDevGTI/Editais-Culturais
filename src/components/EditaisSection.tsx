import { ArrowRight, Check, Clock3, Filter, Search, X } from "lucide-react";
import { useState } from "react";
import type { Categoria, Edital, Status } from "../types/edital";
import { statuses } from "../types/edital";
import { CategorySelect } from "./CategorySelect";
import { EditalCard } from "./EditalCard";
import styles from "./Editais.module.css";

interface EditaisSectionProps {
  categoria: Categoria | "Todas";
  editais: Edital[];
  query: string;
  status: Status | "Todos";
  total: number;
  onCategoriaChange: (value: Categoria | "Todas") => void;
  onClear: () => void;
  onOpen: (edital: Edital) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: Status | "Todos") => void;
}

export function EditaisSection(props: EditaisSectionProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = props.query || props.categoria !== "Todas" || props.status !== "Todos";
  const statusFilterCount = props.status === "Todos" ? 0 : 1;

  return (
    <section className={styles.section} id="editais">
      <div className="container">
        <div className={styles.heading}>
          <div><p className="section-kicker">Oportunidades em destaque</p><h2>Editais para fazer a cultura acontecer.</h2></div>
        </div>

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

        <div className={styles.resultsMeta}>
          <p><strong>{props.editais.length}</strong> {props.editais.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"}</p>
          <p><Clock3 aria-hidden="true" />Atualizado em 4 de setembro de 2026</p>
        </div>

        {props.editais.length > 0 ? (
          <div className={styles.list}>
            {props.editais.map((edital, index) => <EditalCard key={edital.id} edital={edital} index={index} onOpen={props.onOpen} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <Search aria-hidden="true" />
            <h3>Nenhum edital encontrado</h3>
            <p>Tente outra palavra ou remova os filtros.</p>
            <button className="button button--outline" type="button" onClick={props.onClear}>Ver todos os editais</button>
          </div>
        )}

        <div className={styles.listFooter}>
          <p>Mostrando {props.editais.length} de {props.total} editais publicados</p>
          <button className="button button--outline" type="button" onClick={props.onClear}>Ver todos os editais <ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
