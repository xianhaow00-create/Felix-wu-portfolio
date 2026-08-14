// HeroVideo — the AI-generated particle-flower clip kept as the hero's
// visual centre, recoloured via CSS so it reads as art rather than raw
// footage. Two cursor effects stack on top of the dim base clip:
//   1) CursorMask — a true Lithos reveal: a brighter "second copy" of the
//      clip shows through a soft circular hole that follows the cursor, so
//      where the mouse goes, a more vivid "second image" blooms through.
//   2) CursorBloom — a canvas that starts empty and spawns small luminous
//      flowers + sparkle particles along the cursor's path (the "鼠标移到
//      哪里哪里有花" feel).
// Plus a mouse-interactive water-ripple overlay. The clip file itself is
// left untouched; all art direction is in-page.
import { useEffect, useRef } from 'react';
import { CursorAperture } from './CursorAperture.jsx';
import { CursorBloom } from './CursorBloom.jsx';
import './HeroVideo.css';

function RippleOverlay() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let mouseX = -999, mouseY = -999;
    let lastMouseSpawn = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse → ripple at cursor (the interactive bit).
    // Listen on window (the ripple canvas sits below the text layer) and
    // only spawn when the cursor is within the hero bounds.
    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) return; // outside hero
      const now = performance.now();
      if (now - lastMouseSpawn > 140) {
        lastMouseSpawn = now;
        ripples.push({
          x, y, r: 0,
          maxR: 70 + Math.random() * 60,
          life: 1,
          mouse: true
        });
      }
      mouseX = x; mouseY = y;
    }
    window.addEventListener('mousemove', onMove);

    const ripples = [];
    let last = 0;

    function spawnAmbient() {
      ripples.push({
        x: w * (0.4 + Math.random() * 0.55),
        y: h * (0.2 + Math.random() * 0.6),
        r: 0,
        maxR: 90 + Math.random() * 180,
        life: 1,
        mouse: false
      });
    }

    function frame(ts) {
      ctx.clearRect(0, 0, w, h);
      // ambient ripples keep the surface alive even when idle
      if (ts - last > 2300 && ripples.length < 7) {
        spawnAmbient();
        last = ts;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.mouse ? 0.85 : 0.55;
        rp.life -= rp.mouse ? 0.006 : 0.0045;
        if (rp.life <= 0 || rp.r > rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }
        const a = Math.sin(rp.life * Math.PI) * (rp.mouse ? 0.16 : 0.11);
        const col = rp.mouse ? 'rgba(255, 210, 150,' : 'rgba(255, 90, 60,';
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = col + a + ')';
        ctx.lineWidth = rp.mouse ? 1.2 : 1;
        ctx.stroke();
        // faint inner echo
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.78, 0, Math.PI * 2);
        ctx.strokeStyle = col + (a * 0.5) + ')';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="hero-video-ripple" aria-hidden />;
}

export function HeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Honour reduced-motion: don't auto-animate. The poster frame stays
      // visible as a static, on-brand hero image.
      v.pause();
    }
    // Normal motion: the <video autoPlay> attribute drives playback. We keep
    // this simple and robust — NO programmatic currentTime seek. A seek set in
    // Round 26 risked interrupting autoplay so the clip froze on a dark frame
    // (the "hero video gone" report). The poster image covers the brief
    // decode/buffer flash and makes the opening frame deterministic across
    // refreshes without touching playback.
  }, []);

  return (
    <div className="hero-video">
      <video
        ref={videoRef}
        className="hero-video-el"
        src="/media/hero/hero-flower.mp4"
        poster="/media/hero/hero-flower-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* recolour wash — shifts the flower's hue so it reads as art, not raw clip */}
      <div className="hero-video-tint" aria-hidden />
      <div className="hero-video-grade" aria-hidden />
      {/* warm centre "pop" — lifts the flower centre for a more vivid read */}
      <div className="hero-video-pop" aria-hidden />
      {/* CursorMask removed in Round 40 — the user asked to drop the
          irregular (Lithos ink-mask) follow style in favour of a clean
          soft gradient circle cursor + red fluid dispersion. */}
      {/* Round 41: CursorAperture replaces the previous flat reveal
          with a LAYERED "soft light round aperture" — a brighter
          second copy of the clip is masked by a radial gradient
          (per spec: 0→1, 0.4→1, 0.6→0.75, 0.75→0.4, 0.88→0.12,
          1→0, 232 px outer halo + a tighter 110 px inner core for
          depth). The hole follows the cursor; defaults to the hero
          visual centre so the centre of the screen is always a bit
          brighter. */}
      <CursorAperture />
      {/* CursorBloom — red fluid dispersion along the cursor's path
          (initially empty canvas, screen-blended for a luminous glow). */}
      <CursorBloom />
      <RippleOverlay />
    </div>
  );
}
