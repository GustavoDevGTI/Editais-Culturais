import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import type { Categoria, Edital, Status } from "../types/edital";
import { Footer } from "./Footer";
import { EditaisFilters } from "./EditaisFilters";
import styles from "./AllEditaisPage.module.css";

interface AllEditaisPageProps {
  editais: Edital[];
  categoria: Categoria | "Todas";
  query: string;
  status: Status | "Todos";
  onBack: () => void;
  onCategoriaChange: (value: Categoria | "Todas") => void;
  onClear: () => void;
  onOpen: (id: string) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: Status | "Todos") => void;
}

export function AllEditaisPage(props: AllEditaisPageProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#lista-completa">Pular para os editais</a>
      <header className={styles.topbar}>
        <button className={styles.back} type="button" onClick={props.onBack}><ArrowLeft aria-hidden="true" /> Voltar à página inicial</button>
        <button className={styles.brand} type="button" onClick={props.onBack} aria-label="Voltar à página inicial">
          <img src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`} alt="Prefeitura de Amargosa" />
        </button>
      </header>
      <main className={styles.page} id="lista-completa">
        <div className="container">
          <div className={styles.heading}>
            <div>
              <p className="section-kicker">Oportunidades culturais</p>
              <h1>Todos os editais</h1>
            </div>
            <p>{props.editais.length} {props.editais.length === 1 ? "edital encontrado" : "editais encontrados"}</p>
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

          <div className={styles.list}>
            {props.editais.map((edital) => {
              const statusClass = edital.status === "Aberto" ? styles.open : edital.status === "Em breve" ? styles.soon : styles.closed;
              const cardClass = edital.status === "Aberto" ? styles.cardOpen : edital.status === "Em breve" ? styles.cardSoon : styles.cardClosed;

              return (
                <article className={`${styles.card} ${cardClass}`} key={edital.id}>
                  <button type="button" onClick={() => props.onOpen(edital.id)} aria-label={`Abrir edital: ${edital.title}`}>
                    <span className={styles.topline}>
                      <span className={`${styles.status} ${statusClass}`}><i />{edital.status}</span>
                      <span className={styles.category}>{edital.category}</span>
                    </span>
                    <span className={styles.label}>{edital.label}</span>
                    <strong>{edital.title}</strong>
                    <span className={styles.footer}>
                      <span><CalendarDays aria-hidden="true" />{edital.deadline}</span>
                      <span className={styles.openAction}>Abrir edital <ArrowRight aria-hidden="true" /></span>
                    </span>
                  </button>
                  {edital.externalAccess && (
                    <a
                      className={styles.externalAccess}
                      href={edital.externalAccess.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${edital.externalAccess.label}. Destino: ${edital.externalAccess.destination}`}
                    >
                      <span><strong>{edital.externalAccess.label}</strong><ExternalLink aria-hidden="true" /></span>
                      <small>Destino externo: {edital.externalAccess.destination}</small>
                    </a>
                  )}
                </article>
              );
            })}
          </div>

          {props.editais.length === 0 && (
            <div className={styles.empty}>
              <p>Nenhum edital encontrado com esses filtros.</p>
              <button className="button button--outline" type="button" onClick={props.onClear}>Limpar busca e filtros</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
