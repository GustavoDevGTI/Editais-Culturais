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
        <div><p className="section-kicker">Sem complicação</p><h2>Encontrar uma oportunidade pode ser simples.</h2><p className={styles.lede}>A informação fica organizada para você dedicar mais tempo ao que importa: criar, participar e fazer acontecer.</p></div>
        <ol className={styles.steps}>
          {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ol>
      </div>
    </section>
  );
}
