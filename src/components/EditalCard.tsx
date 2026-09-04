import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Edital } from "../types/edital";
import styles from "./Editais.module.css";

interface EditalCardProps {
  edital: Edital;
  index: number;
  onOpen: (edital: Edital) => void;
}

export function EditalCard({ edital, index, onOpen }: EditalCardProps) {
  const statusClass = edital.status === "Aberto" ? styles.open : edital.status === "Em breve" ? styles.soon : styles.closed;

  return (
    <article className={`${styles.card} ${edital.featured ? styles.featured : ""}`}>
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
        <button type="button" onClick={() => onOpen(edital)}>
          Ver edital <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
