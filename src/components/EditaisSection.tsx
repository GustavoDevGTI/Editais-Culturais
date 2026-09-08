import { ArrowRight, Clock3, Search } from "lucide-react";
import type { Categoria, Edital, Status } from "../types/edital";
import { EditalCard } from "./EditalCard";
import { EditaisFilters } from "./EditaisFilters";
import styles from "./Editais.module.css";

interface EditaisSectionProps {
  categoria: Categoria | "Todas";
  editais: Edital[];
  query: string;
  status: Status | "Todos";
  onCategoriaChange: (value: Categoria | "Todas") => void;
  onClear: () => void;
  onOpen: (edital: Edital) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: Status | "Todos") => void;
  onViewAll: () => void;
}

export function EditaisSection(props: EditaisSectionProps) {
  return (
    <section className={styles.section} id="editais">
      <div className="container">
        <div className={styles.heading}>
          <div><p className="section-kicker">Oportunidades em destaque</p><h2>Editais para fazer a cultura acontecer.</h2></div>
        </div>

        <EditaisFilters
          categoria={props.categoria}
          query={props.query}
          status={props.status}
          onCategoriaChange={props.onCategoriaChange}
          onClear={props.onClear}
          onQueryChange={props.onQueryChange}
          onStatusChange={props.onStatusChange}
        />

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
            <button className="button button--outline" type="button" onClick={props.onViewAll}>Ver todos os editais</button>
          </div>
        )}

        <div className={styles.listFooter}>
          <button className="button button--outline" type="button" onClick={props.onViewAll}>Ver todos os editais <ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
