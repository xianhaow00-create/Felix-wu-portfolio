// CursorBloom — Round 40 redesign.
//
// The user asked for the moving effect to read as a dispersion-style
// RED FLUID (弥散风格的红色的流体) trailing the cursor, and to drop the
// previous irregular (Lithos ink-mask) coupling. So:
//
//   - No inkMask / CursorMask anymore. The bloom canvas renders a free
//     red fluid trail; no holes.
//   - Each spawned particle is a soft red radial blob (large diffuse
//     halo + brighter inner core) rather than a sharp teardrop petal,
//     so it reads as a fluid dispersion instead of falling flower petals.
//   - Colours moved from warm peach/cream to brand red (≈ #ff3b2f).
//   - Sparkles re-coloured red as well, kept tiny so they read as
//     glints inside the fluid.
//
// The Cursor (App.css) is now a soft gradient circle (radial fade),
// not a hard ink-blend dot, so the visual language is: soft circle
// cursor + red fluid dispersion trail.
import { useEffect, useRef } from 'react';
import './CursorBloom.css';

const EASE = 0.12;        // cursor smoothing (kept to match prior feel)
const SPAWN_MS = 70;      // min ms between fluid-blob spawns
const SPAWN_DIST = 12;    // min px the eased cursor must travel
const MAX_FLUID = 70;     // hard cap on live fluid blobs
const MAX_SPARKS = 110;   // hard cap on live sparkle particles
// Fluid blob lifecycle — linger visibly on the trail.
const FADE_IN = 350;
const HOLD = 700;
const FADE_OUT = 1700;
const LIFE = FADE_IN + HOLD + FADE_OUT;

// Sparkle lifecycle
const SPARK_LIFE_MIN = 700;
const SPARK_LIFE_MAX = 1500;

// Brand red used for the fluid + glints.
const RED_CORE = 'rgba(255, 110, 90, ';
const RED_HALO = 'rgba(255, 70, 55, ';

// Draw one fluid blob — a large soft red radial halo (the diffuse
// "fluid" body) plus a brighter inner core. No sharp shapes; the whole
// thing reads as a dispersion of red ink/fluid.
function drawFluid(ctx, p) {
  const a = p.alpha;
  if (a <= 0) return;
  const sz = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);

  // outer diffuse halo — large, very soft falloff (弥散)
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 3.6);
  halo.addColorStop(0,    `${RED_HALO}${0.40 * a})`);
  halo.addColorStop(0.35, `${RED_HALO}${0.20 * a})`);
  halo.addColorStop(1,    `${RED_HALO}0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 3.6, 0, Math.PI * 2);
  ctx.fill();

  // inner brighter core — smaller, more saturated
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 0.95);
  core.addColorStop(0, `${RED_CORE}${0.55 * a})`);
  core.addColorStop(1, `${RED_CORE}0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.95, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw one sparkle glint — a small red cross/twinkle riding with the
// fluid. Kept tiny so it reads as glitter inside the red dispersion.
function drawSpark(ctx, s, ts) {
  const age = ts - s.born;
  if (age < 0 || age > s.life) return;
  const t = age / s.life;            // 0..1 progress
  let a;
  if (s.kind === 'star') {
    a = (0.35 + 0.65 * Math.abs(Math.sin(s.twPhase + age * s.twFreq))) * (1 - t);
  } else {
    a = (1 - t) * 0.8;
  }
  if (a <= 0) return;

  const sz = s.size * (s.kind === 'star' ? (0.7 + 0.6 * (1 - t)) : 1);
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot + s.spin * age * 0.02);

  if (s.kind === 'star') {
    // red glow halo
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 3);
    g.addColorStop(0, `${RED_CORE}${0.85 * a})`);
    g.addColorStop(1, `${RED_CORE}0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, sz * 3, 0, Math.PI * 2);
    ctx.fill();
    // 4-point cross rays in red
    ctx.strokeStyle = `rgba(255, 180, 160, ${a})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-sz * 3.2, 0); ctx.lineTo(sz * 3.2, 0);
    ctx.moveTo(0, -sz * 3.2); ctx.lineTo(0, sz * 3.2);
    ctx.stroke();
  } else {
    // small red drifting blob
    const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 1.4);
    pg.addColorStop(0, `${RED_CORE}${0.7 * a})`);
    pg.addColorStop(1, `${RED_CORE}0)`);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(0, 0, sz * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function CursorBloom() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Reduced-motion users get no blooms (the field stays empty).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let w = 0, h = 0, dpr = 1;
    let smooth = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let hasTarget = false;
    let lastSpawn = 0;
    let lastTarget = { x: -999, y: -999 };
    let raf = 0;
    const fluid = [];
    const sparks = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      smooth.x = w / 2;
      smooth.y = h * 0.44;
      target.x = smooth.x;
      target.y = smooth.y;
    }
    resize();
    window.addEventListener('resize', resize);

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > w || y > h) {
        hasTarget = false;
        target.x = w / 2;
        target.y = h * 0.44;
        return;
      }
      target.x = x; target.y = y;
      if (!hasTarget) { smooth.x = x; smooth.y = y; hasTarget = true; }
    }
    window.addEventListener('mousemove', onMove, { passive: true });

    function spawnSparks(x, y, n, forceKind) {
      if (sparks.length >= MAX_SPARKS) return;
      for (let i = 0; i < n; i++) {
        const kind = forceKind || (Math.random() < 0.7 ? 'star' : 'blob');
        sparks.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          born: performance.now(),
          life: SPARK_LIFE_MIN + Math.random() * (SPARK_LIFE_MAX - SPARK_LIFE_MIN),
          size: 1.5 + Math.random() * 3,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.04,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.1 - Math.random() * 0.25,
          twPhase: Math.random() * Math.PI * 2,
          twFreq: 0.012 + Math.random() * 0.01,
          kind,
        });
      }
    }

    // Spawn a small cluster of red fluid blobs at (x, y) with mild
    // jitter + a few sparkles, so the trail reads as a dispersion of
    // red fluid rather than a stream of dots.
    function spawnFluid(x, y) {
      if (fluid.length >= MAX_FLUID) return;
      const now = performance.now();
      const count = 2 + (Math.random() < 0.5 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        fluid.push({
          x: x + (Math.random() - 0.5) * 26,
          y: y + (Math.random() - 0.5) * 26,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.15 + Math.random() * 0.3,
          born: now + i * 35,
          size: 10 + Math.random() * 9,   // 10–19 px
          alpha: 0,
        });
      }
      spawnSparks(x, y, 3 + Math.floor(Math.random() * 3));
    }

    function frame(ts) {
      ctx.clearRect(0, 0, w, h);

      if (hasTarget) {
        smooth.x += (target.x - smooth.x) * EASE;
        smooth.y += (target.y - smooth.y) * EASE;
        const dist = Math.hypot(smooth.x - lastTarget.x, smooth.y - lastTarget.y);
        if (ts - lastSpawn > SPAWN_MS && (dist > SPAWN_DIST || lastTarget.x < 0)) {
          spawnFluid(smooth.x, smooth.y);
          lastSpawn = ts;
          lastTarget.x = smooth.x; lastTarget.y = smooth.y;
        }
      }

      // fluid blobs — drift down gently with side sway
      for (let i = fluid.length - 1; i >= 0; i--) {
        const p = fluid[i];
        const age = ts - p.born;
        if (age < 0) continue;
        if (age > LIFE) {
          spawnSparks(p.x, p.y, 1, 'blob');
          fluid.splice(i, 1);
          continue;
        }
        let a;
        if (age < FADE_IN) a = age / FADE_IN;
        else if (age < FADE_IN + HOLD) a = 1;
        else a = 1 - (age - FADE_IN - HOLD) / FADE_OUT;
        p.alpha = a < 0 ? 0 : a > 1 ? 1 : a;
        p.x += p.vx + Math.sin(age * 0.003) * 0.15;
        p.y += p.vy;
        drawFluid(ctx, p);
      }

      // sparkles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        if (ts - s.born > s.life) { sparks.splice(i, 1); continue; }
        s.x += s.vx;
        s.y += s.vy;
        drawSpark(ctx, s, ts);
      }

      raf = requestAnimationFrame(frame);
    }

    // Welcome bloom — deterministic cluster of red fluid blobs at the
    // hero centre on mount. Fixed angles/distances/sizes (no Math.random)
    // so the open-frame cluster is identical across refreshes.
    (function welcomeFluid() {
      const cx = w / 2;
      const cy = h * 0.44;
      const now = performance.now();
      const count = 7;
      const angles = [0.0, 1.0, 2.0, 3.0, 4.1, 5.2, 0.5];
      const dists  = [62, 50, 78, 55, 90, 60, 72];
      const sizes  = [13, 15, 12, 14, 16, 12, 14];
      for (let i = 0; i < count; i++) {
        fluid.push({
          x: cx + Math.cos(angles[i]) * dists[i],
          y: cy + Math.sin(angles[i]) * dists[i],
          vx: 0,
          vy: 0.2 + 0.05 * i,
          born: now + i * 110,
          size: sizes[i],
          alpha: 0,
        });
      }
      spawnSparks(cx, cy, 5);
    })();

    raf = requestAnimationFrame(frame);

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
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="hero-cursor-bloom" aria-hidden />;
}