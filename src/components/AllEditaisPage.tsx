import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import type { Edital } from "../types/edital";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./AllEditaisPage.module.css";

interface AllEditaisPageProps {
  editais: Edital[];
  onBack: () => void;
  onOpen: (id: string) => void;
}

export function AllEditaisPage({ editais, onBack, onOpen }: AllEditaisPageProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#lista-completa">Pular para os editais</a>
      <Header />
      <main className={styles.page} id="lista-completa">
        <div className="container">
          <button className={styles.back} type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Voltar à página inicial</button>
          <div className={styles.heading}>
            <div>
              <p className="section-kicker">Oportunidades culturais</p>
              <h1>Todos os editais</h1>
            </div>
            <p>{editais.length} {editais.length === 1 ? "edital publicado" : "editais publicados"}</p>
          </div>

          <div className={styles.list}>
            {editais.map((edital) => {
              const statusClass = edital.status === "Aberto" ? styles.open : edital.status === "Em breve" ? styles.soon : styles.closed;
              const cardClass = edital.status === "Aberto" ? styles.cardOpen : edital.status === "Em breve" ? styles.cardSoon : styles.cardClosed;

              return (
                <article className={`${styles.card} ${cardClass}`} key={edital.id}>
                  <button type="button" onClick={() => onOpen(edital.id)} aria-label={`Abrir edital: ${edital.title}`}>
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
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
