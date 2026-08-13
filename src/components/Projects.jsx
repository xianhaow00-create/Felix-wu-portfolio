// Projects — bento grid with alternating image/title alignment (Main.png style).
// Every project uses the same row layout — designed covers were folded into the
// shared pattern so the grid reads as one editorial flow.
//
// Round 35: clicking a card no longer navigates away to the raw PDF. It opens an
// in-page lightbox that embeds the PDF via <iframe>, so visitors read the full
// case study on the site (no download, no tab jump). The raw PDF is still one
// click away ("新标签打开") for saving/archiving.
import { useState, useEffect } from 'react';
import { site } from '../data/site.js';
import './Projects.css';

export function Projects() {
  const [active, setActive] = useState(null); // { pdf, title, titleCn, category }

  const openPdf = (p) =>
    setActive({ pdf: p.pdf, title: p.title, titleCn: p.titleCn, category: p.category });
  const closePdf = () => setActive(null);

  // Esc to close + lock page scroll while the lightbox is open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closePdf();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

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
            Click any project to read the full case study inline.
          </p>
        </header>

        <div className="projects-grid">
          {site.projects.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <a
                key={p.id}
                href={p.pdf}
                onClick={(e) => {
                  e.preventDefault();
                  openPdf(p);
                }}
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
                        View case <span className="arrow">↗</span>
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
              onClick={(e) => {
                e.preventDefault();
                openPdf({ pdf: '/projects/about.pdf', title: 'Read full CV', titleCn: '简历 / CV', category: 'CV' });
              }}
              className="btn btn-ghost"
              data-cursor="hover"
            >
              <span>Read full CV</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── In-page PDF lightbox ─────────────────────────────────────── */}
      {active && (
        <div
          className="pdf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.titleCn || active.title}
          onClick={closePdf}
        >
          <div className="pdf-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-lightbox-bar">
              <div className="pdf-lightbox-info">
                <span className="pdf-lightbox-cat">{active.category}</span>
                <span className="pdf-lightbox-title">{active.titleCn || active.title}</span>
              </div>
              <div className="pdf-lightbox-actions">
                <a className="pdf-lightbox-ext" href={active.pdf} target="_blank" rel="noreferrer">
                  新标签打开 ↗
                </a>
                <button className="pdf-lightbox-close" onClick={closePdf} aria-label="关闭">×</button>
              </div>
            </div>
            <iframe className="pdf-lightbox-frame" src={active.pdf} title={active.titleCn || active.title} />
          </div>
        </div>
      )}
    </section>
  );
}
