import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const slideCount = 5;
const slideControlColors = [
  "#cf573b",
  "#cf2e4a",
  "#c8750a",
  "#2b6353",
  "#cf2f4b",
] as const;

interface HeroProps {
  onExplore: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeSlide, isPaused, prefersReducedMotion]);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slideCount) % slideCount);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slideCount);
  };

  const photoImage = `${import.meta.env.BASE_URL}images/amargosa-hero.jpg`;
  const editaisDesktop = `${import.meta.env.BASE_URL}images/banner-editais-culturais-desktop.png`;
  const editaisMobile = `${import.meta.env.BASE_URL}images/banner-editais-culturais-mobile.png`;
  const artworkDesktop = `${import.meta.env.BASE_URL}images/banner-cultura-desktop.png`;
  const artworkMobile = `${import.meta.env.BASE_URL}images/banner-cultura-mobile.png`;
  const brasaoDesktop = `${import.meta.env.BASE_URL}images/concurso-brasao-desktop-final.png`;
  const brasaoMobile = `${import.meta.env.BASE_URL}images/concurso-brasao-mobile-hq.png`;
  const pnabDesktop = `${import.meta.env.BASE_URL}images/banner-pnab-desktop.jpg`;
  const pnabMobile = `${import.meta.env.BASE_URL}images/banner-pnab-mobile.jpg`;

  return (
    <section
      className={styles.hero}
      id="inicio"
      aria-roledescription="carrossel"
      aria-label="Destaques culturais"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className={styles.viewport}>
        <article className={`${styles.slide} ${styles.photoSlide} ${activeSlide === 0 ? styles.active : ""}`} aria-hidden={activeSlide !== 0}>
          <img
            className={styles.photo}
            src={photoImage}
            alt="Paisagem ensolarada de Amargosa com morros verdes e bandeirolas coloridas"
          />
          <div className={styles.overlay} aria-hidden="true" />
          <div className={styles.content}>
            <h1>A próxima ideia pode começar <em>aqui.</em></h1>
            <p>Um ponto de encontro para descobrir editais, bolsas e oportunidades que movimentam a cultura de Amargosa.</p>
            <button className="button button--primary" type="button" onClick={onExplore} tabIndex={activeSlide === 0 ? 0 : -1}>
              Explorar editais <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </article>

        <article className={`${styles.slide} ${styles.bannerSlide} ${styles.pnabSlide} ${activeSlide === 1 ? styles.active : ""}`} aria-hidden={activeSlide !== 1}>
          <button
            className={styles.bannerAction}
            type="button"
            onClick={onExplore}
            tabIndex={activeSlide === 1 ? 0 : -1}
            aria-label="Acessar todos os editais culturais de Amargosa"
          >
            <picture>
              <source media="(max-width: 820px)" srcSet={editaisMobile} />
              <img
                className={styles.banner}
                src={editaisDesktop}
                alt="Editais Culturais. Consulte todos os editais culturais de Amargosa. Acesse aqui."
                width="4529"
                height="1018"
              />
            </picture>
          </button>
        </article>

        <article className={`${styles.slide} ${styles.bannerSlide} ${styles.artSlide} ${activeSlide === 2 ? styles.active : ""}`} aria-hidden={activeSlide !== 2}>
          <a
            href="https://docs.google.com/forms/d/1Vh3jhadwomxUPvtiREkEX4L-xBd9dE4VmidStXkkydQ/viewform?chromeless=1&edit_requested=true"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={activeSlide === 2 ? 0 : -1}
            aria-label="Acessar o Cadastro Municipal de Agentes Culturais. Abre um formulário em uma nova aba."
          >
            <picture>
              <source media="(max-width: 820px)" srcSet={artworkMobile} />
              <img
                className={styles.banner}
                src={artworkDesktop}
                alt="Cadastro Municipal de Agentes Culturais. Sua arte, sua história, sua cultura. Cadastre-se e fortaleça as políticas públicas de cultura em Amargosa."
                width="4081"
                height="1020"
              />
            </picture>
          </a>
        </article>

        <article className={`${styles.slide} ${styles.bannerSlide} ${styles.brasaoSlide} ${activeSlide === 3 ? styles.active : ""}`} aria-hidden={activeSlide !== 3}>
          <a
            href="https://servicos.amargosa.ba.gov.br/b.php?pg=o%2Fbusca_servicos&search=bras%C3%A3o"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={activeSlide === 3 ? 0 : -1}
            aria-label="Inscrever-se no concurso para escolha do Brasão Municipal. Abre o Portal de Serviços de Amargosa em uma nova aba."
          >
            <picture>
              <source media="(max-width: 820px)" srcSet={brasaoMobile} />
              <img
                className={styles.banner}
                src={brasaoDesktop}
                alt="Concurso para escolha do Brasão Municipal de Amargosa, com prêmio de R$ 10 mil. Inscreva-se aqui."
                width="2560"
                height="640"
              />
            </picture>
          </a>
        </article>

        <article className={`${styles.slide} ${styles.bannerSlide} ${styles.pnabSlide} ${activeSlide === 4 ? styles.active : ""}`} aria-hidden={activeSlide !== 4}>
          <button
            className={styles.bannerAction}
            type="button"
            onClick={onExplore}
            tabIndex={activeSlide === 4 ? 0 : -1}
            aria-label="Acessar os editais da Política Nacional Aldir Blanc"
          >
            <picture>
              <source media="(max-width: 820px)" srcSet={pnabMobile} />
              <img
                className={styles.banner}
                src={pnabDesktop}
                alt="Política Nacional Aldir Blanc. Acesse os editais aqui."
                width="1600"
                height="359"
              />
            </picture>
          </button>
        </article>

        <button className={`${styles.mobileArrow} ${styles.mobileArrowPrevious}`} type="button" onClick={showPrevious} aria-label="Banner anterior">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button className={`${styles.mobileArrow} ${styles.mobileArrowNext}`} type="button" onClick={showNext} aria-label="Próximo banner">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div
        className={styles.controls}
        style={{ "--control-accent": slideControlColors[activeSlide] } as CSSProperties}
      >
        <div className={styles.controlPanel}>
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
      </div>
    </section>
  );
}
