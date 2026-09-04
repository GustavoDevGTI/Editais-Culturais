import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="inicio" aria-label="Destaque cultural">
      <picture>
        <source
          media="(max-width: 820px)"
          srcSet={`${import.meta.env.BASE_URL}images/banner-cultura-mobile.png`}
        />
        <img
          className={styles.banner}
          src={`${import.meta.env.BASE_URL}images/banner-cultura-desktop.png`}
          alt="Cadastro Municipal de Agentes Culturais. Sua arte, sua história, sua cultura. Cadastre-se e fortaleça as políticas públicas de cultura em Amargosa."
          width="4081"
          height="1020"
        />
      </picture>
    </section>
  );
}
