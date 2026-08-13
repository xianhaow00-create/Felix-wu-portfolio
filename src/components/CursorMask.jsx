// CursorMask — true Lithos-style cursor-following reveal (Round 18→19:
// re-added and refined after the flower-only phase).
//
// The hero shows the dim, crimson-recoloured flower clip as its base.
// This component floats a SECOND, brighter / warmer / more vivid copy of
// the same clip in a reveal layer, and clips it with a soft mask that
// follows the cursor. Where the cursor goes, the vivid "second image"
// shows through the hole — exactly the Lithos cursor-spotlight mechanic.
//
// Round 30: the mask is no longer a standard circle. It is now an irregular
// INK-WASH (水墨) blob — a radial gradient (deep, opaque centre → light,
// transparent edge: 从中心到外围，深到浅) distorted by an feTurbulence +
// feDisplacementMap filter so the edge reads like ink blooming on paper.
// See inkMask.js. The blob is a static SVG; we only translate it via
// mask-position each frame (cheaper than re-writing maskImage), and we
// skip the write when the cursor barely moved (MASK_EPS) so idle frames
// don't repaint. RAF pauses when the tab is hidden.
//
// Refinements this round (user feedback):
//   - RADIUS smaller (140 → 120) — the ink hole reads as a focused beam.
//   - Irregular, organic edge instead of a hard circle.
//   - Easing kept at lerp 0.12 (the follow feel the user liked).
//   - Default rests at the hero centre, eases toward the cursor on move,
//     relaxes back to centre on leave.
import { useEffect, useRef } from 'react';
import './CursorMask.css';
import { inkMaskURL, inkTileSize } from './inkMask';

const R = 120;            // ink-blob nominal radius (CSS px) — smaller than the
                          // old 140 circle; reads as a focused, organic beam
                          // rather than a wide spotlight so the hero typography
                          // stays the lead.
const EASE = 0.12;        // cursor easing per frame (0..1)
const MASK_EPS = 0.5;     // px — skip mask-position write if smooth barely moved

export function CursorMask() {
  const revealRef = useRef(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const tile = inkTileSize(R);
    const blob = inkMaskURL(R);
    // Static mask: the ink blob, sized to its tile, no repeat. We move it via
    // mask-position each frame (cheaper than re-writing maskImage).
    el.style.webkitMaskImage = blob;
    el.style.maskImage = blob;
    el.style.webkitMaskSize = `${tile}px ${tile}px`;
    el.style.maskSize = `${tile}px ${tile}px`;
    el.style.webkitMaskRepeat = 'no-repeat';
    el.style.maskRepeat = 'no-repeat';

    // Smoothed + target positions, in CSS px relative to the element box.
    // Default to the hero centre (slightly above middle, where the face is).
    let smooth = { x: el.clientWidth / 2, y: el.clientHeight * 0.44 };
    let target = { x: smooth.x, y: smooth.y };
    // Last position we actually wrote a mask for — used to skip redundant
    // mask-position updates (each one forces a layer compositing repaint).
    let lastApplied = { x: NaN, y: NaN };
    let raf = 0;

    function applyPos(x, y) {
      if (
        Math.abs(x - lastApplied.x) < MASK_EPS &&
        Math.abs(y - lastApplied.y) < MASK_EPS
      ) return;                                // no visible movement → skip
      lastApplied.x = x;
      lastApplied.y = y;
      const px = `${x - tile / 2}px`;
      const py = `${y - tile / 2}px`;
      el.style.webkitMaskPosition = `${px} ${py}`;
      el.style.maskPosition = `${px} ${py}`;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Static centre reveal for reduced-motion users.
      applyPos(smooth.x, smooth.y);
      return;
    }

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Round 26: when the cursor leaves the hero bounds, ease the target
      // back to the centre (instead of freezing at the last inside position).
      // Refresh-while-cursor-outside keeps the reveal at the hero centre,
      // matching the welcome bloom — opening state is stable.
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        target.x = rect.width / 2;
        target.y = rect.height * 0.44;
        return;
      }
      target.x = x;
      target.y = y;
    }
    window.addEventListener('mousemove', onMove, { passive: true });

    function frame() {
      smooth.x += (target.x - smooth.x) * EASE;
      smooth.y += (target.y - smooth.y) * EASE;
      applyPos(smooth.x, smooth.y);
      raf = requestAnimationFrame(frame);
    }
    applyPos(smooth.x, smooth.y);
    raf = requestAnimationFrame(frame);

    // Pause RAF when the tab is hidden — no point running the easing /
    // mask loop when the user can't see it. Big battery + frame budget win.
    function onVisibility() {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      el.style.webkitMaskImage = '';
      el.style.maskImage = '';
    };
  }, []);

  return (
    <div className="hero-video-reveal" ref={revealRef} aria-hidden>
      <video
        className="hero-video-reveal-el"
        src="/media/hero/hero-flower.mp4"
        poster="/media/hero/hero-flower-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
