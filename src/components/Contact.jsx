// Contact — full screen closing page with massive type and side rails
import { site } from '../data/site.js';
import './Contact.css';

const SIDE_RAILS = ['Brand', 'Packaging', 'IP', 'Editorial', 'Motion', 'AI'];

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="wrap contact-wrap">
        <div className="contact-side contact-side--left reveal">
          {SIDE_RAILS.map((r, i) => (
            <span key={r} className={`contact-rail ${i === 0 ? 'is-active' : ''}`}>{r}</span>
          ))}
        </div>

        <div className="contact-center">
          <span className="eyebrow contact-eyebrow">
            <span className="dot" />
            Let’s make something — together.
          </span>

          <a
            href={`mailto:${site.contact.email}`}
            className="contact-mailto reveal"
            data-delay="1"
            data-cursor="hover"
          >
            <span className="title-line"><span>Say hello</span></span>
            <span className="title-line"><span>at <em>{site.contact.email}</em></span></span>
          </a>

          <div className="contact-grid reveal" data-delay="2">
            <div>
              <span className="eyebrow">Phone / 电话</span>
              <a href={`tel:${site.contact.phone.replace(/\s+/g, '')}`} className="contact-line">
                {site.contact.phone}
              </a>
            </div>
            <div>
              <span className="eyebrow">Studio / 学校</span>
              <span className="contact-line">{site.contact.school}</span>
              <span className="contact-line-sub">{site.contact.major}</span>
            </div>
            <div>
              <span className="eyebrow">Based in</span>
              <span className="contact-line">{site.contact.location}</span>
            </div>
          </div>

          <div className="contact-actions reveal" data-delay="3">
            {site.contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="btn btn-ghost"
                data-cursor="hover"
              >
                <span>{s.label}</span>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-side contact-side--right reveal">
          {site.nav.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} className="contact-rail">
              <span>{String(i + 1).padStart(2, '0')}</span> {n.label}
            </a>
          ))}
        </div>
      </div>

      <div className="contact-foot reveal">
        <span className="contact-foot-line">© 2026 FELIX WU · ALL RIGHTS RESERVED</span>
        <span className="contact-foot-line serif-cn">设计是一件让自己诚实的事。</span>
        <span className="contact-foot-line">Made with care in Guangzhou</span>
      </div>
    </section>
  );
}
