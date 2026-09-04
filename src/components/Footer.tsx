import { Brand } from "./Brand";
import styles from "./Sections.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <Brand compact />
        <nav aria-label="Links do rodapé"><a href="#editais">Editais</a><a href="#sobre">Sobre</a><a href="#inicio">Voltar ao topo ↑</a></nav>
        <p>Um espaço para a cultura de Amargosa, Bahia.</p>
      </div>
    </footer>
  );
}
