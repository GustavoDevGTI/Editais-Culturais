import styles from "./Sections.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} id="sobre">
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerLogo}>
          <img
            className={styles.footerLogoWhite}
            src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`}
            alt="Prefeitura de Amargosa — Cidade Jardim de Todos"
          />
          <img
            className={styles.footerLogoIcon}
            src={`${import.meta.env.BASE_URL}images/logo-prefeitura-icon.png`}
            alt=""
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="section-kicker">Sobre o portal</p>
          <h2>Uma janela aberta para a cultura da nossa cidade.</h2>
          <p>Este espaço reúne oportunidades públicas para artistas, coletivos, grupos, produtores e fazedores de cultura de Amargosa. Um serviço simples, próximo e em constante construção.</p>
        </div>
        <blockquote>
          <p>“Música para o mundo, basta de violência.”</p>
          <cite>Carlinhos Brown<br />Embaixador Ibero-Americano da Cultura</cite>
        </blockquote>
      </div>
    </footer>
  );
}
