import styles from "./Header.module.css";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className={styles.brandText}>
        <strong>Amargosa</strong>
        {!compact && <em>Cultura</em>}
      </span>
    </span>
  );
}
