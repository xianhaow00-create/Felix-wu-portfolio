// Hero — fullscreen flower bloom + dissolve animation as background,
// with restrained typography on top. The Bloom canvas is the piece
// (self-composed, looping every 16s); we float the FlowerStage on the
// right for warmth and a touch of playfulness.
import { site } from '../data/site.js';
import { HeroVideo } from './HeroVideo.jsx';
import { BloomText } from './BloomText.jsx';
import { FlowerStage } from './FlowerStage.jsx';
import './Hero.css';

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-bg">
        <HeroVideo />
        {/* Hero-veil sits BELOW BloomText in source order so the cream
            scrim doesn't mute the Chinese value phrases. BloomText is the
            second-to-top layer; only the grain (4% noise) sits above. */}
        <div className="hero-veil" />
        <BloomText />
        <div className="hero-grain" />
      </div>

      {/* Foreground frame */}
      <div className="wrap hero-frame">
        <div className="hero-row hero-row--top">
          {/* Top-left intentionally empty — brand mark is in the floating Navigation */}

          <div className="hero-meta">
            <span className="hero-meta-line"><span className="dot" /> Available for hire · 2026</span>
            <span className="hero-meta-line"><span className="hero-meta-sep">|</span> Based in Guangzhou</span>
          </div>
        </div>

        <div className="hero-row hero-row--mid">
          <div className="hero-text">
            <span className="eyebrow eyebrow--ink reveal" data-delay="1">
              <span className="dot" /> {site.hero.kicker}
            </span>

            <h1 className="hero-title reveal" data-delay="2">
              <span className="title-line"><span>Refined</span></span>
              <span className="title-line"><span>Visual</span></span>
              <span className="title-line"><span><em>Stories.</em></span></span>
            </h1>

            <p className="hero-sub reveal" data-delay="3">
              {site.hero.subtitle}
            </p>

            <div className="hero-cta-row reveal" data-delay="4">
              <a href="#work" className="btn" data-cursor="hover">
                <span>Explore work</span>
                <span className="arrow">↓</span>
              </a>
              <a href="#contact" className="btn btn-ghost" data-cursor="hover">
                <span>Get in touch</span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          {/* Right-side: small flower stage only — rails moved out to a
              dedicated right-margin strip (see .hero-rails below) so they
              never collide with the pills row or the corner stamps. */}
          <aside className="hero-side">
            <FlowerStage />
          </aside>
        </div>

        {/* Right-margin designation strip — sits clear of the pills row
            and the corner stamps because it's vertically centered. */}
        <div className="hero-rails" aria-hidden>
          <span>Visual Designer</span>
          <span>Brand Designer</span>
          <span>AI Designer</span>
        </div>

        <div className="hero-row hero-row--bottom">
          <div className="hero-scroll">
            <span className="hero-scroll-line"><span /></span>
            <span className="hero-scroll-label">Scroll</span>
          </div>

          <div className="hero-tags">
            {['Brand', 'Packaging', 'IP', 'Editorial', 'Motion'].map((t) => (
              <span className="pill" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-corner hero-corner--bl">
          <span>© 2026</span>
          <span>FELIX WU</span>
        </div>
      </div>
    </section>
  );
}