import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.image} role="img" aria-label="Paisagem ensolarada de Amargosa com morros verdes e bandeirolas coloridas" />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><Sparkles /> Cultura que encontra caminho</p>
          <h1>A próxima ideia pode começar <em>aqui.</em></h1>
          <p className={styles.lede}>Um ponto de encontro para descobrir editais, bolsas e oportunidades que movimentam a cultura de Amargosa.</p>
          <div className={styles.actions}>
            <a className="button button--primary" href="#editais">Explorar editais <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <p className={styles.note}><span aria-hidden="true" />Feito para quem cria,<br />produz e participa.</p>
      </div>
    </section>
  );
}
