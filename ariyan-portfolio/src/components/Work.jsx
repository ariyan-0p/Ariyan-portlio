import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, isTouch, reduceMotion, ScrollTrigger } from '../lib/scroll';
import { PROJECTS, FILTERS } from '../data';
import Case from './Case';

const Gallery = lazy(() => import('./Gallery'));

export default function Work({ openSlug, setOpenSlug }) {
  const root = useRef(null);
  const preview = useRef(null);
  const [filter, setFilter] = useState('All');
  const [mode, setMode] = useState(() => (reduceMotion() ? 'list' : 'fly'));
  const [hover, setHover] = useState(null);
  const [near, setNear] = useState(() => !isTouch()); // phones: build the 3D scene only when you get close
  const slot = useRef(null);
  const touch = useMemo(() => isTouch(), []);

  // header + row reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wk__title .ch__in', {
        yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: '.wk__title', start: 'top 85%' },
      });
      gsap.utils.toArray('.wk__row').forEach((row) => {
        gsap.from(row.querySelectorAll('.wk__cell'), {
          y: 36, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 94%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // cursor-following preview
  useEffect(() => {
    const el = preview.current;
    if (touch || !el) return undefined;
    gsap.set(el, { autoAlpha: 0, scale: 0.8 });
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    const rot = gsap.quickTo(el, 'rotate', { duration: 0.6, ease: 'power3' });
    let last = 0;
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
      rot(Math.max(-9, Math.min(9, (e.clientX - last) * 0.35)));
      last = e.clientX;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [touch, mode]);

  useEffect(() => {
    if (near || mode !== 'fly' || !slot.current) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '450px 0px' });
    io.observe(slot.current);
    return () => io.disconnect();
  }, [near, mode]);

  // the section's height changes between views
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [mode]);

  const enter = useCallback((slug) => {
    setHover(slug);
    if (preview.current) gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
  }, []);
  const leave = useCallback(() => {
    setHover(null);
    if (preview.current) gsap.to(preview.current, { autoAlpha: 0, scale: 0.8, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
  }, []);

  const split = (t) => t.split('').map((c, i) => <span className="ch" key={i}><span className="ch__in">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <section id="work" ref={root} className={`wk ${mode === 'fly' ? 'has-gal' : ''}`}>
      <div className="wk__head">
        <div className="mf__idx"><span>(01)</span><span>Portfolio</span></div>
        <h2 className="wk__title" aria-label="Things I shipped">
          <span className="line">{split('THINGS I')}</span>
          <span className="line line--r">{split('SHIPPED')}<sup>{String(PROJECTS.length).padStart(2, '0')}</sup></span>
        </h2>
        <div className="wk__bar2">
        <div className="wk__mode" role="tablist" aria-label="View">
          <button role="tab" aria-selected={mode === 'fly'} className={mode === 'fly' ? 'is-on' : ''} onClick={() => setMode('fly')}>◉ Fly-through</button>
          <button role="tab" aria-selected={mode === 'list'} className={mode === 'list' ? 'is-on' : ''} onClick={() => setMode('list')}>≡ Index</button>
        </div>
        {mode === 'list' && <div className="wk__filters" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={filter === f ? 'is-on' : ''}
              onClick={() => setFilter(f)}
             
            >
              {f}
              <sup>{f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.type === f).length}</sup>
            </button>
          ))}
        </div>}
        </div>
      </div>

      {mode === 'fly' && (near ? (
        <Suspense fallback={<div className="gal" style={{ height: `${PROJECTS.length * 85 + 100}vh` }} aria-hidden="true" />}>
          <Gallery onOpen={setOpenSlug} onFallback={() => setMode('list')} />
        </Suspense>
      ) : (
        <div ref={slot} className="gal" style={{ height: `${PROJECTS.length * 85 + 100}vh` }} aria-hidden="true" />
      ))}

      {mode === 'list' && <ul className={`wk__list ${hover ? 'has-hover' : ''}`}>
        {PROJECTS.map((p) => {
          const off = filter !== 'All' && p.type !== filter;
          return (
            <li key={p.slug} className={`wk__li ${off ? 'is-off' : ''}`}>
              <button
                className={`wk__row ${hover === p.slug ? 'is-hover' : ''}`}
                onMouseEnter={() => !touch && enter(p.slug)}
                onMouseLeave={leave}
                onFocus={() => !touch && enter(p.slug)}
                onBlur={leave}
                onClick={() => { leave(); setOpenSlug(p.slug); }}
               
                style={{ '--accent': p.accent }}
                tabIndex={off ? -1 : 0}
              >
                <span className="wk__cell wk__n">{p.id}</span>
                <span className="wk__cell wk__name">
                  {p.title}
                  {p.featured && <i className="wk__star" title="Featured">✦</i>}
                </span>
                <span className="wk__cell wk__cat">{p.category}</span>
                <span className="wk__cell wk__tech">{p.tech.slice(0, 3).join(' · ')}</span>
                <span className="wk__cell wk__yr">{p.year}</span>
                <span className="wk__cell wk__go" aria-hidden="true">↗</span>
                {touch && <img className="wk__thumb" src={p.shot} alt="" loading="lazy" />}
              </button>
            </li>
          );
        })}
      </ul>}

      {mode === 'list' && <div ref={preview} className="wk__preview" aria-hidden="true">
        <div className="wk__frame">
          <div className="wk__bar"><i /><i /><i /><span>{PROJECTS.find((p) => p.slug === hover)?.url}</span></div>
          <div className="wk__imgs">
            {PROJECTS.map((p) => (
              <img key={p.slug} src={p.shot} alt="" className={hover === p.slug ? 'is-on' : ''} />
            ))}
          </div>
        </div>
      </div>}

      <Case slug={openSlug} onClose={() => setOpenSlug(null)} onNav={setOpenSlug} />
    </section>
  );
}
