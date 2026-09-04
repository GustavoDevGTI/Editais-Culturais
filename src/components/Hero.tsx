import { ArrowDownRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.pattern} aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className={`container ${styles.content}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><Sparkles /> Cultura que encontra caminho</p>
          <h1>A próxima ideia pode começar <em>aqui.</em></h1>
          <p className={styles.lede}>Editais, bolsas e oportunidades para quem movimenta a cultura de Amargosa.</p>
          <a className="button button--primary" href="#editais">
            Explorar editais <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
        <div className={styles.aside}>
          <span className={styles.asideNumber}>29</span>
          <p>de outubro<br />Dia Nacional do Livro</p>
        </div>
      </div>
    </section>
  );
}
