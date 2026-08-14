// Projects — bento grid with alternating image/title alignment (Main.png style).
// Every project uses the same row layout — designed covers were folded into the
// shared pattern so the grid reads as one editorial flow.
//
// Round 38: hover logic redesigned.
//   • Default state: the cover image is HIDDEN. The card shows a large
//     italic-serif title centered on a cream field — like a quiet poster
//     that whispers the project's name (no image, no clutter).
//   • Hover state: the cover image fades in (over ~0.5s) and gently
//     scales from 1.08 → 1.04 (the "photo zoom" effect is preserved).
//   • The bottom meta (cat tag · title · cn · desc · View case) is always
//     visible — it's the editorial label, not the cover.
//
// Round 35/36: clicking a card opens an in-page lightbox. Images render inline
// via <img> (no download); PDFs embed via <iframe>. The raw file is one click
// away ("新标签打开") for saving/archiving.
import { useState, useEffect } from 'react';
import { site } from '../data/site.js';
import './Projects.css';

export function Projects() {
  const [active, setActive] = useState(null); // { work, title, titleCn, category }

  const openWork = (p) =>
    setActive({ work: p.work, title: p.title, titleCn: p.titleCn, category: p.category });
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
            // First word of the English title (or CN if EN is short).
            // Used as the centered name on the default "poster" card.
            const coverName = p.title.split(' ')[0] || p.titleCn;
            return (
              <a
                key={p.id}
                href={p.work}
                onClick={(e) => {
                  e.preventDefault();
                  openWork(p);
                }}
                className={`project-card card--${p.size || 'sm'} reveal`}
                data-delay={(i % 4) + 1}
                data-cursor="hover"
              >
                <div className={`project-row ${flip ? 'is-flipped' : ''}`}>
                  <div className="project-cover">
                    <span className="cover-name" aria-hidden>{coverName}</span>
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
          <span className="eyebrow"><span className="dot" /> 12 selected · 04 still in progress</span>
          <div className="cv-foot-cta">
            {/* Glass "Look here" pointer — draws the eye to the CV button */}
            <span className="cv-pointer" aria-hidden>
              <span className="cv-pointer-text">Look here</span>
              <span className="cv-pointer-arrow" />
            </span>
            <a
              href="/works/work-about.webp"
              onClick={(e) => {
                e.preventDefault();
                openWork({ work: '/works/work-about.webp', title: 'Read full CV', titleCn: '简历 / CV', category: 'CV' });
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
                <a className="pdf-lightbox-ext" href={active.work} target="_blank" rel="noreferrer">
                  新标签打开 ↗
                </a>
                <button className="pdf-lightbox-close" onClick={closePdf} aria-label="关闭">×</button>
              </div>
            </div>
            {(() => {
              const items = Array.isArray(active.work) ? active.work : [active.work];
              if (items.length === 1) {
                const src = items[0];
                return src.endsWith('.pdf') ? (
                  <iframe className="pdf-lightbox-frame" src={src} title={active.titleCn || active.title} />
                ) : (
                  <img className="pdf-lightbox-img" src={src} alt={active.titleCn || active.title} />
                );
              }
              return (
                <div className="pdf-lightbox-gallery">
                  {items.map((src, i) =>
                    src.endsWith('.pdf') ? (
                      <iframe key={i} className="pdf-lightbox-gallery-frame" src={src} title={`${active.titleCn || active.title} ${i + 1}`} />
                    ) : (
                      <img key={i} className="pdf-lightbox-gallery-img" src={src} alt={`${active.titleCn || active.title} ${i + 1}`} />
                    )
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
