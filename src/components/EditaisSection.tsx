import { Check, Search, X } from "lucide-react";
import type { Categoria, Edital, Status } from "../types/edital";
import { categorias, statuses } from "../types/edital";
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
  const hasFilters = props.query || props.categoria !== "Todas" || props.status !== "Todos";

  return (
    <section className={styles.section} id="editais">
      <div className="container">
        <div className={styles.heading}>
          <div><p className="section-kicker">Oportunidades em destaque</p><h2>Editais para fazer a cultura acontecer.</h2></div>
          <p>Informação reunida em um só lugar, com prazos e caminhos mais fáceis de encontrar.</p>
        </div>

        <div className={styles.demoNote}><strong>Conteúdo demonstrativo</strong><span>Substitua os exemplos pelos editais oficiais antes da divulgação pública.</span></div>

        <div className={styles.filters} role="search" aria-label="Buscar e filtrar editais">
          <label className={styles.search}>
            <Search aria-hidden="true" />
            <span className="sr-only">Buscar editais</span>
            <input value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Busque por palavra-chave..." />
          </label>
          <label className={styles.select}>
            <span className="sr-only">Área cultural</span>
            <select value={props.categoria} onChange={(event) => props.onCategoriaChange(event.target.value as Categoria | "Todas")}>
              <option value="Todas">Todas as áreas</option>
              {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
            </select>
          </label>
          {hasFilters && <button className={styles.clear} type="button" onClick={props.onClear}><X /> Limpar</button>}
        </div>

        <div className={styles.statusFilters} aria-label="Filtrar por situação">
          {(["Todos", ...statuses] as const).map((status) => (
            <button key={status} className={props.status === status ? styles.active : ""} type="button" onClick={() => props.onStatusChange(status)}>
              {status}{props.status === status && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>

        <p className={styles.resultCount}><strong>{props.editais.length}</strong> {props.editais.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"}</p>

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

        <p className={styles.total}>Mostrando {props.editais.length} de {props.total} editais cadastrados</p>
      </div>
    </section>
  );
}
