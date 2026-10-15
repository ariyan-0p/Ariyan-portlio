import { useEffect, useRef } from 'react';
import { gsap, goTo, reduceMotion } from '../lib/scroll';
import { mountDither } from '../lib/dither';
import { PROFILE, PROJECTS } from '../data';

const Chars = ({ text }) =>
  text.split('').map((c, i) => (
    <span className="ch" key={i}><span className="ch__in">{c}</span></span>
  ));

export default function Hero({ ready, onPalette }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const dither = useRef(null);

  useEffect(() => {
    dither.current = canvas.current ? mountDither(canvas.current, PROFILE.photo) : null;
    if (!dither.current && canvas.current) canvas.current.classList.add('is-fallback');
    return () => dither.current && dither.current.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      const fast = reduceMotion();
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.ch__in', { yPercent: 115, rotate: 4, duration: fast ? 0.01 : 1.3, stagger: 0.06 }, 0.05);
      tl.from('.hero__fade', { opacity: 0, y: 18, duration: fast ? 0.01 : 0.9, stagger: 0.09 }, 0.5);
      tl.from('.hero__frame i', { scale: 0, duration: 0.6, stagger: 0.05 }, 0.3);
      if (dither.current) dither.current.reveal();
      else tl.from(canvas.current, { opacity: 0, duration: 1 }, 0.3);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // parallax: portrait drifts slower than the page
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero__portrait', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__name', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="hero">
      <div className="hero__frame" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="hero__meta hero__fade">
        <span>{PROFILE.location}</span>
        <span>{PROFILE.coords}</span>
        <span className="hero__avail"><i className="dot" />Available — freelance & full-time</span>
      </div>

      <div className="hero__portrait" data-cursor="FOCUS">
        <canvas ref={canvas} />
        <img src={PROFILE.photo} alt="Ariyan Samal" className="hero__fallback" />
        <div className="hero__tag hero__fade"><b>FIG.01</b> Move to focus</div>
      </div>

      <h1 className="hero__name" aria-label="Ariyan Samal">
        <span className="line line--a"><Chars text="ARIYAN" /></span>
        <span className="line line--b"><Chars text="SAMAL" /><sup className="hero__reg hero__fade">®</sup></span>
      </h1>

      <div className="hero__foot">
        <p className="hero__lede hero__fade">
          Full-stack engineer building <em>whole products</em> — interface to infrastructure. {PROJECTS.length} shipped, all live.
        </p>
        <div className="hero__cta hero__fade">
          <button className="btn btn--solid" onClick={() => goTo('work')} data-cursor="GO"><span>See the work</span><i>↓</i></button>
          <button className="btn" onClick={onPalette}><span>Command menu</span><kbd>⌘K</kbd></button>
        </div>
        <div className="hero__scroll hero__fade" aria-hidden="true"><span>Scroll</span><i /></div>
      </div>
    </section>
  );
}
