// Skills — two-zone section.
// Top: capability cards (brand, editorial, motion, AI, spatial, e-commerce)
// Bottom: tools proficiency + a humble awards list
import { site } from '../data/site.js';
import './Skills.css';

export function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="wrap">
        <header className="skills-head reveal">
          <span className="eyebrow"><span className="dot" /> Capabilities · 个人优势</span>
          <h2 className="skills-title">
            <span className="title-line"><span>What I do,</span></span>
            <span className="title-line"><span>honestly.</span></span>
          </h2>
          <p className="skills-intro">
            Six hands-on capability zones — brand, editorial, motion, AI, spatial, e-commerce.
            I’m strongest in identity & packaging, and most curious at the AI × craft seam.
          </p>
        </header>

        <div className="skill-grid">
          {site.skills.map((s, i) => (
            <article
              key={s.title}
              className={`skill-card reveal`}
              data-delay={(i % 4) + 1}
              data-cursor="hover"
            >
              <div className="skill-card-head">
                <span className="skill-card-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="skill-card-cn serif-cn">{s.cn}</span>
              </div>
              <h3 className="skill-card-title">{s.title}</h3>
              <p className="skill-card-desc">{s.desc}</p>
              <ul className="skill-card-tags">
                {s.tags.map((t) => (
                  <li key={t} className="pill">{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="skills-tools reveal">
          <div className="skills-tools-head">
            <h3 className="about-h3">Tools I live in <span className="serif-cn">/ 工具</span></h3>
            <span className="eyebrow">self-rated · not a benchmark</span>
          </div>
          <ul className="skills-tools-list">
            {site.tools.map((t) => (
              <li key={t.name}>
                <span className="skills-tools-name">{t.name}</span>
                <span className="skills-tools-bar">
                  <span style={{ width: `${t.level}%` }} />
                </span>
                <span className="skills-tools-pct">{t.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="skills-honors reveal">
          <div className="skills-honors-head">
            <h3 className="about-h3">Honors · Awards <span className="serif-cn">/ 奖项</span></h3>
            <a
              href="/projects/Home.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              data-cursor="hover"
            >
              <span>Full CV</span>
              <span className="arrow">↗</span>
            </a>
          </div>
          <div className="skills-honors-grid">
            {site.honors.map((h, i) => (
              <article key={h.title} className="honor-card">
                <span className="honor-num">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="honor-title">{h.title}</h4>
                <span className="honor-cn serif-cn">{h.cn}</span>
                <div className="honor-foot">
                  <span className="honor-award">{h.award}</span>
                  <span className="honor-year">{h.year}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
