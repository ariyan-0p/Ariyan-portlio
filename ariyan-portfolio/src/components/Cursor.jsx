import { useEffect, useRef } from 'react';
import { gsap, isTouch } from '../lib/scroll';

// Crosshair cursor. Elements opt in with data-cursor="LABEL".
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (isTouch()) return undefined;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      const txt = t ? t.getAttribute('data-cursor') : '';
      label.current.textContent = txt;
      ring.current.classList.toggle('is-label', !!txt);
      ring.current.classList.toggle('is-link', !txt && !!(e.target.closest && e.target.closest('a,button,input,textarea,[role="button"]')));
    };
    const down = () => ring.current.classList.add('is-down');
    const up = () => ring.current.classList.remove('is-down');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
