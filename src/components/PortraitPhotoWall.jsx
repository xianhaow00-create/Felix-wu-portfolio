// PortraitPhotoWall — a magazine-style polaroid collage that *surrounds*
// the main editorial portrait in the About / PortraitStage section.
//
// Round 15 (moved here from Hero, where it was misplaced in Round 14):
// seven of Felix's personal photos (photo-1..7.webp) sit in cream
// paper cards at the corners and sides of the main subject photo —
// not a cluster below it. Each card is rotated, lifted, and overlaps
// the frame edge a little so the wall reads as a real photo collage
// hugging the portrait, not a separate stripe.
//
// The wall lives inside `.portrait-cluster` so it can position absolutely
// around `.portrait-frame`, and is `pointer-events: none` on the wrapper
// (with re-enable on each card) so it never steals hover/clicks from the
// frame or the bilingual corner words.
import './PortraitPhotoWall.css';

const PHOTOS = [
  { src: '/works/photos/photo-1.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-2.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-3.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-4.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-5.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-6.webp', alt: 'Felix · personal' },
  { src: '/works/photos/photo-7.webp', alt: 'Felix · personal' },
];

export function PortraitPhotoWall() {
  return (
    <div className="portrait-photo-wall" aria-label="A polaroid wall surrounding Felix's portrait">
      {PHOTOS.map((p, i) => (
        <figure key={p.src} className={`portrait-polaroid portrait-polaroid--${i + 1}`}>
          <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
      <span className="portrait-photo-wall-label serif-cn">碎片 · 2025–26</span>
    </div>
  );
}