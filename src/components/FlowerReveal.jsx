// FlowerReveal — canvas-based dormant-flower field over the hero video.
// A soft warm spotlight follows the cursor; flowers inside its radius
// bloom (scale up, opacity 1, soft halo) and fade back down when the
// cursor leaves. Inspired by the Lithos cursor-spotlight reveal but
// adapted to the Felix Wu brand: warm red/pink/cream flowers on the
// dark crimson video, no second image under the mask — the flowers
// themselves ARE the reveal.
//
// Design notes:
//   - 42 dormant flowers spread evenly across the hero on resize
//   - Default state: very faint, small, scattered (4–10% alpha)
//   - Inside the spotlight (radius 240px), flowers lerp toward full
//     opacity + 1.8× scale + a soft warm radial glow halo
//   - Easing: square of normalized distance, so the center blooms
//     fully and the edge stays almost dormant (clean falloff)
//   - mix-blend-mode: screen in CSS so the flower colors add to the
//     dark video without flattening it
//   - pointer-events: none + window-level mousemove (same pattern as
//     RippleOverlay) so the canvas never blocks the hero text/CTA
import { useEffect, useRef } from 'react';
import './FlowerReveal.css';

const SPOT_R = 240;        // spotlight radius (CSS px)
const OP_LERP = 0.18;      // opacity lerp speed (0..1, per frame)
const SC_LERP = 0.08;      // scale  lerp speed
const N_FLOWERS = 42;

function rand(min, max) { return min + Math.random() * (max - min); }

export function FlowerReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, dpr = 1;
    let mouseX = -9999, mouseY = -9999;
    let activeInHero = false;
    let raf = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      respawnFlowers();
    }

    // Build / rebuild the flower field whenever the canvas is resized
    // so the same density is preserved across viewport changes.
    const flowers = [];
    function respawnFlowers() {
      flowers.length = 0;
      for (let i = 0; i < N_FLOWERS; i++) {
        const baseSize = rand(7, 18);
        const baseScale = rand(0.45, 0.75);
        // Pick a warm hue: deep red ↔ soft pink ↔ peach. Wrap-around ok.
        const hue = rand(345, 35);
        flowers.push({
          x: rand(0, w),
          y: rand(0, h),
          petals: 5 + (Math.random() < 0.4 ? 1 : 0),
          size: baseSize,
          baseScale,
          targetScale: baseScale * rand(1.6, 2.3),
          scale: baseScale,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: rand(-0.0025, 0.0025),
          baseOpacity: rand(0.04, 0.11),
          opacity: 0,
          hue,
          sat: rand(58, 90),
          light: rand(60, 78),
          // gentle float so the field breathes even when idle
          drift: rand(-0.2, 0.2),
          driftPhase: Math.random() * Math.PI * 2,
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -SPOT_R || y < -SPOT_R || x > w + SPOT_R || y > h + SPOT_R) {
        activeInHero = false;
        return;
      }
      activeInHero = true;
      mouseX = x;
      mouseY = y;
    }
    window.addEventListener('mousemove', onMove);
    function onLeave() { activeInHero = false; }
    window.addEventListener('mouseleave', onLeave);

    function drawPetal(angle, f) {
      // Petal = vertical ellipse, rotated to its slot
      ctx.save();
      ctx.rotate(angle - Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, -f.size * 0.42, f.size * 0.32, f.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${f.hue}, ${f.sat}%, ${f.light}%, 0.88)`;
      ctx.fill();
      ctx.restore();
    }

    function drawFlower(f, time) {
      const driftX = Math.sin(time * 0.0006 + f.driftPhase) * f.drift * 10;
      const driftY = Math.cos(time * 0.0005 + f.driftPhase * 1.3) * f.drift * 7;
      const px = f.x + driftX;
      const py = f.y + driftY;

      ctx.save();
      ctx.translate(px, py);

      // Soft warm halo when bloomed — additive so it brightens
      // the underlying video without flattening it.
      if (f.scale > f.baseScale * 1.15) {
        const bloom = (f.scale - f.baseScale) / (f.targetScale - f.baseScale);
        const glowR = f.size * (1.4 + bloom * 1.4);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        grad.addColorStop(0, `hsla(${f.hue}, 100%, 82%, ${0.30 * bloom})`);
        grad.addColorStop(0.5, `hsla(${f.hue}, 100%, 72%, ${0.12 * bloom})`);
        grad.addColorStop(1, `hsla(${f.hue}, 100%, 70%, 0)`);
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.rotate(f.rotation);
      ctx.scale(f.scale, f.scale);
      ctx.globalAlpha = f.opacity;

      // Petals
      for (let p = 0; p < f.petals; p++) {
        const angle = (p / f.petals) * Math.PI * 2;
        drawPetal(angle, f);
      }

      // Cream center
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(38, 95%, 88%, 0.95)`;
      ctx.fill();

      // Tiny bright seed highlight
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(50, 100%, 95%, 1)`;
      ctx.fill();

      ctx.restore();
    }

    function drawSpotlight() {
      if (!activeInHero) return;
      const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, SPOT_R);
      grad.addColorStop(0,    'rgba(255, 220, 190, 0.16)');
      grad.addColorStop(0.35, 'rgba(255, 200, 160, 0.08)');
      grad.addColorStop(1,    'rgba(255, 200, 160, 0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(time) {
      ctx.clearRect(0, 0, w, h);

      for (const f of flowers) {
        const dx = f.x - mouseX;
        const dy = f.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const distNorm = Math.max(0, 1 - dist / SPOT_R);
        // Square falloff: full bloom at center, almost dormant at edge
        const influence = activeInHero ? distNorm * distNorm : 0;

        const targetOp = f.baseOpacity + (1 - f.baseOpacity) * influence;
        const targetSc = f.baseScale + (f.targetScale - f.baseScale) * influence;

        f.opacity += (targetOp - f.opacity) * OP_LERP;
        f.scale   += (targetSc  - f.scale)   * SC_LERP;
        f.rotation += f.rotSpeed;

        drawFlower(f, time);
      }

      drawSpotlight();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-flower-reveal" aria-hidden />;
}
