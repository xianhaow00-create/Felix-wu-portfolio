// Subtle custom cursor — adds a tiny bit of refinement without being intrusive.
// Mix-blend-mode difference keeps it readable on any background.
import { useEffect, useRef } from 'react';

export function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onEnter = () => c.classList.add('hover');
    const onLeave = () => c.classList.remove('hover');

    window.addEventListener('mousemove', onMove);

    // Interactive selector — grow on hover
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [data-cursor="hover"]')) {
        onEnter();
      } else {
        onLeave();
      }
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} className="cursor" aria-hidden />;
}
