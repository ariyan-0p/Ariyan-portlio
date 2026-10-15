import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { LOG } from '../data';

// Experience rendered as `git log --graph`, beside a sticky summary panel.
export default function Log() {
  const root = useRef(null);

  const work = LOG.filter((e) => e.kind === 'work');
  const now = LOG.find((e) => e.head);
  const years = new Date().getFullYear() - 2023;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.log__rail i', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: '.log__list', start: 'top 70%', end: 'bottom 70%', scrub: true },
      });
      gsap.utils.toArray('.log__item').forEach((el) => {
        gsap.from(el.querySelectorAll('.log__rev'), {
          y: 44, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
        gsap.fromTo(el.querySelector('.log__node'), { scale: 0 }, {
          scale: 1, duration: 0.6, ease: 'back.out(2.4)',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });
      gsap.from('.log__side > *', {
        y: 36, opacity: 0, duration: 1, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: '.log__side', start: 'top 82%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="log" ref={root} className="log">
      <div className="log__wrap">
        <aside className="log__side">
          <div className="mf__idx"><span>(04)</span><span>Experience</span></div>
          <h2 className="log__h">Where I’ve been <em>building</em> — and what I shipped there.</h2>
          <p className="log__cmd"><b>$</b> git log --graph --oneline --career</p>

          <div className="log__stats">
            <div><b>{years}+</b><span>years building</span></div>
            <div><b>{String(work.length).padStart(2, '0')}</b><span>engineering roles</span></div>
            <div><b>{LOG.filter((e) => e.kind === 'edu').length}</b><span>degrees &amp; diplomas</span></div>
          </div>

          {now && (
            <div className="log__now">
              <span className="log__now-k"><i className="dot" />Currently</span>
              <b>{now.role}</b>
              <span>{now.org} — {now.place}</span>
            </div>
          )}
        </aside>

        <ol className="log__list">
          <div className="log__rail" aria-hidden="true"><i /></div>
          {LOG.map((e) => (
            <li className={`log__item ${e.kind === 'edu' ? 'is-edu' : ''}`} key={e.hash}>
              <div className="log__node" aria-hidden="true" />
              <div className="log__hash log__rev">
                <code>{e.hash}</code>
                {e.head && <span className="log__ref">HEAD → main</span>}
                {e.kind === 'edu' && <span className="log__ref is-tag">tag: education</span>}
              </div>
              <div className="log__card log__rev">
                <div className="log__date">{e.date}</div>
                <h3>{e.role}</h3>
                <div className="log__org">{e.org} <span>— {e.place}</span></div>
                <p>{e.msg}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
