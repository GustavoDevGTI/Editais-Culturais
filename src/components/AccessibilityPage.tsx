import { ArrowLeft } from "lucide-react";
import type { Edital } from "../types/edital";
import { compareEditais } from "../utils/editais";
import { AccessibilityMenu, AccessibilitySettings } from "./AccessibilityControls";
import { Footer } from "./Footer";
import styles from "./AccessibilityPage.module.css";

interface AccessibilityPageProps {
  editais: Edital[];
  onBack: () => void;
  onOpen: (id: string) => void;
}

export function AccessibilityPage({ editais, onBack, onOpen }: AccessibilityPageProps) {
  const orderedEditais = [...editais].sort(compareEditais);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo-acessibilidade">Pular para o conteúdo</a>
      <header className={styles.topbar}>
        <button className={styles.back} type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Voltar à página inicial</button>
        <button className={styles.brand} type="button" onClick={onBack} aria-label="Voltar à página inicial">
          <img src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`} alt="Prefeitura de Amargosa" />
        </button>
        <div className={styles.accessibility}><AccessibilityMenu /></div>
      </header>

      <main className={styles.page} id="conteudo-acessibilidade">
        <div className="container">
          <div className={styles.hero}>
            <p className="section-kicker">Acesso para todas as pessoas</p>
            <h1>Acessibilidade no portal</h1>
            <p>Use os recursos de leitura abaixo ou navegue diretamente por todas as páginas e editais publicados. As preferências escolhidas ficam salvas neste dispositivo.</p>
          </div>

          <section className={styles.section} aria-labelledby="preferencias-title">
            <h2 id="preferencias-title">Preferências de leitura</h2>
            <AccessibilitySettings page />
          </section>

          <section className={styles.section} aria-labelledby="mapa-title">
            <h2 id="mapa-title">Mapa do portal</h2>
            <nav aria-label="Todas as páginas do portal">
              <ul className={styles.siteMap}>
                <li><a href="#inicio">Página inicial</a></li>
                <li><a href="#/editais">Todos os editais</a></li>
                <li><a href="#/sobre">Sobre o portal</a></li>
                <li><a href="#/acessibilidade" aria-current="page">Acessibilidade</a></li>
              </ul>
            </nav>
          </section>

          <section className={styles.section} aria-labelledby="editais-acessiveis-title">
            <h2 id="editais-acessiveis-title">Editais publicados</h2>
            <ul className={styles.editaisList}>
              {orderedEditais.map((edital) => (
                <li key={edital.id}>
                  <article className={styles.edital}>
                    <div className={styles.editalHeader}>
                      <div>
                        <p className={styles.editalLabel}>{edital.label}</p>
                        <h3>{edital.title}</h3>
                      </div>
                      <span className={styles.status}>{edital.status}</span>
                    </div>
                    <p className={styles.summary}>{edital.summary}</p>
                    <p className={styles.meta}><span>Categoria: {edital.category}</span><span>Prazo: {edital.deadline}</span></p>
                    <div className={styles.actions}>
                      <a
                        href={`#/editais/${encodeURIComponent(edital.id)}`}
                        onClick={(event) => {
                          event.preventDefault();
                          onOpen(edital.id);
                        }}
                      >Abrir edital no leitor acessível</a>
                      {edital.externalAccess && <a href={edital.externalAccess.url} target="_blank" rel="noopener noreferrer">Inscrever-se em plataforma externa</a>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="recursos-title">
            <h2 id="recursos-title">Recursos disponíveis</h2>
            <ul className={styles.resources}>
              <li><strong>Leitor de tela</strong>O texto dos documentos é disponibilizado dentro do próprio leitor de PDF, sem alterar a visualização.</li>
              <li><strong>Navegação por teclado</strong>Links, filtros, menus e documentos podem ser percorridos sem o uso do mouse.</li>
              <li><strong>Alto contraste</strong>A paleta do portal pode ser trocada por uma versão de contraste reforçado.</li>
              <li><strong>VLibras</strong>O conteúdo textual pode ser traduzido para Língua Brasileira de Sinais pelo recurso oficial.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
