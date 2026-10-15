import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { PROJECTS } from '../data';

// [word, isSerifAccent]
const TEXT = [
  'I', 'don’t', 'fit', 'in', 'a', 'niche.', 'I', 'build', 'the', ['whole', 1], ['product', 1], '—',
  'interface,', 'server,', 'AI', 'and', 'the', 'pipeline', 'that', 'ships', 'it.', 'Fast,', 'considered,',
  'and', ['finished.', 1],
];

export default function Manifesto() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mf__w', { opacity: 0.12 }, {
        opacity: 1, stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: '.mf__text', start: 'top 78%', end: 'bottom 52%', scrub: true },
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

  const stats = [
    [PROJECTS.length, 'Products shipped', 'all live'],
    [3, 'Years building', 'since 2023'],
    [4, 'Engineering roles', 'dev · devops · ai'],
    [2, 'Platforms', 'web & mobile'],
  ];

  return (
    <section ref={root} className="mf" id="about">
      <div className="mf__idx"><span>(00)</span><span>Manifesto</span></div>
      <p className="mf__text">
        {TEXT.map((w, i) => {
          const [word, acc] = Array.isArray(w) ? w : [w, 0];
          return <span key={i} className={`mf__w ${acc ? 'is-serif' : ''}`}>{word} </span>;
        })}
      </p>
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
