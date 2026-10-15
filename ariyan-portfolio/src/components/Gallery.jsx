import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger, getLenis, isTouch } from '../lib/scroll';
import { createGallery } from '../lib/gallery';
import { PROJECTS } from '../data';

// Pinned WebGL stage. The tall wrapper provides the scroll distance; the sticky stage stays put.
export default function Gallery({ onOpen, onFallback }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const [active, setActive] = useState(0);
  const touch = isTouch();

  useEffect(() => {
    const g = createGallery(canvas.current, PROJECTS, {
      mobile: touch,
      onActive: setActive,
      onHover: (i) => {
        if (canvas.current) canvas.current.setAttribute('data-cursor', i >= 0 ? 'OPEN' : '');
      },
      onOpen: (i) => onOpen(PROJECTS[i].slug),
    });
    if (!g) { onFallback(); return undefined; }
    api.current = g;

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => g.setProgress(self.progress),
    });
    return () => { st.kill(); g.destroy(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = useCallback((i) => {
    const el = wrap.current;
    const lenis = getLenis();
    const range = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + (i / (PROJECTS.length - 1)) * range;
    if (lenis) lenis.scrollTo(y, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const cur = PROJECTS[active] || PROJECTS[0];

  return (
    <div ref={wrap} className="gal" style={{ height: `${PROJECTS.length * 85 + 100}vh` }}>
      <div className="gal__stage">
        <canvas ref={canvas} className="gal__canvas" aria-hidden="true" />

        <div className="gal__hud">
          <div className="gal__top">
            <span>{touch ? 'Scroll to fly · tap a plane to open' : 'Scroll to fly · click a plane to open'}</span>
            <span className="gal__count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(PROJECTS.length).padStart(2, '0')}</span>
          </div>

          <ol className="gal__ticks" aria-label="Jump to project">
            {PROJECTS.map((p, i) => (
              <li key={p.slug}>
                <button className={i === active ? 'is-on' : ''} onClick={() => jump(i)} aria-label={`Go to ${p.title}`} data-cursor="GO">
                  <span>{p.id}</span><i />
                </button>
              </li>
            ))}
          </ol>

          <div className="gal__info" key={cur.slug} style={{ '--accent': cur.accent }}>
            <div className="gal__cat"><i />{cur.category} — {cur.year}</div>
            <h3 className="gal__title"><span>{cur.title}</span></h3>
            <div className="gal__row">
              <div className="gal__tags">{cur.tech.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</div>
              <button className="btn btn--solid" onClick={() => onOpen(cur.slug)} data-cursor="OPEN"><span>Open case</span><i>↗</i></button>
            </div>
          </div>
        </div>

        <ul className="sr-only">
          {PROJECTS.map((p) => (
            <li key={p.slug}><a href={p.link} target="_blank" rel="noopener noreferrer">{p.title} — {p.category}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
