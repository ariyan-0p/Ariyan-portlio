import { useEffect, useRef } from 'react';
import { gsap, isIOS, pinCards } from '../lib/scroll';
import { PROJECTS } from '../data';

const STEPS = [
  { n: '01', name: 'Brief', url: 'sketch — paper', sub: 'Listen first', desc: 'Goals, users and constraints — a one-page plan before a single pixel moves.', tags: ['Discovery', 'Scope', 'Success metrics'] },
  { n: '02', name: 'Wireframe', url: 'wireframe — grid', sub: 'Structure before style', desc: 'Flows, layout and content hierarchy, argued over while it is still cheap to change.', tags: ['Flows', 'Layout', 'Content'] },
  { n: '03', name: 'Design', url: 'design — system', sub: 'A point of view', desc: 'A visual system with taste: type, colour and motion, drawn so it can actually be built.', tags: ['Type', 'Colour', 'Motion'] },
  { n: '04', name: 'Build', url: 'localhost:5173', sub: 'Production, not prototypes', desc: 'Typed APIs, tests and a performance budget from the first commit.', tags: ['React', 'Node', 'Tests'] },
  { n: '05', name: 'Ship', url: 'griplindia.com', sub: 'And keep going', desc: 'CI/CD to the cloud, monitoring and a clean handover — then iterate on real usage.', tags: ['CI/CD', 'AWS', 'Monitoring'] },
];

const SHOT = PROJECTS.find((p) => p.slug === 'gripl');

function Mock({ s }) {
  return (
    <div className="pm" data-s={s} aria-hidden="true">
      <div className="pm__bar">
        <i /><i /><i /><span>{STEPS[s].url}</span>
        <b className="pm__live"><u />LIVE</b>
      </div>
      <div className="pm__body">
        <div className="pm__nav">
          <span className="pm__el pm__logo" />
          <span className="pm__links"><span className="pm__el" /><span className="pm__el" /><span className="pm__el" /><span className="pm__el pm__cta" /></span>
        </div>
        <div className="pm__hero">
          <div className="pm__copy">
            <span className="pm__el pm__h" /><span className="pm__el pm__h pm__h--s" />
            <span className="pm__el pm__p" /><span className="pm__el pm__p pm__p--s" />
            <span className="pm__el pm__btn" />
          </div>
          <div className="pm__el pm__img"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0L100 60M100 0L0 60" /></svg></div>
        </div>
        <div className="pm__cards">
          <span className="pm__el pm__card" /><span className="pm__el pm__card" /><span className="pm__el pm__card" />
        </div>
        <div className="pm__note pm__note--a">who is it for?</div>
        <div className="pm__note pm__note--b">one clear action →</div>
        <div className="pm__note pm__note--c">mobile first</div>
        <div className="pm__dim pm__dim--w">1440</div>
        <div className="pm__dim pm__dim--g">12 col</div>
        <img className="pm__shot" src={SHOT.shot} alt="" loading="lazy" />
        <div className="pm__code">
          <p><em>export default function</em> Quote() {'{'}</p>
          <p>&nbsp;&nbsp;<em>const</em> [items] = <b>useCart</b>()</p>
          <p>&nbsp;&nbsp;<em>const</em> total = <b>price</b>(items)</p>
          <p>&nbsp;&nbsp;<em>return</em> &lt;<b>Estimate</b> total={'{total}'} /&gt;</p>
          <p>{'}'}</p>
          <p className="ok">✓ tests passing</p>
          <p className="ok">✓ lint clean</p>
          <p className="ok">✓ build ok</p>
        </div>
        <div className="pm__toast"><span>✓ build</span><span>✓ deploy</span><span>→ live</span></div>
      </div>
    </div>
  );
}

export default function Process() {
  const root = useRef(null);

  useEffect(() => {
    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.prc__card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector('.prc__inner'), {
          scale: 0.93, opacity: 0.4, ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top 88%', end: 'top 14%', scrub: true },
        });
      });
      if (isIOS()) {
        const stack = root.current.querySelector('.prc__stack');
        cleanup = pinCards(cards, stack);
      }
      gsap.from('.prc__head .ch__in', {
        yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: '.prc__head', start: 'top 85%' },
      });
    }, root);
    return () => { cleanup(); ctx.revert(); };
  }, []);

  const split = (t) => t.split('').map((c, i) => <span className="ch" key={i}><span className="ch__in">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <section id="process" ref={root} className="prc">
      <div className="prc__head">
        <div className="mf__idx"><span>(03)</span><span>Process</span></div>
        <h2 className="wk__title" aria-label="From blank page to live">
          <span className="line">{split('BLANK PAGE')}</span>
          <span className="line line--r">{split('TO LIVE')}</span>
        </h2>
      </div>

      <div className="prc__stack">
        {STEPS.map((p, i) => (
          <article className={`prc__card prc__card--${i}`} key={p.n} style={{ '--i': i }}>
            <div className="prc__inner">
              <div className="prc__n">{p.n} <span>/ 05</span></div>
              <div className="prc__main">
                <div className="prc__sub">{p.sub}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div className="prc__visual"><Mock s={i} /></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
