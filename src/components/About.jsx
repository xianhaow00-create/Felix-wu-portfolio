// About — large editorial layout with portrait, intro, and a quiet fact sheet
import { site } from '../data/site.js';
import { PortraitStage } from './PortraitStage.jsx';
import './About.css';

export function About() {
  return (
    <section id="about" className="section about">
      <div className="wrap">
        <header className="about-head reveal">
          <span className="eyebrow"><span className="dot" /> About · 关于我</span>
          <div className="about-head-row">
            <h2 className="about-title">
              <span className="title-line"><span>Design is stripping</span></span>
              <span className="title-line"><span>away the <em>unnecessary</em> —</span></span>
              <span className="title-line"><span>and getting to the essence.</span></span>
            </h2>
            {/* Round 42: the CN manifesto split across two lines. The
                SECOND line ("设计是剥离多余…") stays here as a quiet
                decorative typography block under the big title — its
                design is unchanged from Round 39. The FIRST line
                ("水是血脉…") was relocated to the Skills section. */}
          </div>
        </header>

        {/* Round 39/42: the second-line motto reused as a small
            decorative typography block below the title — small, italic,
            muted, so it reads as ornament rather than a competing
            paragraph. */}
        <p className="about-deco-cn serif-cn reveal">
          设计是剥离多余，直抵事物本质。
        </p>

        {/* Editorial portrait stage — replaces the old portrait frame */}
        <PortraitStage />

        <div className="about-grid">
          <aside className="about-portrait-caption-stack reveal" data-delay="1">
            <span className="serif-cn about-portrait-name">吴先浩 · Felix Wu</span>
            <span className="about-portrait-meta">Visual Designer · 视觉设计师</span>
            <span className="about-portrait-meta">AI Designer · 品牌设计师</span>
          </aside>

          <div className="about-main">
            <p className="about-bio reveal" data-delay="2">
              {site.about.intro}
            </p>

            <div className="about-facts reveal" data-delay="3">
              <h3 className="about-h3">Quick facts <span className="serif-cn">/ 基本</span></h3>
              <dl className="about-facts-list">
                {site.about.right.map((f) => (
                  <div key={f.label} className="about-fact">
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="about-interests reveal" data-delay="4">
              <h3 className="about-h3">Right now I am… <span className="serif-cn">/ 此刻的我</span></h3>
              <ul>
                {site.about.interests.map(([k, v]) => (
                  <li key={k}>
                    <span className="about-interests-k">{k}</span>
                    <span className="about-interests-v">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-stats reveal" data-delay="5">
              {site.about.stats.map((s) => (
                <div key={s.label} className="about-stat">
                  <div className="about-stat-num">{s.num}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}