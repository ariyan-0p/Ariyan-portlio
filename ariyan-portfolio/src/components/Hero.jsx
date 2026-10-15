import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, goTo, isTouch, reduceMotion } from '../lib/scroll';
import { createHeroParticles } from '../lib/particles';
import { PROFILE, PROJECTS } from '../data';

const STAGES = [
  { k: '01', label: 'Name', cap: 'Ariyan Samal — full-stack engineer' },
  { k: '02', label: 'Face', cap: 'Hello. Move your cursor — disturb the pixels' },
  { k: '03', label: 'Code', cap: 'Interface to infrastructure' },
];

export default function Hero({ warm, ready, onPalette, onCloud }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const wantReveal = useRef(false);
  const [stage, setStage] = useState(0);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!warm) return undefined;
    let dead = false;
    createHeroParticles(canvas.current, { photo: PROFILE.photo, mobile: isTouch(), onStage: setStage }).then((p) => {
      if (dead) { p && p.destroy(); return; }
      if (!p) { setFallback(true); return; }
      api.current = p;
      if (onCloud) onCloud();
      if (wantReveal.current) { p.reveal(); setTimeout(() => p.shock(0, 0), 120); }
    });
    return () => { dead = true; if (api.current) { api.current.destroy(); api.current = null; } };
  }, [warm, onCloud]);

  useEffect(() => {
    if (!ready) return undefined;
    wantReveal.current = true;
    if (api.current) { api.current.reveal(); setTimeout(() => api.current && api.current.shock(0, 0), 120); }
    const ctx = gsap.context(() => {
      const fast = reduceMotion();
      gsap.from('.hero__fade', { opacity: 0, y: 26, duration: fast ? 0.01 : 1, stagger: 0.1, ease: 'expo.out', delay: 1.6 });
      gsap.from('.hero__frame i', { scale: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out', delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // scroll: the cloud disperses
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom 25%', scrub: true,
      onUpdate: (self) => api.current && api.current.setDisperse(Math.min(1, self.progress * 1.1)),
    });
    return () => st.kill();
  }, []);

  const cur = STAGES[stage] || STAGES[0];

  return (
    <section id="top" ref={root} className={`hero ${fallback ? 'is-fallback' : ''}`}>
      <canvas ref={canvas} className="hero__canvas" aria-hidden="true" data-cursor="DISTURB" />
      <div className="hero__frame" aria-hidden="true"><i /><i /><i /><i /></div>

      <h1 className="hero__name">Ariyan Samal<span className="sr-only"> — full-stack engineer in Hyderabad, India</span></h1>

      <div className="hero__meta hero__fade">
        <span>{PROFILE.location}</span>
        <span>{PROFILE.coords}</span>
        <span className="hero__avail"><i className="dot" />Available — freelance & full-time</span>
      </div>

      <div className="hero__foot">
        <div className="hero__copy">
          <p className="hero__cap hero__fade" key={cur.k}><b>{cur.k}</b>{cur.cap}</p>
          <p className="hero__lede hero__fade">
            Building <em>whole products</em> — {PROJECTS.length} shipped, all live.
          </p>
          <div className="hero__cta hero__fade">
            <button className="btn btn--solid" onClick={() => goTo('work')} data-cursor="GO"><span>See the work</span><i>↓</i></button>
            <button className="btn" onClick={onPalette}><span>Command menu</span><kbd>⌘K</kbd></button>
          </div>
        </div>

        <div className="hero__stages hero__fade" role="tablist" aria-label="Hero form">
          {STAGES.map((s, i) => (
            <button key={s.k} role="tab" aria-selected={stage === i} className={stage === i ? 'is-on' : ''} onClick={() => api.current && api.current.goTo(i)} data-cursor="MORPH">
              <span>{s.k}</span>{s.label}<i />
            </button>
          ))}
          <em>click anywhere — shockwave</em>
        </div>
      </div>
    </section>
  );
}
