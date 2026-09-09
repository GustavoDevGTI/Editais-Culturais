import { ArrowLeft, CheckCircle2, Code2, UsersRound } from "lucide-react";
import { Footer } from "./Footer";
import styles from "./AboutPage.module.css";

interface AboutPageProps {
  onBack: () => void;
}

const tourismTeam = [
  { name: "Carlos Antônio Muñoz", role: "Superintendente" },
  { name: "Euraciara Borges", role: "Supervisora" },
];

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo-sobre">Pular para o conteúdo</a>
      <header className={styles.topbar}>
        <button className={styles.back} type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" /> Voltar à página inicial
        </button>
        <button className={styles.brand} type="button" onClick={onBack} aria-label="Voltar à página inicial">
          <img src={`${import.meta.env.BASE_URL}images/logo-prefeitura-amargosa.png`} alt="Prefeitura de Amargosa" />
        </button>
      </header>

      <main id="conteudo-sobre">
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <p className="section-kicker">Sobre o portal</p>
              <h1>Cultura com transparência.</h1>
              <div className={styles.heroText}>
                <p>Este portal foi criado para ampliar a transparência com a população e apresentar os editais culturais de Amargosa de maneira organizada, simples e acessível.</p>
                <p>Ao reunir editais ativos, futuros e encerrados em um só lugar, com busca, filtros e acesso direto aos documentos oficiais, o portal facilita o acompanhamento de oportunidades e prazos. A informação clara também aproxima artistas, coletivos, produtores e todos que ajudam a construir a cultura do município.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.institutional}>
          <div className={`container ${styles.nucleusCard}`}>
            <div className={styles.sectionIntro}>
              <p className={`section-kicker ${styles.institutionalKicker}`}>Estrutura institucional</p>
              <h2>Cultura e Turismo com gestão dedicada.</h2>
              <div className={styles.sectionText}>
                <p>A Superintendência de Cultura e Turismo de Amargosa atua no fortalecimento e na promoção das políticas públicas do setor, valorizando as potencialidades do município e impulsionando seu desenvolvimento.</p>
                <p>A atuação integrada entre poder público e participação social ajuda a planejar ações, fortalecer a identidade cultural e ampliar oportunidades econômicas e sociais.</p>
              </div>
            </div>

            <div className={styles.teamCards}>
              {tourismTeam.map((member) => (
                <article key={member.name}>
                  <span className={styles.teamIcon}><UsersRound aria-hidden="true" /></span>
                  <h3>{member.name}</h3>
                  <strong>{member.role}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.technology}>
          <div className={`container ${styles.nucleusCard}`}>
            <div className={styles.sectionIntro}>
              <p className="section-kicker">Núcleo técnico de desenvolvimento</p>
              <h2>Tecnologia a serviço da cultura e da transparência.</h2>
              <p>O núcleo técnico transforma a informação pública em uma experiência digital clara, responsiva e acessível. A equipe cuida da evolução da plataforma e dá suporte à organização e à publicação dos conteúdos.</p>
            </div>

            <div className={styles.teamCards}>
              <article>
                <span className={styles.teamIcon}><UsersRound aria-hidden="true" /></span>
                <p>Gestão de Tecnologia da Informação · GTI</p>
                <h3>Jurandy Silva dos Santos Júnior</h3>
                <strong>Gestor</strong>
              </article>
              <article>
                <span className={styles.teamIcon}><Code2 aria-hidden="true" /></span>
                <p>Corpo técnico · GTI</p>
                <h3>Gustavo Almeida Borges</h3>
                <strong>Desenvolvedor Full Stack</strong>
              </article>
            </div>

            <div className={styles.commitment}>
              <CheckCircle2 aria-hidden="true" />
              <span>Desenvolvimento e manutenção realizados pela Gestão de Tecnologia da Informação da Prefeitura de Amargosa.</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
