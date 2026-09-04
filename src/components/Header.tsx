import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./Header.module.css";

const links = [
  { label: "Editais", href: "#editais" },
  { label: "Sobre o portal", href: "#sobre" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logoLink} href="#inicio" aria-label="Prefeitura de Amargosa — início">
          <img
            className={styles.governmentLogo}
            src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`}
            alt="Prefeitura de Amargosa — Cidade Jardim de Todos"
          />
        </a>
        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a className={styles.savedLink} href="#editais">
          <Heart aria-hidden="true" />
          Meus salvos
        </a>
        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <nav id="menu-mobile" className={styles.mobileNav} aria-label="Navegação móvel">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
