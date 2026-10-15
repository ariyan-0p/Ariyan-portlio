import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { CAPABILITIES } from '../data';

// Generative glyphs — one per capability, drawn as plain SVG.
function Glyph({ i }) {
  if (i === 0) {
    return (
      <svg viewBox="0 0 200 200" className="cap__glyph" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => (
          <rect key={`${r}${c}`} className="g-cell" x={14 + c * 30} y={14 + r * 30} width="22" height="22" rx={(r + c) % 3 === 0 ? 11 : 2} />
        )))}
        <path className="g-cursor" d="M120 110 L120 160 L134 148 L144 170 L152 166 L142 144 L160 142 Z" />
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg viewBox="0 0 200 200" className="cap__glyph" aria-hidden="true">
        {[40, 80, 120, 160].map((y, k) => (
          <g key={y}>
            <rect className="g-cell" x="20" y={y - 14} width="160" height="26" rx="4" />
            <circle className="g-dot" cx="36" cy={y - 1} r="4" style={{ animationDelay: `${k * 0.3}s` }} />
            <line className="g-line" x1="52" y1={y - 1} x2={90 + k * 20} y2={y - 1} />
          </g>
        ))}
      </svg>
    );
  }
  if (i === 2) {
    const pts = [[30, 150], [30, 100], [30, 50], [100, 120], [100, 70], [170, 100]];
    return (
      <svg viewBox="0 0 200 200" className="cap__glyph" aria-hidden="true">
        {pts.slice(0, 3).flatMap((a) => pts.slice(3, 5).map((b) => (
          <line key={`${a}${b}`} className="g-line" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        )))}
        {pts.slice(3, 5).map((a) => <line key={`o${a}`} className="g-line" x1={a[0]} y1={a[1]} x2={170} y2={100} />)}
        {pts.map(([x, y], k) => <circle key={k} className="g-dot" cx={x} cy={y} r="8" style={{ animationDelay: `${k * 0.2}s` }} />)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="cap__glyph" aria-hidden="true">
      {[0, 1, 2].map((k) => (
        <path key={k} className="g-cell" d={`M100 ${40 + k * 36} L170 ${64 + k * 36} L100 ${88 + k * 36} L30 ${64 + k * 36} Z`} />
      ))}
      <path className="g-line" d="M100 20 V40" />
      <circle className="g-dot" cx="100" cy="18" r="6" />
    </svg>
  );
}

export default function Capabilities() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.cap__card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector('.cap__inner'), {
          scale: 0.92, opacity: 0.35, ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 15%', scrub: true },
        });
      });
      gsap.from('.cap__head .ch__in', {
        yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: '.cap__head', start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const split = (t) => t.split('').map((c, i) => <span className="ch" key={i}><span className="ch__in">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <section id="capabilities" ref={root} className="cap">
      <div className="cap__head">
        <div className="mf__idx"><span>(02)</span><span>Capabilities</span></div>
        <h2 className="wk__title" aria-label="What I build with">
          <span className="line">{split('FOUR')}</span>
          <span className="line line--r">{split('DISCIPLINES')}</span>
        </h2>
      </div>

      <div className="cap__stack">
        {CAPABILITIES.map((c, i) => (
          <article className={`cap__card cap__card--${i}`} key={c.n} style={{ '--i': i }}>
            <div className="cap__inner">
              <div className="cap__n">{c.n}</div>
              <div className="cap__main">
                <div className="cap__sub">{c.sub}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul>{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <Glyph i={i} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
