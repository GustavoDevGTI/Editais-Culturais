import { Contrast, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useAccessibility } from "../accessibility/AccessibilityContext";
import styles from "./AccessibilityControls.module.css";

interface AccessibilitySettingsProps {
  page?: boolean;
}

export function AccessibilitySettings({ page = false }: AccessibilitySettingsProps) {
  const {
    canDecrease,
    canIncrease,
    decreaseFont,
    fontSize,
    highContrast,
    increaseFont,
    resetPreferences,
    setDefaultFont,
    toggleContrast,
  } = useAccessibility();

  return (
    <div className={page ? styles.pageSettings : undefined}>
      <div className={styles.settings}>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Tamanho do texto</span>
          <div className={styles.fontGroup} role="group" aria-label="Alterar tamanho do texto">
            <button type="button" onClick={decreaseFont} disabled={!canDecrease} aria-label="Diminuir tamanho do texto">A−</button>
            <button type="button" onClick={setDefaultFont} aria-pressed={fontSize === 100} aria-label="Restaurar tamanho normal do texto">A</button>
            <button type="button" onClick={increaseFont} disabled={!canIncrease} aria-label="Aumentar tamanho do texto">A+</button>
          </div>
        </div>
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Preferência visual</span>
          <button className={styles.contrastButton} type="button" onClick={toggleContrast} aria-pressed={highContrast}>
            <span>{highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}</span><Contrast aria-hidden="true" />
          </button>
        </div>
        <button className={styles.resetButton} type="button" onClick={resetPreferences}>Redefinir</button>
        <p className={`sr-only ${styles.liveStatus}`} aria-live="polite">Texto em {fontSize}%. Alto contraste {highContrast ? "ativado" : "desativado"}.</p>
      </div>
    </div>
  );
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.document.addEventListener("mousedown", closeOnOutsideClick);
    window.document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.document.removeEventListener("mousedown", closeOnOutsideClick);
      window.document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Abrir recursos de acessibilidade"
        title="Recursos de acessibilidade"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">Aa</span>
      </button>
      {open && (
        <section className={styles.popover} id={panelId} aria-label="Recursos de acessibilidade">
          <div className={styles.popoverHeader}>
            <strong>Acessibilidade</strong>
            <button className={styles.close} type="button" onClick={() => setOpen(false)} aria-label="Fechar recursos de acessibilidade"><X aria-hidden="true" /></button>
          </div>
          <AccessibilitySettings />
          <a className={styles.pageLink} href="#/acessibilidade" onClick={() => setOpen(false)}>Conheça os recursos e navegue pelo portal</a>
        </section>
      )}
    </div>
  );
}
