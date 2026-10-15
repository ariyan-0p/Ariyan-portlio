import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { LOG } from '../data';

// Experience rendered as `git log --graph`.
export default function Log() {
  const root = useRef(null);

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
      gsap.from('.log__head .ch__in', {
        yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: '.log__head', start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const split = (t) => t.split('').map((c, i) => <span className="ch" key={i}><span className="ch__in">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <section id="log" ref={root} className="log">
      <div className="log__head">
        <div className="mf__idx"><span>(03)</span><span>Experience</span></div>
        <h2 className="wk__title" aria-label="Git log">
          <span className="line">{split('GIT')}</span>
          <span className="line line--r">{split('LOG')}</span>
        </h2>
        <p className="log__cmd"><b>$</b> git log --graph --oneline --career</p>
      </div>

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
    </section>
  );
}
