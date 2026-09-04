import { CalendarDays, ExternalLink, Users, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Edital } from "../types/edital";
import styles from "./EditalDialog.module.css";

interface EditalDialogProps {
  edital: Edital | null;
  onClose: () => void;
}

export function EditalDialog({ edital, onClose }: EditalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (edital && !dialog.open) dialog.showModal();
    if (!edital && dialog.open) dialog.close();
  }, [edital]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      {edital && (
        <div className={styles.content}>
          <button className={styles.close} type="button" onClick={() => dialogRef.current?.close()} aria-label="Fechar detalhes"><X /></button>
          <span className={styles.status}>{edital.status}</span>
          <p className="section-kicker">{edital.category}</p>
          <h2>{edital.title}</h2>
          <p className={styles.summary}>{edital.summary}</p>
          <dl className={styles.details}>
            <div><CalendarDays aria-hidden="true" /><dt>Prazo</dt><dd>{edital.deadline}</dd></div>
            <div><Users aria-hidden="true" /><dt>Para quem</dt><dd>{edital.audience}</dd></div>
          </dl>
          {edital.officialUrl ? (
            <a className="button button--primary button--full" href={edital.officialUrl} target="_blank" rel="noreferrer">Acessar edital oficial <ExternalLink /></a>
          ) : (
            <p className={styles.noLink}>O link oficial será incluído quando este conteúdo demonstrativo for substituído.</p>
          )}
          <small>{edital.publishedAt}</small>
        </div>
      )}
    </dialog>
  );
}
