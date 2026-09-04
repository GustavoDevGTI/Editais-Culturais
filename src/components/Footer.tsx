import { Brand } from "./Brand";
import styles from "./Sections.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerBrand}><Brand compact /><span>Informação para criar e participar.</span></div>
        <nav aria-label="Links do rodapé"><a href="#editais">Editais</a><a href="#sobre">Sobre</a><a href="#inicio">Voltar ao topo ↑</a></nav>
        <p>Um espaço de cultura pública para Amargosa, Bahia.</p>
      </div>
    </footer>
  );
}
