import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Categoria } from "../types/edital";
import styles from "./Editais.module.css";

interface CategorySelectProps {
  categorias: Categoria[];
  value: Categoria | "Todas";
  onChange: (value: Categoria | "Todas") => void;
}

export function CategorySelect({ categorias, value, onChange }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectOption = (option: Categoria | "Todas") => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.select} ref={rootRef}>
      <SlidersHorizontal aria-hidden="true" />
      <button
        className={styles.selectTrigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value === "Todas" ? "Categorias" : value}</span>
        <ChevronDown className={isOpen ? styles.chevronOpen : ""} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.categoryMenu} id={menuId} role="listbox" aria-label="Categorias culturais">
          {(["Todas", ...categorias] as Array<Categoria | "Todas">).map((option) => (
            <button
              className={value === option ? styles.selectedCategory : ""}
              type="button"
              role="option"
              aria-selected={value === option}
              key={option}
              onClick={() => selectOption(option)}
            >
              <span>{option === "Todas" ? "Categorias" : option}</span>
              {value === option && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
