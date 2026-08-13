// Experience — a horizontal timeline of internships and roles
import { site } from '../data/site.js';
import './Experience.css';

export function Experience() {
  return (
    <section className="section experience">
      <div className="wrap">
        <header className="exp-head reveal">
          <span className="eyebrow"><span className="dot" /> Experience · 工作 / 实习</span>
          <h2 className="exp-title serif-cn">
            从课堂到品牌部，<em>三条线</em> 在 <em>三个城市</em> 平行地编织着。
          </h2>
        </header>

        <ol className="exp-timeline">
          {site.experiences.map((e, i) => (
            <li key={e.org} className="exp-item reveal" data-delay={(i % 4) + 1}>
              <div className="exp-marker">
                <span className="exp-marker-dot" />
                <span className="exp-marker-line" />
              </div>
              <div className="exp-card">
                <div className="exp-card-row">
                  <div className="exp-period">{e.period}</div>
                  <span className="exp-num">{String(i + 1).padStart(2, '0')} / {String(site.experiences.length).padStart(2, '0')}</span>
                </div>
                <h3 className="exp-org">{e.org}</h3>
                <div className="exp-role-line">
                  <span className="exp-role">{e.role}</span>
                  <span className="exp-cn serif-cn">{e.cn}</span>
                </div>
                <ul className="exp-bullets">
                  {e.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
