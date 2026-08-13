// HeroRipple — abstract flat 2D water-ripple scrolling background.
// Replaces the prior AI-generated clip with a Canvas-drawn "flat planar
// scrolling" of water ripples so the foreground text reads cleanly and
// the page keeps the site's warm cream identity. The BloomText overlay
// (the drifting CN value phrases) is untouched.
import { useEffect, useRef } from 'react';
import './HeroRipple.css';

export function HeroRipple() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0, h = 0, dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ripples = [];
    let lastSpawn = 0;

    function spawnRipple() {
      // Bias toward the right side so the left text column stays quiet
      const x = w * (0.45 + Math.random() * 0.5);
      const y = h * (0.15 + Math.random() * 0.7);
      ripples.push({
        x, y,
        r: 0,
        maxR: 110 + Math.random() * 220,
        life: 1
      });
    }

    function frame(t) {
      // ── Cream base (matches site bg) ──────────────────────────
      ctx.fillStyle = '#f5f3ec';
      ctx.fillRect(0, 0, w, h);

      // Very subtle warm gradient — keeps the "flat plane" feeling
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(232, 227, 213, 0.18)');
      grad.addColorStop(0.5, 'rgba(245, 243, 236, 0)');
      grad.addColorStop(1, 'rgba(220, 213, 195, 0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // ── Horizontal scrolling sine waves (the flat water surface)
      // Multiple layers at different speeds create parallax — clearly
      // reads as "water ripples scrolling across a flat plane".
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 9; i++) {
        const baseY = h * (i + 0.5) / 9;
        const amp = 7 + i * 1.4;
        const freq = 0.0035 + i * 0.0005;
        const speed = 0.00045 + i * 0.00007;
        // Alternating tints — warm ink + crimson — keep it on-brand
        const alpha = 0.06 + (i / 9) * 0.05;
        const stroke = i % 2 === 0
          ? `rgba(60, 48, 36, ${alpha})`
          : `rgba(184, 29, 18, ${alpha * 0.9})`;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = baseY
            + Math.sin(x * freq + t * speed * 1000) * amp
            + Math.sin(x * freq * 2.1 + t * speed * 650 + i * 0.7) * (amp * 0.45);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stroke;
        ctx.stroke();
      }

      // ── Expanding ripple rings ("drop in water" once in a while)
      if (t - lastSpawn > 2400 && ripples.length < 4) {
        spawnRipple();
        lastSpawn = t;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.5;
        rp.life -= 0.0045;
        if (rp.life <= 0 || rp.r > rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }
        // sin(life*PI) → fade in then out (soft, 落落大方)
        const a = Math.sin(rp.life * Math.PI) * 0.13;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 47, ${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // faint inner echo
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.78, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 47, ${a * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-ripple" aria-hidden />;
}
