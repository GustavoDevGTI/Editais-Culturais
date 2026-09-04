import { ArrowRight } from "lucide-react";
import styles from "./Sections.module.css";

const steps = [
  ["01", "Encontre", "Busque por área, situação ou palavra-chave."],
  ["02", "Entenda", "Confira o prazo e para quem é a oportunidade."],
  ["03", "Participe", "Acesse a publicação oficial e prepare sua inscrição."],
];

export function HowItWorks() {
  return (
    <section className={styles.how} id="como-funciona">
      <div className={`container ${styles.howGrid}`}>
        <div><p className="section-kicker">Sem complicação</p><h2>Encontrar uma oportunidade pode ser simples.</h2><p className={styles.lede}>Organizamos os editais para que você possa dedicar mais tempo ao que realmente importa: criar, participar e fazer acontecer.</p><a className="button button--secondary" href="#editais">Conheça o guia <ArrowRight aria-hidden="true" /></a></div>
        <ol className={styles.steps}>
          {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ol>
      </div>
    </section>
  );
}
