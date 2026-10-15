import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, getLenis } from '../lib/scroll';
import { PROJECTS } from '../data';

const STEPS = [
  { n: '01', name: 'Brief', url: 'sketch — paper', desc: 'Listen first. Goals, users and constraints — a one-page plan before a single pixel moves.', tags: ['Discovery', 'Scope', 'Success metrics'] },
  { n: '02', name: 'Wireframe', url: 'wireframe — grid', desc: 'Structure before style. Flows, layout and content hierarchy, argued over while it is still cheap to change.', tags: ['Flows', 'Layout', 'Content'] },
  { n: '03', name: 'Design', url: 'design — system', desc: 'A visual system with a point of view: type, colour and motion, drawn so it can actually be built.', tags: ['Type', 'Colour', 'Motion'] },
  { n: '04', name: 'Build', url: 'localhost:5173', desc: 'Production code, not prototypes. Typed APIs, tests and a performance budget from the first commit.', tags: ['React', 'Node', 'Tests'] },
  { n: '05', name: 'Ship', url: 'griplindia.com', desc: 'CI/CD to the cloud, monitoring and a clean handover — then iterate on how people really use it.', tags: ['CI/CD', 'AWS', 'Monitoring'] },
];

const SHOT = PROJECTS.find((p) => p.slug === 'gripl');

export default function Process() {
  const pin = useRef(null);
  const [s, setS] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: pin.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => setS(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999))),
    });
    return () => st.kill();
  }, []);

  const jump = (i) => {
    const el = pin.current;
    const range = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / STEPS.length) * range;
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.3 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section id="process" className="pr">
      <div ref={pin} className="pr__pin">
        <div className="pr__stage">
          <div className="pr__visual" aria-hidden="true">
            <div className="pm" data-s={s}>
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

                <img className="pm__shot" src={SHOT.shot} alt="" />

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
          </div>

          <div className="pr__right">
            <div className="mf__idx"><span>(01)</span><span>Process</span></div>
            <h2 className="pr__h">From a blank page to <em>live</em> — the way I work.</h2>
            <ol className="pr__steps">
              {STEPS.map((p, i) => (
                <li key={p.n} className={i === s ? 'is-on' : i < s ? 'is-done' : ''}>
                  <button onClick={() => jump(i)} data-cursor="STEP">
                    <span className="pr__n">{p.n}</span>
                    <span className="pr__name">{p.name}</span>
                    <i />
                  </button>
                  <div className="pr__more">
                    <div>
                      <p>{p.desc}</p>
                      <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
