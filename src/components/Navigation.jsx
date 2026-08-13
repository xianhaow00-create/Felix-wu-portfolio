// Top navigation — pill, floating, with quick contact CTA.
// Mobile: collapses to a hamburger sheet.
import { useEffect, useState } from 'react';
import { site } from '../data/site.js';
import { PhotoMark, Wordmark } from './LogoMark.jsx';
import './Navigation.css';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`} aria-label="Primary">
      <nav className={`nav ${scrolled ? 'nav--floated' : ''}`}>
        <a href="#top" className="nav-brand" aria-label="Felix Wu — Home">
          <PhotoMark src="/works/portrait-id.webp" size={32} />
          <Wordmark text="Felix Wu" cn="吴先浩" />
        </a>

        <ul className="nav-list">
          {site.nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="nav-link" data-cursor="hover">
                <span className="nav-link-en">{item.label}</span>
                <span className="nav-link-cn"> / {item.cn}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a href={`mailto:${site.contact.email}`} className="btn nav-cta" data-cursor="hover">
            <span>Let’s talk</span>
            <span className="arrow" aria-hidden>↗</span>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            data-cursor="hover"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={`nav-sheet ${open ? 'is-open' : ''}`}>
        {site.nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="nav-sheet-link"
            onClick={() => setOpen(false)}
          >
            {item.label} <span>{item.cn}</span>
          </a>
        ))}
        <a
          href={`mailto:${site.contact.email}`}
          className="btn nav-sheet-cta"
          onClick={() => setOpen(false)}
        >
          Let’s talk ↗
        </a>
      </div>
    </header>
  );
}
