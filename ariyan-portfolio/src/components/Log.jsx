import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger, getLenis, isIOS, pinStage } from '../lib/scroll';
import { LOG } from '../data';

// Experience as a pinned `git log --graph` + a live `git show <hash>` terminal.
// Scrolling steps through the commits; the terminal types each one out as a diff.

const N = LOG.length;

function buildLines(e) {
  const sentences = e.msg.split(/(?<=\.)\s+/).filter(Boolean);
  const lines = [
    { c: 'c-commit', t: `commit ${e.hash}${e.head ? ' (HEAD -> main, origin/main)' : ''}` },
    { c: 'c-dim', t: 'Author: Ariyan Samal' },
    { c: 'c-dim', t: `Date:   ${e.date}` },
    { c: '', t: '' },
    { c: 'c-role', t: `    ${e.role}` },
    { c: 'c-org', t: `    ${e.org} — ${e.place}` },
    { c: '', t: '' },
    ...sentences.map((s) => ({ c: 'c-add', t: `  + ${s}` })),
    { c: '', t: '' },
    { c: 'c-dim', t: e.kind === 'edu' ? '  tag: education' : '  tag: work' },
  ];
  return lines;
}

export default function Log() {
  const pin = useRef(null);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState({ for: -1, n: 0 });

  const work = LOG.filter((e) => e.kind === 'work').length;
  const years = new Date().getFullYear() - 2023;
  const e = LOG[active];
  const lines = useMemo(() => buildLines(e), [e]);
  const total = useMemo(() => lines.reduce((n, l) => n + l.t.length + 1, 0), [lines]);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: pin.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => setActive(Math.min(N - 1, Math.floor(self.progress * N * 0.999))),
    });
    return () => st.kill();
  }, []);

  // typewriter: restarts whenever the active commit changes
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += 7;
      setTyped({ for: active, n });
      if (n >= total) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [active, total]);
  const shown = typed.for === active ? typed.n : 0; // a new commit starts from nothing

  useEffect(() => (isIOS() ? pinStage(pin.current, pin.current.querySelector('.lg__stage')) : undefined), []);

  const jump = (i) => {
    const el = pin.current;
    const range = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / N) * range;
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.3 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // reveal `shown` characters across the lines
  const starts = lines.reduce((acc, l, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + lines[i - 1].t.length + 1); return acc; }, []);
  const rendered = lines.map((l, i) => {
    const take = Math.max(0, Math.min(l.t.length, shown - starts[i]));
    const done = shown - starts[i] > l.t.length;
    return (
      <div key={i} className={`lg__ln ${l.c}`}>
        {l.t.slice(0, take) || ' '}
        {!done && take > 0 && <i className="lg__caret" />}
      </div>
    );
  });
  const finished = shown >= total;

  return (
    <section id="log" className="lg">
      <div ref={pin} className="lg__pin" style={{ height: `${N * 80 + 100}vh` }}>
        <div className="lg__stage">
          <div className="lg__left">
            <div className="mf__idx"><span>(04)</span><span>Experience</span></div>
            <h2 className="lg__h">Where I’ve been <em>building.</em></h2>
            <div className="lg__meta">
              <span><b>{years}+</b> yrs</span><span><b>{String(work).padStart(2, '0')}</b> roles</span><span><b>{N}</b> commits</span>
            </div>

            <ol className="lg__graph" aria-label="Career commit graph">
              {LOG.map((c, i) => (
                <li key={c.hash} className={`lg__row ${c.kind === 'edu' ? 'is-edu' : 'is-work'} ${i === active ? 'is-on' : ''} ${i < active ? 'is-past' : ''} ${i === work - 1 ? 'is-fork' : ''} ${i === 0 ? 'is-first' : ''}`}>
                  <button onClick={() => jump(i)} data-cursor="CHECKOUT">
                    <span className="lg__lane"><i className="lg__node" /></span>
                    <span className="lg__lbl">
                      <code>{c.hash}</code>
                      <b>{c.role}</b>
                      <em>{c.org}</em>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg__right">
            <div className="lg__term">
              <div className="lg__bar"><i /><i /><i /><span>git show {e.hash}</span><em>{active + 1}/{N}</em></div>
              <div className="lg__body" aria-live="polite">
                <div className="lg__prompt"><b>$</b> git show {e.hash}</div>
                {rendered}
                {finished && <div className="lg__ln"><span className="c-prompt">$</span> <i className="lg__caret" /></div>}
              </div>
              <div className="lg__oneline">
                <div className="lg__ohead">$ git log --oneline</div>
                {LOG.map((c, i) => (
                  <button key={c.hash} className={i === active ? 'is-on' : ''} onClick={() => jump(i)} data-cursor="CHECKOUT">
                    <code>{c.hash}</code>
                    <span>{c.head && <u>HEAD</u>}{c.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
