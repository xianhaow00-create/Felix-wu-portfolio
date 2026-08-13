// Bloom — a self-composed flower bloom + dissolve animation rendered as a
// fullscreen Canvas. Replaces the prior hero background video with a piece
// that is uniquely Felix's:
//   • real petal silhouettes (bezier teardrops, not blurry circles)
//   • a bright pulsing core that breathes at the flower's centre
//   • a continuous pollen layer drifting up & outward (always on)
//   • stamens glow at the centre as a warm halo
//
// 24s loop:
//   0–5s   bloom     petals emerge from a centre, scale up
//   5–10s  hold      gentle sway, like a real flower in still air
//  10–18s  dissolve  petals drift outward, slowly fade
//  18–23s  settle    petals pull back toward the centre, calm
//  23–24s  transition petals regrow for seamless loop
//
// Independent of the loop, a continuous pollen layer emits from the
// flower's centre — always-on, no reset, ~200 particles at peak.
import { useEffect, useRef } from 'react';
import './Bloom.css';

const PETAL_RINGS = [
  { count: 28, radius: 0.30, sizeMin: 22, sizeMax: 38 },   // inner
  { count: 36, radius: 0.52, sizeMin: 28, sizeMax: 48 },   // mid
  { count: 22, radius: 0.72, sizeMin: 34, sizeMax: 58 },   // outer
];
const STAMEN_COUNT = 56;
const POLLEN_MAX = 380;
const LOOP_MS = 24000;

// Petal palette — warm pinks/peaches/coral (sampled from flower source)
const PETAL_COLORS = [
  '#f5a6b8', '#f6c6a8', '#e89898', '#d8b4cc',
  '#f0d4b4', '#e8c4d8', '#c89ca0', '#f8d8d4',
];
// Pollen palette — cream + Felix's red accent + cool accents
const POLLEN_COLORS = ['#fff8ee', '#ffd9c0', '#e8a4a0', '#a3b3c8', '#ffb4a0'];

function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const smoothstep = (t) => t * t * (3 - 2 * t);

// Real petal silhouette — bezier teardrop, drawn at origin
function drawPetal(ctx, size, color) {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(
    size * 0.6, -size * 0.3,
    size * 0.7, size * 0.55,
    0, size * 0.8
  );
  ctx.bezierCurveTo(
    -size * 0.7, size * 0.55,
    -size * 0.6, -size * 0.3,
    0, -size
  );
  ctx.closePath();
  const g = ctx.createRadialGradient(0, size * 0.1, 0, 0, 0, size * 1.05);
  g.addColorStop(0, color);
  g.addColorStop(0.55, color);
  g.addColorStop(1, 'rgba(245, 240, 230, 0)');
  ctx.fillStyle = g;
  ctx.fill();
}

export function Bloom() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = 1;
    let petals = [];
    let stamens = [];
    let pollen = [];

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const r = rng(Math.floor(w * 31 + h * 17) || 1);
      const baseR = Math.min(w, h) * 0.42;

      petals = [];
      PETAL_RINGS.forEach((ring) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2 + (r() - 0.5) * 0.18;
          const radius = ring.radius * baseR;
          petals.push({
            tx: w / 2 + Math.cos(angle) * radius,
            ty: h / 2 + Math.sin(angle) * radius * 0.86,
            ox: w / 2 + (r() - 0.5) * 6,
            oy: h / 2 + (r() - 0.5) * 6,
            dx: Math.cos(angle),
            dy: Math.sin(angle) * 0.86,
            size: ring.sizeMin + r() * (ring.sizeMax - ring.sizeMin),
            rot: r() * Math.PI * 2,
            rotSpd: (r() - 0.5) * 0.45,
            color: PETAL_COLORS[Math.floor(r() * PETAL_COLORS.length)],
            phase: r() * 0.2,
          });
        }
      });

      stamens = Array.from({ length: STAMEN_COUNT }, () => {
        const angle = r() * Math.PI * 2;
        const radius = r() * baseR * 0.18;
        return {
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius,
          ox: w / 2,
          oy: h / 2,
          size: 1.8 + r() * 2.8,
          phase: r(),
        };
      });

      pollen = [];
    };

    setup();
    window.addEventListener('resize', setup);

    let raf = 0;
    let lastPollen = 0;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = (now - start) % LOOP_MS;
      const t = elapsed / 1000;

      // ── Backdrop ─────────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#ede4d6');
      bg.addColorStop(0.55, '#f3ebde');
      bg.addColorStop(1, '#f8f4ec');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // slight motion trail for smoothness
      ctx.fillStyle = 'rgba(243, 235, 222, 0.06)';
      ctx.fillRect(0, 0, w, h);

      // ── Centre: subtle dark vignette for drama + warm halo glow ──
      const haloPulse = 0.85 + Math.sin(t * 0.7) * 0.15;

      // dark vignette (soft) — gives the bloom dramatic contrast like the
      // black void in the reference, but stays subtle on cream
      const vignette = ctx.createRadialGradient(
        w / 2, h / 2, 0,
        w / 2, h / 2, Math.min(w, h) * 0.42
      );
      vignette.addColorStop(0, 'rgba(30, 22, 28, 0.28)');
      vignette.addColorStop(0.5, 'rgba(30, 22, 28, 0.14)');
      vignette.addColorStop(1, 'rgba(30, 22, 28, 0)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // warm halo on top of the vignette
      const halo = ctx.createRadialGradient(
        w / 2, h / 2, 0,
        w / 2, h / 2, Math.min(w, h) * 0.5
      );
      halo.addColorStop(0, `rgba(255, 220, 200, ${0.4 * haloPulse})`);
      halo.addColorStop(0.4, `rgba(255, 200, 180, ${0.18 * haloPulse})`);
      halo.addColorStop(1, 'rgba(255, 200, 180, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // ── Water ripple scroll — full-canvas horizontal sine waves ─────
      // Elegant "water surface" texture: 6 layered sine lines scrolling
      // horizontally (seamless via sin periodicity), gentle vertical
      // bobbing, warm ink on cream, crest highlights on alternating
      // bands, plus a slow luminous caustic wash scrolling across. Subtle
      // so the flower and editorial text remain the focus.
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const yBase = (0.12 + i * 0.155) * h + Math.sin(t * 0.25 + i * 1.7) * 4;
        const amp = 4 + (i % 3) * 2.5;
        const k = 0.009 + (i % 4) * 0.0035;
        const speed = (10 + i * 1.6) * (i % 2 === 0 ? 1 : -1);
        const phase = i * 1.13 + t * 0.35;
        const yNorm = Math.min(1, Math.max(0, yBase / h));
        const a = (0.135 + Math.sin(t * 0.4 + i * 0.9) * 0.03) * (0.55 + 0.45 * yNorm);
        // main stroke — warm ink
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(112, 86, 66, ${a})`;
        ctx.beginPath();
        for (let x = -8; x <= w + 8; x += 4) {
          const yy = yBase + amp * Math.sin(k * (x - speed * t) + phase);
          if (x === -8) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
        // crest highlight on alternating bands — thinner, warmer
        if (i % 2 === 0) {
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = `rgba(255, 220, 190, ${a * 0.9})`;
          ctx.beginPath();
          for (let x = -8; x <= w + 8; x += 4) {
            const yy = yBase + amp * Math.sin(k * (x - speed * t) + phase) - 1.2;
            if (x === -8) ctx.moveTo(x, yy);
            else ctx.lineTo(x, yy);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // Slow horizontal caustic wash — warm luminous band scrolling across
      {
        const washW = 520;
        const washSpan = w + washW * 2;
        const washX = ((t * 26) % washSpan) - washW;
        const wash = ctx.createLinearGradient(washX - washW / 2, 0, washX + washW / 2, 0);
        wash.addColorStop(0,   'rgba(255, 228, 198, 0)');
        wash.addColorStop(0.5, 'rgba(255, 228, 198, 0.14)');
        wash.addColorStop(1,   'rgba(255, 228, 198, 0)');
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Phase ────────────────────────────────────────────────
      let phase, phaseT;
      if (t < 5)        { phase = 'bloom';    phaseT = t / 5; }
      else if (t < 10)   { phase = 'hold';     phaseT = (t - 5) / 5; }
      else if (t < 18)   { phase = 'dissolve'; phaseT = (t - 10) / 8; }
      else if (t < 23)   { phase = 'settle';   phaseT = (t - 18) / 5; }
      else               { phase = 'reset';    phaseT = (t - 23) / 1; }

      // ── Petals (additive — overlapping petals glow brighter) ─
      ctx.globalCompositeOperation = 'lighter';

      for (const p of petals) {
        let x, y, alpha, scale, rot;
        if (phase === 'bloom') {
          const u = smoothstep(Math.max(0, (phaseT - p.phase * 0.3) / 0.7));
          const e = easeOutCubic(u);
          x = p.ox + (p.tx - p.ox) * e;
          y = p.oy + (p.ty - p.oy) * e;
          alpha = e * 0.85;
          scale = e;
          rot = p.rot;
        } else if (phase === 'hold') {
          const sway = Math.sin(phaseT * Math.PI * 2 + p.phase * 6.28) * 4;
          x = p.tx + sway * p.dx * 0.3;
          y = p.ty + sway * p.dy * 0.3;
          alpha = 0.85;
          scale = 1;
          rot = p.rot + p.rotSpd * phaseT;
        } else if (phase === 'dissolve') {
          const u = easeOutCubic(phaseT);
          const drift = u * Math.min(w, h) * 0.65;
          x = p.tx + p.dx * drift;
          y = p.ty + p.dy * drift + u * 30;          // gentle gravity
          alpha = Math.pow(1 - u, 1.4) * 0.85;
          scale = 1 - u * 0.3;
          rot = p.rot + p.rotSpd * phaseT * 2;
        } else if (phase === 'settle') {
          const u = easeOutCubic(phaseT);
          x = p.tx * (1 - u * 0.6) + (w / 2) * (u * 0.6);
          y = p.ty * (1 - u * 0.6) + (h / 2) * (u * 0.6);
          alpha = (1 - u) * 0.45;
          scale = 1 - u * 0.55;
          rot = p.rot + p.rotSpd * phaseT;
        } else { // reset — quick regrow for seamless loop
          const u = phaseT;
          x = p.ox + (p.tx - p.ox) * u;
          y = p.oy + (p.ty - p.oy) * u;
          alpha = u * 0.1;
          scale = u * 0.1;
          rot = p.rot;
        }
        if (alpha < 0.01) continue;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        drawPetal(ctx, p.size, p.color);
        ctx.restore();
      }

      // ── Stamens (small bright dots near centre) ──────────────
      for (const s of stamens) {
        let x, y, alpha, size;
        if (phase === 'bloom') {
          const u = smoothstep(phaseT);
          x = s.ox + (s.x - s.ox) * u;
          y = s.oy + (s.y - s.oy) * u;
          alpha = u * 0.95;
          size = s.size * u;
        } else if (phase === 'hold') {
          x = s.x; y = s.y; alpha = 0.95; size = s.size;
        } else if (phase === 'dissolve') {
          const u = phaseT;
          x = s.x + u * 24;
          y = s.y + u * 24;
          alpha = (1 - u) * 0.95;
          size = s.size * (1 - u * 0.3);
        } else if (phase === 'settle') {
          x = s.x * (1 - phaseT * 0.5) + (w / 2) * (phaseT * 0.5);
          y = s.y * (1 - phaseT * 0.5) + (h / 2) * (phaseT * 0.5);
          alpha = (1 - phaseT) * 0.5;
          size = s.size * (1 - phaseT * 0.4);
        } else {
          x = s.ox; y = s.oy; alpha = 0; size = 0;
        }
        if (alpha < 0.01) continue;

        ctx.save();
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
        g.addColorStop(0, '#fff5e0');
        g.addColorStop(0.4, '#ffd9a0');
        g.addColorStop(1, 'rgba(255, 217, 160, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Centre core (pulsing bright spot) ────────────────────
      const corePulse = 0.7 + Math.sin(t * 1.4) * 0.3;
      ctx.save();
      ctx.globalAlpha = corePulse;
      const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 90);
      cg.addColorStop(0, 'rgba(255, 245, 230, 1)');
      cg.addColorStop(0.5, 'rgba(255, 200, 180, 0.6)');
      cg.addColorStop(1, 'rgba(255, 200, 180, 0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Pollen (continuous, additive) — finer, more grainy ────
      if (!reduced && now - lastPollen > 16 && pollen.length < POLLEN_MAX) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.18 + Math.random() * 0.55;
        pollen.push({
          x: w / 2 + (Math.random() - 0.5) * 60,
          y: h / 2 + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.10,        // stronger upward bias
          size: 0.4 + Math.random() * 0.9,           // finer grain
          color: POLLEN_COLORS[(Math.random() * POLLEN_COLORS.length) | 0],
          life: 0,
          maxLife: 600 + Math.random() * 1200,
          wobble: Math.random() * Math.PI * 2,
        });
        lastPollen = now;
      }

      for (let i = pollen.length - 1; i >= 0; i--) {
        const p = pollen[i];
        p.life++;
        const tWob = (p.life + p.wobble * 12) * 0.025;
        p.x += p.vx + Math.sin(tWob) * 0.12;
        p.y += p.vy + Math.cos(tWob * 0.9) * 0.08;
        p.vx *= 0.997;
        p.vy *= 0.997;

        const f = p.life / p.maxLife;
        const a = f < 0.1 ? f / 0.1 : 1 - (f - 0.1) / 0.9;
        const alpha = Math.max(0, a) * 0.55;

        // soft glow gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        g.addColorStop(0, p.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (f >= 1) pollen.splice(i, 1);
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return <canvas ref={canvasRef} className="bloom-canvas" aria-hidden />;
}