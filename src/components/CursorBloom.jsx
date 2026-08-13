// CursorBloom — drifting petals follow the cursor (Round 28 redesign).
//
// The hero field starts EMPTY (no particles). As the pointer moves, soft
// luminous petals drift out from the eased cursor position and linger
// along its path. A few small star glints ride along with the petals,
// so the trail also sparkles gently. Each petal fades in, holds, then
// drifts down and fades out — like real camellia petals that come to
// rest.
//
// Rendered on a transparent canvas with mix-blend-mode: screen, so the
// warm petals + glints glow additively over the dark crimson hero video.
// The underlying hero clip is untouched; all of the effect lives here.
//
// Round 20: particles are rendered OUTSIDE the Lithos reveal hole (the
// bright window from CursorMask). Round 30: the canvas wears the SAME
// irregular ink-wash blob as CursorMask (deep centre → light edge), paired
// with a solid full-cover mask and `mask-composite: subtract`, so petals
// drift around the ink hole rather than on top of it.
//
// Round 25 perf fix (user reported 卡帧): throttle mask writes (each
// one forces layer compositing), lower particle caps, pause RAF when
// the tab is hidden.
//
// Round 26: welcome-bloom positions are deterministic — fixed angles /
// distances / sizes (no Math.random) so the opening cluster is
// pixel-identical across refreshes.
//
// Round 28 (this version): replaced the previous multi-petal *flower*
// drawing (each flower = glow + N ellipse petals + bright centre + per-
// flower sparkle) with single drifting *petals*. Each petal is one
// curved teardrop with a soft warm glow behind it. Drawing one petal
// is meaningfully cheaper than drawing a whole flower (fewer gradient
// creations, no inner loop over petal count), so we can keep more of
// them alive and the trail still feels lush — but the per-frame canvas
// work drops.
import { useEffect, useRef } from 'react';
import './CursorBloom.css';
import { inkMaskURL, inkTileSize } from './inkMask';

const R = 120;            // ink-blob nominal radius — MUST match CursorMask R so
                          // canvas "hole" aligns with the Lithos reveal hole
const EASE = 0.12;        // cursor smoothing — match CursorMask lerp so the
                          // bloom mask and the reveal hole track together
const SPAWN_MS = 70;      // min ms between petal spawns (throttle)
const SPAWN_DIST = 12;    // min px the eased cursor must travel between spawns
const MAX_PETALS = 80;    // hard cap on live petals (was 60 flowers — petals
                          // are cheaper to draw so we can carry a few more)
const MAX_SPARKS = 130;   // hard cap on live sparkle particles (unchanged)
const MASK_EPS = 0.5;     // px — skip mask write if smooth barely moved
// Petal lifecycle (slightly longer than the old flower so they linger
// visibly on the trail: 400 fade-in, 800 hold, 1800 fade-out = 3000ms).
const FADE_IN = 400;
const HOLD = 800;
const FADE_OUT = 1800;
const LIFE = FADE_IN + HOLD + FADE_OUT;

// Sparkle lifecycle
const SPARK_LIFE_MIN = 700;
const SPARK_LIFE_MAX = 1500;

// Draw one drifting petal — a curved teardrop with a soft warm glow
// behind it, alpha already folded into the colours.
function drawPetal(ctx, p) {
  const a = p.alpha;
  if (a <= 0) return;
  const sz = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot + p.spin);

  // soft warm glow behind the petal — a faint halo so it reads against
  // the dark crimson clip even when the petal body is thin.
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 1.8);
  glow.addColorStop(0, `rgba(255, 206, 178, ${0.36 * a})`);
  glow.addColorStop(1, 'rgba(255, 206, 178, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // petal body — a curved teardrop: narrow at the base, wider in the
  // middle, pointed at the tip. Warm peach at the base → cream tip.
  const pg = ctx.createLinearGradient(-sz, 0, sz, 0);
  pg.addColorStop(0,    `rgba(255, 132, 100, ${0.85 * a})`);
  pg.addColorStop(0.55, `rgba(255, 196, 160, ${0.95 * a})`);
  pg.addColorStop(1,    `rgba(255, 240, 218, ${0.95 * a})`);
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.moveTo(-sz, 0);
  ctx.bezierCurveTo(-sz * 0.85, -sz * 0.55,
                     sz * 0.55, -sz * 0.75,
                     sz * 1.05, 0);
  ctx.bezierCurveTo( sz * 0.55,  sz * 0.75,
                    -sz * 0.85,  sz * 0.55,
                    -sz, 0);
  ctx.closePath();
  ctx.fill();

  // faint inner crease for a touch of depth (a single arc near the tip)
  ctx.strokeStyle = `rgba(255, 240, 218, ${0.35 * a})`;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-sz * 0.4, 0);
  ctx.bezierCurveTo(-sz * 0.1, -sz * 0.25,
                      sz * 0.4, -sz * 0.25,
                      sz * 0.85, 0);
  ctx.stroke();

  ctx.restore();
}

// Draw one sparkle particle — twinkling 4-point star (kept tiny so it
// reads as glitter, not as a flower). Sparkles are the only "twinkle"
// beat in the trail — petals do the work, stars add the sparkle.
function drawSpark(ctx, s, ts) {
  const age = ts - s.born;
  if (age < 0 || age > s.life) return;
  const t = age / s.life;            // 0..1 progress
  let a;
  if (s.kind === 'star') {
    // twinkle: pulses brightness, then fades out over its life
    a = (0.35 + 0.65 * Math.abs(Math.sin(s.twPhase + age * s.twFreq))) * (1 - t);
  } else {
    // drifting petal spark — gentle linear fade
    a = (1 - t) * 0.85;
  }
  if (a <= 0) return;

  const sz = s.size * (s.kind === 'star' ? (0.7 + 0.6 * (1 - t)) : 1);
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot + s.spin * age * 0.02);

  if (s.kind === 'star') {
    // glow halo
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 3);
    g.addColorStop(0, `rgba(255, 250, 235, ${0.9 * a})`);
    g.addColorStop(1, 'rgba(255, 250, 235, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, sz * 3, 0, Math.PI * 2);
    ctx.fill();
    // 4-point cross rays
    ctx.strokeStyle = `rgba(255, 255, 245, ${a})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-sz * 3.2, 0); ctx.lineTo(sz * 3.2, 0);
    ctx.moveTo(0, -sz * 3.2); ctx.lineTo(0, sz * 3.2);
    ctx.stroke();
  } else {
    // small drifting petal (kept tiny so the main trail reads as petals)
    const pg = ctx.createLinearGradient(0, 0, sz * 2.4, 0);
    pg.addColorStop(0, `rgba(255, 150, 120, ${0.85 * a})`);
    pg.addColorStop(1, `rgba(255, 235, 210, ${0.9 * a})`);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.ellipse(sz * 1.2, 0, sz * 1.2, sz * 0.55, 0, 0, Math.PI * 2);
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

    // Reduced-motion users get no blooms (the field simply stays empty).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let w = 0, h = 0, dpr = 1;
    // Initial cursor = hero centre (matches CursorMask's default rest), so
    // the inverse mask is well-positioned before the user moves the mouse.
    let smooth = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let hasTarget = false;
    let lastSpawn = 0;
    let lastTarget = { x: -999, y: -999 };
    // Track the last mask-applied position so we can skip redundant CSS
    // maskImage writes (each one forces a layer compositing repaint).
    let lastApplied = { x: NaN, y: NaN };
    let raf = 0;
    const petals = [];
    const sparks = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-centre the cursor on resize so the mask stays at the hero centre.
      smooth.x = w / 2;
      smooth.y = h * 0.44;
      target.x = smooth.x;
      target.y = smooth.y;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track the window cursor; only act while it's within the hero bounds.
    // Round 26: when cursor leaves, ease target back to the hero centre
    // (instead of freezing at the last inside position) so the opening
    // state stays consistent — refresh-while-cursor-outside keeps the
    // bloom mask at the centre, matching the welcome bloom.
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
        const kind = forceKind || (Math.random() < 0.75 ? 'star' : 'petal');
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

    // Spawn a small cluster of petals at (x, y) with a little jitter so
    // the trail reads as a shower of loose petals rather than dots, then
    // emit a few sparkles for the twinkle beat.
    function spawnPetal(x, y) {
      if (petals.length >= MAX_PETALS) return;
      const now = performance.now();
      // 2–3 petals per spawn, with mild stagger, so the burst reads as
      // a soft shower.
      const count = 2 + (Math.random() < 0.5 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        petals.push({
          x: x + (Math.random() - 0.5) * 22,
          y: y + (Math.random() - 0.5) * 22,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.25 + Math.random() * 0.35, // petals drift DOWN, not up
          born: now + i * 35,
          size: 9 + Math.random() * 8,     // 9–17 px
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.022,
          alpha: 0,
        });
      }
      spawnSparks(x, y, 3 + Math.floor(Math.random() * 3));
    }

    // Round 30: the petal layer wears the SAME irregular ink-wash blob as
    // CursorMask (deep centre → light edge, see inkMask.js), paired with a
    // solid full-cover mask and `mask-composite: subtract` so petals render
    // everywhere EXCEPT the blob — i.e. outside the Lithos reveal hole. The
    // two layers share R + seed, so the shapes line up pixel-for-pixel.
    // The blob is static; only its position follows the cursor each frame.
    const inkTile = inkTileSize(R);
    const inkBlob = inkMaskURL(R);
    function applyInkMask() {
      canvas.style.webkitMaskImage = `linear-gradient(#000,#000), ${inkBlob}`;
      canvas.style.maskImage = `linear-gradient(#000,#000), ${inkBlob}`;
      canvas.style.webkitMaskSize = `100% 100%, ${inkTile}px ${inkTile}px`;
      canvas.style.maskSize = `100% 100%, ${inkTile}px ${inkTile}px`;
      canvas.style.webkitMaskRepeat = 'no-repeat, no-repeat';
      canvas.style.maskRepeat = 'no-repeat, no-repeat';
      canvas.style.maskComposite = 'subtract';
    }
    function moveInkMask(x, y) {
      const px = `${x - inkTile / 2}px`;
      const py = `${y - inkTile / 2}px`;
      canvas.style.webkitMaskPosition = `0 0, ${px} ${py}`;
      canvas.style.maskPosition = `0 0, ${px} ${py}`;
    }
    applyInkMask();

    function frame(ts) {
      ctx.clearRect(0, 0, w, h);

      // ease the cursor, then spawn along its path (throttled by time + distance)
      if (hasTarget) {
        smooth.x += (target.x - smooth.x) * EASE;
        smooth.y += (target.y - smooth.y) * EASE;
        const dist = Math.hypot(smooth.x - lastTarget.x, smooth.y - lastTarget.y);
        if (ts - lastSpawn > SPAWN_MS && (dist > SPAWN_DIST || lastTarget.x < 0)) {
          spawnPetal(smooth.x, smooth.y);
          lastSpawn = ts;
          lastTarget.x = smooth.x; lastTarget.y = smooth.y;
        }
      }

      // Move the ink mask only when smooth has moved meaningfully — each
      // mask-position write forces a layer compositing repaint, so skipping
      // redundant writes is the dominant perf win on idle frames.
      if (
        Math.abs(smooth.x - lastApplied.x) >= MASK_EPS ||
        Math.abs(smooth.y - lastApplied.y) >= MASK_EPS
      ) {
        moveInkMask(smooth.x, smooth.y);
        lastApplied.x = smooth.x;
        lastApplied.y = smooth.y;
      }

      // petals — drift down with gravity + slight side sway
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        const age = ts - p.born;
        if (age < 0) continue;                 // queued (not yet born)
        if (age > LIFE) {
          // one tiny petal spark left behind as the petal settles
          spawnSparks(p.x, p.y, 1, 'petal');
          petals.splice(i, 1);
          continue;
        }
        let a;
        if (age < FADE_IN) a = age / FADE_IN;
        else if (age < FADE_IN + HOLD) a = 1;
        else a = 1 - (age - FADE_IN - HOLD) / FADE_OUT;
        p.alpha = a < 0 ? 0 : a > 1 ? 1 : a;
        // gentle side sway so the fall isn't a straight line
        p.x += p.vx + Math.sin(age * 0.003) * 0.15;
        p.y += p.vy;
        drawPetal(ctx, p);
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

    // Round 23: welcome bloom — spawn a small cluster of petals at the
    // hero centre on mount, with staggered timing. The page always opens
    // with a gentle drift at the centre, even before the user moves.
    // Round 25: dropped from 7 → 5 to ease the open-frame workload.
    // Round 26: deterministic — angles / distances / sizes / rotations
    // are all fixed values (no Math.random) so the opening cluster is
    // pixel-identical across refreshes. Randomness only kicks in AFTER
    // the user moves the cursor (i.e. dynamic interaction starts).
    // Round 28: now spawns petals (not whole flowers) — each entry is
    // one petal with a fixed offset/rotation; together they read as a
    // small "snowfall" of camellia petals rather than a flower cluster.
    (function welcomeBloom() {
      const cx = w / 2;
      const cy = h * 0.44;
      const now = performance.now();
      const count = 7;            // a few more petals than the old 5 flowers
                                  // (each is much cheaper to draw)
      // Fixed angles — 7 spread around the centre, offset 0.6rad so the
      // cluster reads as a soft arc rather than a rigid heptagon.
      const angles = [0.0, 1.0, 2.0, 3.0, 4.1, 5.2, 0.5];
      // Fixed distances — mostly close, a couple further out, for a soft
      // ring around the centre hole.
      const dists = [62, 50, 78, 55, 90, 60, 72];
      // Fixed sizes — 11–15 px so the welcome bloom isn't overwhelming.
      const sizes = [12, 14, 11, 13, 15, 11, 13];
      // Fixed rotations — varied so the petals don't all face the same way.
      const rots = [0.0, 0.7, 1.6, 2.3, 3.0, 4.0, 5.1];
      for (let i = 0; i < count; i++) {
        const ang = angles[i];
        const dist = dists[i];
        petals.push({
          x: cx + Math.cos(ang) * dist,
          y: cy + Math.sin(ang) * dist,
          vx: 0,
          vy: 0.2 + 0.05 * i,     // all drift down slowly
          born: now + i * 110,
          size: sizes[i],
          rot: rots[i],
          spin: (i % 2 === 0 ? 1 : -1) * 0.018,
          alpha: 0,
        });
      }
      // Fixed sparks — exactly 5 every refresh (was `4 + Math.floor(rand*2)`)
      spawnSparks(cx, cy, 5);
    })();

    raf = requestAnimationFrame(frame);

    // Pause RAF when the tab is hidden — no point animating petals the
    // user can't see. Big battery + frame budget win for background tabs.
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