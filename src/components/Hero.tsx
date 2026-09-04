import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import styles from "./Hero.module.css";

const slideCount = 2;

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slideCount) % slideCount);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slideCount);
  };

  return (
    <section
      className={`${styles.hero} ${activeSlide === 0 ? styles.photoTheme : styles.artTheme}`}
      id="inicio"
      aria-roledescription="carrossel"
      aria-label="Destaques culturais"
    >
      <div className={styles.viewport}>
        <article className={`${styles.slide} ${styles.photoSlide} ${activeSlide === 0 ? styles.active : ""}`} aria-hidden={activeSlide !== 0}>
          <img
            className={styles.photo}
            src={`${import.meta.env.BASE_URL}images/amargosa-hero.jpg`}
            alt="Paisagem ensolarada de Amargosa com morros verdes e bandeirolas coloridas"
          />
          <div className={styles.overlay} aria-hidden="true" />
          <div className={styles.content}>
            <h1>A próxima ideia pode começar <em>aqui.</em></h1>
            <p>Um ponto de encontro para descobrir editais, bolsas e oportunidades que movimentam a cultura de Amargosa.</p>
            <a className="button button--primary" href="#editais" tabIndex={activeSlide === 0 ? 0 : -1}>
              Explorar editais <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className={`${styles.slide} ${styles.artSlide} ${activeSlide === 1 ? styles.active : ""}`} aria-hidden={activeSlide !== 1}>
          <picture>
            <source media="(max-width: 820px)" srcSet={`${import.meta.env.BASE_URL}images/banner-cultura-mobile.png`} />
            <img
              className={styles.banner}
              src={`${import.meta.env.BASE_URL}images/banner-cultura-desktop.png`}
              alt="Cadastro Municipal de Agentes Culturais. Sua arte, sua história, sua cultura. Cadastre-se e fortaleça as políticas públicas de cultura em Amargosa."
              width="4081"
              height="1020"
            />
          </picture>
        </article>
      </div>

      <div className={`${styles.controls} ${activeSlide === 0 ? styles.photoControls : styles.artControls}`}>
        <button type="button" onClick={showPrevious} aria-label="Banner anterior">
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className={styles.indicators} aria-label="Selecionar banner">
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              key={index}
              className={activeSlide === index ? styles.current : ""}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Mostrar banner ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={showNext} aria-label="Próximo banner">
          <ChevronRight aria-hidden="true" />
        </button>
        <span className="sr-only" aria-live="polite">Banner {activeSlide + 1} de {slideCount}</span>
      </div>
    </section>
  );
}
