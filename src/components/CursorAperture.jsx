// CursorAperture — Round 43 "soft light round aperture" reveal.
//
// Round 42 used mask-size: 232px 232px + mask-repeat: no-repeat. Outside
// that 232 px box the browser treated the mask as "not applied", which
// meant the entire video overlay was visible as a big rectangle, not a
// 232 px circle. Round 43 fixes this by making the mask cover the FULL
// element (mask-size: 100% 100%) and defining the circle inside the
// gradient itself via CSS variables (--mx, --my). The circle is now the
// only visible portion of the overlay at any time — outside the circle
// alpha is 0 so the overlay is invisible.
//
// Behaviour:
//   - opacity 0 by default; fades in via .has-cursor only while the
//     cursor is over the hero, then tracks the cursor.
//   - Reduced-motion: no auto-tracking; the overlay stays hidden.
//
// CSS variables (--mx, --my) are in pixels relative to the wrap element
// and default to 50% / 44% (hero visual centre).
import { useEffect, useRef } from 'react';
import './CursorAperture.css';

const EASE = 0.18;             // smoothed-cursor lag (matches Cursor.jsx)
const RADIUS = 116;            // half of the 232 px aperture diameter

export function CursorAperture() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rect = wrap.getBoundingClientRect();
    // Default centre — matches the hero visual centre (same as CursorBloom).
    let cx = rect.width  * 0.5;
    let cy = rect.height * 0.44;
    let tx = cx;
    let ty = cy;
    let raf = 0;
    let active = false;

    function setMaskPos(x, y) {
      // mask-image is a 100% x 100% radial-gradient(circle 116px at
      // var(--mx) var(--my)). Setting --mx / --my in pixels moves the
      // circle to (x, y) within the element. Outside the circle the
      // gradient is transparent so the overlay is invisible — no more
      // "rectangle leak".
      wrap.style.setProperty('--mx', `${x}px`);
      wrap.style.setProperty('--my', `${y}px`);
    }
    setMaskPos(cx, cy);

    if (reduce) return;

    function onMove(e) {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        if (active) {
          active = false;
          wrap.classList.remove('has-cursor');
        }
        return;
      }
      tx = x;
      ty = y;
      if (!active) {
        // Snap the mask to the cursor on first entry so the reveal
        // fades in at the cursor position (not at the centre).
        cx = x; cy = y;
        active = true;
        wrap.classList.add('has-cursor');
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true });

    function frame() {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      setMaskPos(cx, cy);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hero-cursor-aperture"
      aria-hidden
    >
      <video
        className="hero-cursor-aperture-vid"
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