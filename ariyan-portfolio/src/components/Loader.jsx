import { useEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/scroll';
import { PROJECTS } from '../data';

const LINES = [
  ['ariyan.sys', 'v3.0 — booting'],
  ['mount /work', `${PROJECTS.length} products found`],
  ['link  /stack', 'react · node · flutter · ai'],
  ['verify build', 'ok'],
];

export default function Loader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);
  const log = useRef(null);

  useEffect(() => {
    const fast = reduceMotion();
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      const tl = gsap.timeline({ onComplete: onDone });
      const rows = log.current.querySelectorAll('.boot__row');

      tl.to(obj, {
        v: 100,
        duration: fast ? 0.4 : 2.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          const n = Math.round(obj.v);
          count.current.textContent = String(n).padStart(3, '0');
          bar.current.style.transform = `scaleX(${n / 100})`;
        },
      }, 0);
      tl.fromTo(rows, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: fast ? 0 : 0.42 }, 0.15);
      tl.to('.boot__inner', { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, '+=0.2');
      tl.to('.boot__half--t', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '>-0.05');
      tl.to('.boot__half--b', { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, '<');
      tl.set(root.current, { display: 'none' });
    }, root);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div ref={root} className="boot" aria-hidden="true">
      <div className="boot__half boot__half--t" />
      <div className="boot__half boot__half--b" />
      <div className="boot__inner">
        <div ref={log} className="boot__log">
          {LINES.map(([k, v]) => (
            <div className="boot__row" key={k}>
              <span className="boot__k">&gt; {k}</span>
              <span className="boot__dots" />
              <span className="boot__v">{v}</span>
            </div>
          ))}
        </div>
        <div className="boot__foot">
          <div ref={count} className="boot__count">000</div>
          <div className="boot__meta">
            <span>Ariyan Samal — Portfolio ’26</span>
            <div className="boot__bar"><i ref={bar} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
