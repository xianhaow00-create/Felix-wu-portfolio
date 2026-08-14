// EditorialMarquee — a second, larger editorial bilingual marquee that
// sits between Projects and PortfolioInterlude (the "red-box" space under
// the floating nav). Round 38 added this so the existing Marquee (the
// small one between Hero and About) is preserved, and the bigger editorial
// strip lives where the eye expects to pause.
//
// The content is a single Chinese ↔ English pair repeated: 从容 · Ascendant
// 崛起 · Evolving 蜕变 · Refined 淬炼 … The Chinese reads straight, the
// English sits in italic serif. The seam between sets is a brand-red dot.
//
// Animation matches the existing Marquee (translateX 0 → -50%, linear loop),
// but at a slower 56s tempo so the editorial weight reads. Hovering the
// track pauses the loop (lets visitors read without losing their place).
import './EditorialMarquee.css';

// A single repeat unit — duplicated to make a seamless loop.
// Round 39: added 淬炼 · Poised so the strip reads as a richer
// editorial effect (matches the reference image).
const UNIT = [
  { t: '从容',   kind: 'cn' },
  { t: '·',      kind: 'mark' },
  { t: 'Ascendant', kind: 'en' },
  { t: '崛起',   kind: 'cn' },
  { t: '·',      kind: 'mark' },
  { t: 'Evolving',  kind: 'en' },
  { t: '蜕变',   kind: 'cn' },
  { t: '·',      kind: 'mark' },
  { t: 'Refined',   kind: 'en' },
  { t: '淬炼',   kind: 'cn' },
  { t: '·',      kind: 'mark' },
  { t: 'Poised',    kind: 'en' },
];

export function EditorialMarquee() {
  // Two copies side by side so the keyframe -50% loop is seamless.
  const loop = [...UNIT, ...UNIT];
  return (
    <section className="editorial-marquee" aria-hidden>
      <div className="editorial-marquee-track">
        {loop.map((it, i) => (
          <span key={i} className={`em-item em-${it.kind}`}>
            {it.t}
          </span>
        ))}
      </div>
    </section>
  );
}
