import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, getLenis, isIOS, pinStage } from '../lib/scroll';
import { CAPABILITIES, PROJECTS } from '../data';

// Flat drawings that sit on each slab of the exploded stack.
function Slab({ kind }) {
  return (
    <svg viewBox="0 0 320 320" className="slab__art" aria-hidden="true">
      {kind === 0 && (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="22" y="22" width="276" height="276" rx="10" />
          <path d="M22 62H298" />
          <circle cx="44" cy="42" r="5" fill="currentColor" /><circle cx="62" cy="42" r="5" /><circle cx="80" cy="42" r="5" />
          <rect x="44" y="84" width="232" height="92" rx="6" />
          <rect x="44" y="196" width="68" height="80" rx="6" /><rect x="126" y="196" width="68" height="80" rx="6" /><rect x="208" y="196" width="68" height="80" rx="6" />
          <path className="slab__cursor" d="M210 120 L210 168 L224 156 L234 178 L242 174 L232 152 L250 150 Z" fill="currentColor" stroke="none" />
        </g>
      )}
      {kind === 1 && (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          {[48, 106, 164, 222].map((y, i) => (
            <g key={y}>
              <rect x="28" y={y} width="264" height="42" rx="6" />
              <circle className="slab__blink" style={{ animationDelay: `${i * 0.35}s` }} cx="52" cy={y + 21} r="7" fill="currentColor" stroke="none" />
              <path d={`M76 ${y + 21}H${150 + i * 28}`} />
              <path d={`M252 ${y + 21}H272`} />
            </g>
          ))}
        </g>
      )}
      {kind === 2 && (
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          {[[60, 80], [60, 160], [60, 240]].flatMap((a) => [[160, 60], [160, 125], [160, 195], [160, 260]].map((b) => (
            <path key={`${a}${b}`} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} opacity=".5" />
          )))}
          {[[160, 60], [160, 125], [160, 195], [160, 260]].flatMap((a) => [[260, 100], [260, 220]].map((b) => (
            <path key={`${a}${b}x`} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} opacity=".5" />
          )))}
          {[[60, 80], [60, 160], [60, 240], [160, 60], [160, 125], [160, 195], [160, 260], [260, 100], [260, 220]].map(([x, y], i) => (
            <circle key={i} className="slab__blink" style={{ animationDelay: `${i * 0.22}s` }} cx={x} cy={y} r="11" fill="currentColor" />
          ))}
        </g>
      )}
      {kind === 3 && (
        <g fill="none" stroke="currentColor" strokeWidth="3">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={28 + i * 98} y="116" width="76" height="88" rx="8" />
              <path d={`M${44 + i * 98} 160L${58 + i * 98} 176L${84 + i * 98} 142`} strokeWidth="4" />
              {i < 2 && <path d={`M${106 + i * 98} 160H${124 + i * 98}M${118 + i * 98} 152L${126 + i * 98} 160L${118 + i * 98} 168`} />}
            </g>
          ))}
          <path d="M28 240H292" strokeDasharray="6 8" />
          <path d="M28 70H200" strokeDasharray="6 8" />
        </g>
      )}
    </svg>
  );
}

const LABELS = ['L4 — INTERFACE', 'L3 — SERVER', 'L2 — INTELLIGENCE', 'L1 — DELIVERY'];

export default function Manifesto() {
  const root = useRef(null);
  const pin = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const iso = root.current.querySelector('.mf__iso');
      ScrollTrigger.create({
        trigger: pin.current, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          const open = Math.min(1, p / 0.16); // intro: the stack explodes open
          iso.style.setProperty('--open', open.toFixed(3));
          iso.style.setProperty('--spin', (-38 + p * 20).toFixed(2));
          const idx = Math.min(CAPABILITIES.length - 1, Math.max(0, Math.floor((p - 0.12) / 0.22)));
          setActive(idx);
        },
      });
      gsap.from('.mf__stat', {
        y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '.mf__stats', start: 'top 88%' },
      });
      gsap.utils.toArray('.mf__num').forEach((el) => {
        const end = +el.dataset.n;
        const o = { v: 0 };
        gsap.to(o, {
          v: end, duration: 1.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(2, '0'); },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => (isIOS() ? pinStage(pin.current, pin.current.querySelector('.mf__stage')) : undefined), []);

  const jump = (i) => {
    const el = pin.current;
    const range = el.offsetHeight - window.innerHeight;
    const p = 0.12 + i * 0.22 + 0.11;
    const y = el.getBoundingClientRect().top + window.scrollY + p * range;
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const stats = [
    [PROJECTS.length, 'Products shipped', 'all live'],
    [3, 'Years building', 'since 2023'],
    [4, 'Engineering roles', 'dev · devops · ai'],
    [2, 'Platforms', 'web & mobile'],
  ];

  return (
    <section ref={root} className="mf" id="capabilities">
      <div ref={pin} className="mf__pin">
        <div className="mf__stage">
          <div className="mf__left">
            <div className="mf__idx"><span>(02)</span><span>The whole product</span></div>
            <h2 className="mf__h">I don’t fit in a niche. I build <em>the whole product.</em></h2>
            <ol className="mf__layers">
              {CAPABILITIES.map((c, i) => (
                <li key={c.n} className={i === active ? 'is-on' : ''}>
                  <button onClick={() => jump(i)} data-cursor="LAYER">
                    <span className="mf__n">{c.n}</span>
                    <span className="mf__name">{c.title}</span>
                  </button>
                  <div className="mf__more">
                    <div>
                      <p>{c.desc}</p>
                      <ul>{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mf__right" aria-hidden="true">
            <div className="mf__iso" style={{ '--open': 0, '--spin': -38 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`slab ${active === i ? 'is-on' : ''}`} style={{ '--z': 3 - i }}>
                  <span className="slab__label">{LABELS[i]}</span>
                  <Slab kind={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mf__stats">
        {stats.map(([n, a, b]) => (
          <div className="mf__stat" key={a}>
            <div className="mf__num" data-n={n}>00</div>
            <div className="mf__cap"><b>{a}</b><span>{b}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
