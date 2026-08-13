// Marquee — a thin line between hero and about, with both filled and outlined text
import './Marquee.css';

const ITEMS = [
  'Visual Design',
  '·',
  'Brand Identity',
  '·',
  'Packaging',
  '·',
  'IP Character',
  '·',
  'Editorial',
  '·',
  'AI Visual',
  '·',
  'Motion',
];

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section className="marquee-section" aria-hidden>
      <div className="marquee-track">
        {loop.map((it, i) => (
          <span key={i} className={`marquee-item ${it === '·' ? 'is-mark' : ''}`}>
            {it}
          </span>
        ))}
      </div>
    </section>
  );
}
