import { useEffect, useRef } from 'react';
import {
  siReact, siNextdotjs, siNodedotjs, siExpress, siFlutter, siGo, siPython, siTensorflow, siMongodb,
  siFirebase, siDocker, siGreensock, siWebgl, siThreedotjs, siTailwindcss, siGit,
} from 'simple-icons';
import { gsap, getLenis, reduceMotion } from '../lib/scroll';
import { PROJECTS } from '../data';

// simple-icons has no AWS mark any more — a plain cloud glyph stands in for it.
const CLOUD = 'M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.4 8.6 4.9 4.9 0 0 1 17.5 19Z';

const TECH = [
  ['React', siReact.path], ['Next.js', siNextdotjs.path], ['Node.js', siNodedotjs.path], ['Express', siExpress.path],
  ['Flutter', siFlutter.path], ['Go', siGo.path], ['Python', siPython.path], ['TensorFlow', siTensorflow.path],
  ['MongoDB', siMongodb.path], ['Firebase', siFirebase.path], ['AWS', CLOUD], ['Docker', siDocker.path],
  ['GSAP', siGreensock.path], ['WebGL', siWebgl.path], ['Three.js', siThreedotjs.path], ['Tailwind', siTailwindcss.path], ['Git', siGit.path],
];

// A ticker whose speed reacts to scroll velocity.
function Ticker({ children, dir = 1 }) {
  const track = useRef(null);
  useEffect(() => {
    if (reduceMotion()) return undefined;
    const el = track.current;
    const half = () => el.scrollWidth / 2;
    let x = dir < 0 ? 0 : -half();
    const fn = () => {
      const l = getLenis();
      const v = l ? l.velocity : 0;
      x += dir * (0.7 + Math.min(Math.abs(v) * 0.5, 16));
      const h = half();
      if (x <= -h) x += h;
      if (x > 0) x -= h;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(-8, Math.min(8, -v * 0.3))}deg)`;
    };
    gsap.ticker.add(fn);
    return () => gsap.ticker.remove(fn);
  }, [dir]);
  return (
    <div className="mq__row">
      <div className="mq__track" ref={track}>{children}{children}</div>
    </div>
  );
}

export default function Marquee() {
  const clients = PROJECTS.filter((p) => p.shot);
  const clientSet = [...clients, ...clients];
  const techSet = [...TECH, ...TECH];

  return (
    <section className="mq" aria-label="Clients and stack">
      <div className="mq__block">
        <header className="mq__head">
          <h2>Worked with</h2>
        </header>
        <Ticker dir={-1}>
          {clientSet.map((p, i) => (
            <a className="mq__client" key={`${p.slug}${i}`} href={p.link} target="_blank" rel="noopener noreferrer" tabIndex={i >= clients.length ? -1 : 0}>
              <img src={p.shot} alt="" loading="lazy" />
              <span>{p.title}</span>
            </a>
          ))}
        </Ticker>
      </div>

      <div className="mq__block mq__block--tech">
        <header className="mq__head">
          <h2>Built with</h2>
        </header>
        <Ticker dir={1}>
          {techSet.map(([name, path], i) => (
            <span className="mq__tech" key={`${name}${i}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>
              <span>{name}</span>
            </span>
          ))}
        </Ticker>
      </div>
    </section>
  );
}
