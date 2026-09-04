import styles from "./Sections.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} id="sobre">
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.seal}>
          <img
            src={`${import.meta.env.BASE_URL}images/logo-prefeitura-icon.png`}
            alt="Símbolo da Prefeitura de Amargosa"
          />
        </div>
        <div>
          <p className="section-kicker">Sobre o portal</p>
          <h2>Uma janela aberta para a cultura da nossa cidade.</h2>
          <p>Este espaço reúne oportunidades públicas para artistas, coletivos, grupos, produtores e fazedores de cultura de Amargosa. Um serviço simples, próximo e em constante construção.</p>
        </div>
        <blockquote>“Cultura é quando a cidade se reconhece no que faz.”</blockquote>
      </div>
    </footer>
  );
}
