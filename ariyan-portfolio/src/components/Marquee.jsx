import { useEffect, useRef } from 'react';
import { gsap, getLenis, reduceMotion } from '../lib/scroll';
import { CLIENTS, STACK } from '../data';

// Two opposing tickers whose speed (and skew) reacts to scroll velocity.
function Row({ items, dir = 1, outline }) {
  const track = useRef(null);
  useEffect(() => {
    if (reduceMotion()) return undefined;
    const el = track.current;
    const half = () => el.scrollWidth / 2;
    let x = dir < 0 ? 0 : -half();
    const fn = () => {
      const l = getLenis();
      const v = l ? l.velocity : 0;
      x += dir * (0.6 + Math.min(Math.abs(v) * 0.5, 16));
      const h = half();
      if (x <= -h) x += h;
      if (x > 0) x -= h;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(-8, Math.min(8, -v * 0.35))}deg)`;
    };
    gsap.ticker.add(fn);
    return () => gsap.ticker.remove(fn);
  }, [dir]);

  const set = [...items, ...items];
  return (
    <div className={`mq__row ${outline ? 'is-outline' : ''}`}>
      <div className="mq__track" ref={track}>
        {set.concat(set).map((t, i) => (
          <span key={i}>{t}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="mq" aria-label="Clients and stack">
      <div className="mq__label"><span>Worked with</span><span>Built with</span></div>
      <Row items={CLIENTS} dir={-1} />
      <Row items={STACK} dir={1} outline />
    </section>
  );
}
