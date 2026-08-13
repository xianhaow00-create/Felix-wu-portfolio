// Editorial portrait stage — Felix in motion, with bilingual English + 中文
// words scattered around the image (magazine-cover style). Each pair (Evolving /
// 蜕变, Refined / 淬炼, Poised / 从容, Ascendant / 崛起) sits in a corner of
// the layout, mixing italic serif, bold serif, and Noto Serif SC. Inspired by
// the Frame 3 / Project 9 reference.
//
// Round 15: a polaroid photo wall (PortraitPhotoWall) now *surrounds* the
// main subject photo — 7 cream paper cards at corners + sides, each rotated
// and overlapping the frame edge. The frame itself stays the hero of this
// scene; the wall hugs it.
import './PortraitStage.css';
import { PortraitPhotoWall } from './PortraitPhotoWall.jsx';

const WORDS = [
  { en: 'Evolving',  cn: '蜕变', style: 'italic', size: 'lg',  pos: 'tl', color: 'ink' },
  { en: 'Refined',   cn: '淬炼', style: 'roman',  size: 'xl',  pos: 'tr', color: 'ink' },
  { en: 'Poised',    cn: '从容', style: 'roman',  size: 'md',  pos: 'bl', color: 'ink' },
  { en: 'Ascendant', cn: '崛起', style: 'italic', size: 'lg',  pos: 'br', color: 'accent' },
];

export function PortraitStage() {
  return (
    <div className="portrait-stage reveal">
      {/* scattered bilingual words */}
      {WORDS.map(({ en, cn, style, size, pos, color }) => (
        <span
          key={en}
          className={`portrait-word portrait-word--${pos} portrait-word--${size} portrait-word--${style} portrait-word--${color}`}
        >
          <span className="portrait-word-en">{en}</span>
          <span className="portrait-word-cn serif-cn">{cn}</span>
        </span>
      ))}

      {/* portrait cluster — frame is centered, photo wall surrounds.
          The cluster is a positioning context with extra min-height so
          polaroids can peek above and below the frame without clipping. */}
      <div className="portrait-cluster">
        <div className="portrait-frame">
          <img
            src="/works/portrait-editorial.webp"
            alt="Felix Wu — a portrait in motion"
            width={780}
            height={580}
            loading="lazy"
            decoding="async"
          />
          <span className="portrait-mark serif-cn">Wu.F</span>
          <span className="portrait-stamp">PORTRAIT · 2026</span>
          <span className="portrait-cornermark">©</span>
        </div>
        <PortraitPhotoWall />
      </div>

      {/* small caption strip */}
      <div className="portrait-caption">
        <span className="eyebrow"><span className="dot" /> Felix Wu · 吴先浩</span>
        <span className="portrait-caption-quote serif-cn">
          记得，你终将死去。
        </span>
      </div>
    </div>
  );
}