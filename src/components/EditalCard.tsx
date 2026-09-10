import { ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import type { Edital } from "../types/edital";
import styles from "./Editais.module.css";

interface EditalCardProps {
  edital: Edital;
  index: number;
  onOpen: (edital: Edital) => void;
}

export function EditalCard({ edital, index, onOpen }: EditalCardProps) {
  const statusClass = edital.status === "Aberto" ? styles.open : edital.status === "Em breve" ? styles.soon : styles.closed;
  const cardStatusClass = edital.status === "Aberto"
    ? styles.cardOpen
    : edital.status === "Em breve"
      ? styles.cardSoon
      : styles.cardClosed;

  return (
    <article className={`${styles.card} ${cardStatusClass}`}>
      <button
        className={styles.cardHitArea}
        type="button"
        aria-label={`Ler o edital completo: ${edital.title}`}
        onClick={() => onOpen(edital)}
      />
      <div className={styles.cardTopline}>
        <span className={`${styles.status} ${statusClass}`}><i />{edital.status}</span>
        <span className={styles.category}>{edital.category}</span>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p className={styles.label}>{edital.label}</p>
          <h3>{edital.title}</h3>
          <p>{edital.summary}</p>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <span><CalendarDays aria-hidden="true" />{edital.deadline}</span>
        <div className={styles.cardActions}>
          {edital.externalAccess && (
            <a
              className={styles.externalAccess}
              href={edital.externalAccess.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`${edital.externalAccess.label}. Abre em uma nova aba.`}
            >
              <strong>Inscrever-se<ExternalLink aria-hidden="true" /></strong>
            </a>
          )}
          <span className={styles.cardAction}>Abrir edital <ArrowRight aria-hidden="true" /></span>
        </div>
      </div>
    </article>
  );
}
