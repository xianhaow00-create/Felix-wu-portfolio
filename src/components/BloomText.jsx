// BloomText — the four floating value phrases over the hero.
//
// The greeting was removed in Round 21 at the user's request. The four
// value phrases drift in/out on a staggered 24s schedule, each holding its
// own position (tr / ml / mr / bc) so they layer cleanly over the dark
// crimson bloom.
import './BloomText.css';

const PHRASES = [
  { en: 'RESULT-DRIVEN', cn: '結果導向',        delay: 0,    pos: 'tr' },
  { en: 'EXECUTION',     cn: '執行能力強',       delay: 4.5,  pos: 'ml' },
  { en: 'CLOSED-LOOP',   cn: '強內驅力與閉環意識', delay: 9,    pos: 'mr' },
  { en: 'LEARNING',      cn: '持續學習',         delay: 13.5, pos: 'bc' },
];

export function BloomText() {
  return (
    <div className="bloom-text" aria-hidden>
      {PHRASES.map((p, i) => (
        <div
          key={i}
          className={`bloom-text-item bloom-text-item--${p.pos}`}
          style={{ animationDelay: `${p.delay}s` }}
        >
          <span className="bloom-text-en">{p.en}</span>
          <span className="bloom-text-cn">{p.cn}</span>
        </div>
      ))}
    </div>
  );
}
