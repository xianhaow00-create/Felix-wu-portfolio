// PortfolioInterlude — editorial break between Projects and Experience.
// Replaces the previous image-only "small card" style with a single
// composed piece: Felix's portrait paired with bilingual verse — a
// moment of breath before the experience / skills chapters.
//
// Round 14: added a 水墨晕染 (water-ink wash) SVG behind the content
// so the empty cream space reads as ink diffusing into paper instead
// of just whitespace. Atmospheric, never competes with the verse.
import './PortfolioInterlude.css';

export function PortfolioInterlude() {
  return (
    <section id="interlude" className="section interlude reveal">
      {/* Water-ink wash — organic blobs that bloom and fade. Sits behind
          the content; reduced-motion users get a static trace. */}
      <svg
        className="ink-wash"
        viewBox="0 0 1400 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Turbulence + displacement gives the circles irregular, hand-
              brushed ink edges; a soft gaussian blur feathers the rim. */}
          <filter id="inkBleed" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="3" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="62" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <radialGradient id="inkFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#1a1a18" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#1a1a18" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#1a1a18" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#inkBleed)">
          {/* Top-left, near the portrait */}
          <circle className="ink-blob ink-blob--1" cx="140"  cy="110" r="78" fill="url(#inkFade)" />
          {/* Right-top, in the empty margin above the verse */}
          <circle className="ink-blob ink-blob--2" cx="1180" cy="180" r="92" fill="url(#inkFade)" />
          {/* Mid-bottom, filling the void before the stamp */}
          <circle className="ink-blob ink-blob--3" cx="640"  cy="560" r="86" fill="url(#inkFade)" />
          {/* Far-right, the breathing margin beside the verse */}
          <circle className="ink-blob ink-blob--4" cx="1310" cy="490" r="70" fill="url(#inkFade)" />
        </g>
      </svg>

      <div className="wrap interlude-frame">
        <figure className="interlude-figure">
          <img
            src="/works/portrait-editorial.webp"
            alt="Felix Wu — portrait study"
            width="640"
            height="840"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="interlude-cap">
            <span>Felix Wu · 吴先浩</span>
            <span>Self-composed · 2026</span>
          </figcaption>
        </figure>

        <div className="interlude-text">
          <span className="eyebrow eyebrow--accent">
            <span className="dot" /> A moment between projects · 项目之间
          </span>

          <p className="interlude-verse interlude-verse--en">
            <em>Evolving</em>, refined,<br />
            poised, <em>ascendant</em> —<br />
            every project a quiet<br />
            promise kept to the work.
          </p>

          <p className="interlude-verse interlude-verse--cn serif-cn">
            演变，<em>精雕</em>，沉着，向上——<br />
            每件作品，<br />
            都是对匠心许下的一句承诺。
          </p>

          <div className="interlude-stamp">
            <span className="interlude-stamp-mark" aria-hidden>Felix Wu</span>
            <span className="interlude-stamp-label">
              Visual · Brand · AI Designer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}