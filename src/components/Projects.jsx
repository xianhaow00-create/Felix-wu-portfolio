// Projects — bento grid with alternating image/title alignment (Main.png style).
// Every project uses the same row layout — designed covers were folded into the
// shared pattern so the grid reads as one editorial flow.
import { site } from '../data/site.js';
import './Projects.css';

export function Projects() {
  return (
    <section id="work" className="section projects">
      <div className="wrap">
        <header className="projects-head reveal">
          <div className="projects-head-left">
            <span className="eyebrow"><span className="dot" /> Selected Work · 作品 / 2024 — 2026</span>
            <h2 className="projects-title">
              <span className="title-line"><span>Things I've made,</span></span>
              <span className="title-line"><span>slowly,</span></span>
              <span className="title-line"><span><em>with care.</em></span></span>
            </h2>
          </div>
          <p className="projects-intro">
            A curated selection across brand identity, packaging, IP, editorial, and motion.
            Each project links to the full case (PDF) or original artwork.
          </p>
        </header>

        <div className="projects-grid">
          {site.projects.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <a
                key={p.id}
                href={p.pdf}
                target="_blank"
                rel="noreferrer"
                className={`project-card card--${p.size || 'sm'} reveal`}
                data-delay={(i % 4) + 1}
                data-cursor="hover"
              >
                <div className={`project-row ${flip ? 'is-flipped' : ''}`}>
                  <div className="project-cover">
                    <img src={p.cover} alt={`${p.title} — preview`} loading="lazy" />
                    <div className="project-corner-mark" aria-hidden>↗</div>
                  </div>

                  <div className="project-meta">
                    <div className="project-meta-top">
                      <span className="project-cat-tag">{p.category}</span>
                      <span className="project-year">{p.year}</span>
                    </div>
                    <h3 className="project-title-en">{p.title}</h3>
                    <span className="project-title-cn serif-cn">{p.titleCn}</span>
                    <span className="project-divider" />
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-meta-foot">
                      <span className="project-type">{p.type}</span>
                      <span className="project-link">
                        Open case <span className="arrow">↗</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="projects-foot reveal">
          <span className="eyebrow"><span className="dot" /> 11 selected · 04 still in progress</span>
          <div className="cv-foot-cta">
            {/* Glass "Look here" pointer — draws the eye to the CV button */}
            <span className="cv-pointer" aria-hidden>
              <span className="cv-pointer-text">Look here</span>
              <span className="cv-pointer-arrow" />
            </span>
            <a
              href="/projects/about.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              data-cursor="hover"
            >
              <span>Read full CV</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}