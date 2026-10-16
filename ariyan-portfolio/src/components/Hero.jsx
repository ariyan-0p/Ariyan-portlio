import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, goTo, isTouch, reduceMotion } from '../lib/scroll';
import { PROFILE } from '../data';

export default function Hero({ warm, ready, onPalette, onCloud }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const wantReveal = useRef(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!warm) return undefined;
    let dead = false;
    import('../lib/particles').then((m) => m.createHeroParticles(canvas.current, { photo: PROFILE.photo, mobile: isTouch() })).then((p) => {
      if (dead) { p && p.destroy(); return; }
      if (!p) { setFallback(true); return; }
      api.current = p;
      if (onCloud) onCloud();
      if (wantReveal.current) p.reveal(reduceMotion() ? 0.2 : 3.4);
    });
    return () => { dead = true; if (api.current) { api.current.destroy(); api.current = null; } };
  }, [warm, onCloud]);

  useEffect(() => {
    if (!ready) return undefined;
    wantReveal.current = true;
    if (api.current) api.current.reveal(reduceMotion() ? 0.2 : 3.4);
    const ctx = gsap.context(() => {
      const fast = reduceMotion();
      gsap.fromTo('.hero__canvas', { scale: 1.35, opacity: 0.2 }, { scale: 1, opacity: 1, duration: fast ? 0.01 : 2.2, ease: 'expo.out' });
      gsap.from('.hero__fade', { opacity: 0, y: 26, duration: fast ? 0.01 : 1, stagger: 0.1, ease: 'expo.out', delay: 1.6 });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // the preloader's screen shatters: send a full-strength shockwave through the cloud
  useEffect(() => {
    const hit = () => { if (api.current) api.current.shock(0, 0, 1); };
    window.addEventListener('hero:impact', hit);
    return () => window.removeEventListener('hero:impact', hit);
  }, []);

  // scroll: the cloud disperses
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom 25%', scrub: true,
      onUpdate: (self) => api.current && api.current.setDisperse(Math.min(1, self.progress * 1.1)),
    });
    return () => st.kill();
  }, []);

  return (
    <section id="top" ref={root} className={`hero ${fallback ? 'is-fallback' : ''}`}>
      <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />

      <h1 className="hero__name">Ariyan Samal<span className="sr-only"> — full-stack engineer in Hyderabad, India</span></h1>

      <div className="hero__foot">
        <div className="hero__copy">
          <div className="hero__cta hero__fade">
            <button className="btn btn--solid" onClick={() => goTo('work')}><span>See the work</span><i>↓</i></button>
            <button className="btn" onClick={onPalette}><span>Command menu</span><kbd>⌘K</kbd></button>
          </div>
        </div>
      </div>
    </section>
  );
}
