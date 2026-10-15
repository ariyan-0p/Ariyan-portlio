import { useEffect, useRef, useState } from 'react';
import { gsap, lockScroll, unlockScroll } from '../lib/scroll';
import { PROJECTS } from '../data';

// Full-screen project overlay. Slides up over the page with a clip-path reveal.
export default function Case({ slug, onClose, onNav }) {
  const root = useRef(null);
  const [shown, setShown] = useState(null); // keeps content mounted during the exit animation
  const wasOpen = useRef(false);
  const idx = PROJECTS.findIndex((p) => p.slug === (slug || shown));
  const p = PROJECTS[idx];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];

  useEffect(() => {
    const el = root.current;
    if (slug) {
      setShown(slug);
      lockScroll();
      el.style.visibility = 'visible';
      el.scrollTop = 0;
      const swap = wasOpen.current; // switching projects: keep the panel, replay only the content
      wasOpen.current = true;
      const ctx = gsap.context(() => {
        if (!swap) gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'expo.inOut', overwrite: true });
        gsap.fromTo('.case__rise', { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out', delay: 0.45, overwrite: true });
        gsap.fromTo('.case__fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', delay: 0.6, overwrite: true });
        gsap.fromTo('.case__shot', { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out', delay: 0.5, overwrite: true });
      }, el);
      return () => ctx.revert();
    }
    if (shown) {
      wasOpen.current = false;
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut', overwrite: true,
        onComplete: () => { el.style.visibility = 'hidden'; setShown(null); unlockScroll(); },
      });
    }
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!slug) return undefined;
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(next.slug);
      if (e.key === 'ArrowLeft') onNav(prev.slug);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [slug, next, prev, onClose, onNav]);

  return (
    <div ref={root} className="case" data-lenis-prevent style={{ visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)', '--accent': p?.accent }} role="dialog" aria-modal="true" aria-label={p?.title}>
      {p && (
        <>
          <div className="case__top">
            <span className="case__crumb">Selected work / {p.id} — {String(PROJECTS.length).padStart(2, '0')}</span>
            <button className="case__close" onClick={onClose} data-cursor="CLOSE">Close <kbd>esc</kbd></button>
          </div>

          <div className="case__body">
            <div className="case__info">
              <div className="case__eyebrow case__fade"><i style={{ background: p.accent }} />{p.category}</div>
              <h3 className="case__title"><span className="case__mask"><span className="case__rise">{p.title}</span></span></h3>
              <p className="case__desc case__fade">{p.desc}</p>

              <dl className="case__meta case__fade">
                <div><dt>Year</dt><dd>{p.year}</dd></div>
                <div><dt>Type</dt><dd>{p.type}</dd></div>
                <div><dt>Role</dt><dd>Development</dd></div>
                <div><dt>Status</dt><dd><i className="dot" />Live</dd></div>
              </dl>

              <div className="case__tags case__fade">
                {p.tech.map((t) => <span key={t}>{t}</span>)}
              </div>

              <a className="btn btn--solid case__visit case__fade" href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
                <span>Visit {p.url}</span><i>↗</i>
              </a>
            </div>

            <div className="case__media">
              <div className="case__browser">
                <div className="wk__bar"><i /><i /><i /><span>{p.url}</span></div>
                <div className="case__shotwrap"><img className="case__shot" src={p.shot} alt={`${p.title} homepage`} /></div>
              </div>
            </div>
          </div>

          <div className="case__nav">
            <button onClick={() => onNav(prev.slug)} data-cursor="PREV"><span>← Previous</span><b>{prev.title}</b></button>
            <button onClick={() => onNav(next.slug)} data-cursor="NEXT" className="is-next"><span>Next →</span><b>{next.title}</b></button>
          </div>
        </>
      )}
    </div>
  );
}
