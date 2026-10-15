import { useEffect, useMemo, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/scroll';
import { PROFILE, PROJECTS } from '../data';

const LINES = [
  ['ariyan.sys', 'v3.0 — booting'],
  ['mount /work', `${PROJECTS.length} products found`],
  ['link  /stack', 'react · node · flutter · ai'],
  ['compile', 'shaders · particles · type'],
];
const RING = 'ARIYAN SAMAL ✦ FULL-STACK ENGINEER ✦ HYDERABAD ✦ AVAILABLE ✦ ';

// Preloads the real assets (fonts, portrait, every project screenshot) and reports 0..1.
function trackAssets(onProgress) {
  const urls = [PROFILE.photo, ...PROJECTS.map((p) => p.shot)];
  const total = urls.length + 1;
  let done = 0;
  const tick = () => { done += 1; onProgress(done / total); };
  urls.forEach((u) => {
    const img = new Image();
    img.onload = tick;
    img.onerror = tick;
    img.src = u;
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tick, tick); else tick();
}

export default function Loader({ onReveal, onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);

  // square tiles that cover the screen; ~11% are orange so the reveal sparkles
  const grid = useMemo(() => {
    const cols = window.innerWidth < 700 ? 9 : 16;
    const size = window.innerWidth / cols;
    const rows = Math.ceil(window.innerHeight / size) + 1;
    const tiles = Array.from({ length: cols * rows }, (_, i) => ({ i, hot: (i * 7919) % 97 < 11 }));
    return { cols, rows, size, tiles };
  }, []);

  useEffect(() => {
    const fast = reduceMotion();
    const MIN = fast ? 0.3 : 2.4;
    let assets = 0;
    trackAssets((p) => { assets = p; });
    const failsafe = setTimeout(() => { assets = 1; }, 7000);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      const tl0 = gsap.timeline();
      tl0.from(q('.boot__ring'), { scale: 0.55, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0);
      tl0.from(q('.boot__tick'), { opacity: 0, scale: 0.9, duration: 1.2, ease: 'expo.out' }, 0.1);
      tl0.fromTo(q('.boot__mono path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.25, ease: 'power2.inOut' }, 0.2);
      tl0.from(q('.boot__row'), { opacity: 0, x: -14, duration: 0.5, stagger: 0.38 }, 0.25);
      tl0.from(q('.boot__meta'), { opacity: 0, y: 14, duration: 0.8 }, 0.6);
      const spin = gsap.to(q('.boot__ringtext'), { rotation: 360, svgOrigin: '210 210', duration: 16, ease: 'none', repeat: -1 });
      gsap.to(q('.boot__tick'), { rotation: -360, transformOrigin: '50% 50%', duration: 40, ease: 'none', repeat: -1 });

      const st = { shown: 0, t: 0, exiting: false };
      const el = count.current;
      const tickFn = (_, dt) => {
        if (st.exiting) return;
        st.t += dt / 1000;
        const target = Math.min(assets, Math.min(1, st.t / MIN)) * 100;
        st.shown += (target - st.shown) * Math.min(1, dt / 120);
        const n = Math.min(100, Math.round(st.shown));
        el.textContent = String(n).padStart(3, '0');
        bar.current.style.transform = `scaleX(${n / 100})`;
        // glitchy RGB split on the counter
        if (Math.random() < 0.16) {
          const a = (Math.random() - 0.5) * 14;
          el.style.textShadow = `${a}px 0 var(--sig), ${-a}px 0 #4ee`;
        } else if (Math.random() < 0.3) el.style.textShadow = 'none';
        if (n >= 100 && st.t >= MIN) { st.exiting = true; exit(); }
      };

      function exit() {
        gsap.ticker.remove(tickFn);
        el.textContent = '100';
        el.style.textShadow = 'none';
        const tl = gsap.timeline({ onComplete: () => { root.current.style.display = 'none'; onDone && onDone(); } });
        spin.timeScale(6);
        tl.to(q('.boot__log, .boot__meta, .boot__count'), { opacity: 0, y: 20, duration: 0.4, ease: 'power2.in' }, 0);
        tl.to(q('.boot__ring'), { scale: 1.9, opacity: 0, duration: 0.9, ease: 'expo.in' }, 0);
        tl.to(q('.boot__tick'), { scale: 2.4, opacity: 0, duration: 0.9, ease: 'expo.in' }, 0);
        // dive through the monogram
        tl.to(q('.boot__mono'), { scale: 26, duration: 0.95, ease: 'expo.in', transformOrigin: '50% 50%' }, 0.1);
        tl.to(q('.boot__mono'), { opacity: 0, duration: 0.25 }, 0.95);
        // tiles collapse from the centre, hero is revealed underneath
        tl.to(q('.boot__tile.is-hot'), { backgroundColor: '#ff4d1f', duration: 0.25, stagger: { amount: 0.5, from: 'center' } }, 0.6);
        tl.add(() => onReveal && onReveal(), 0.95);
        tl.to(q('.boot__tile'), {
          scale: 0, duration: 0.8, ease: 'power3.inOut',
          stagger: { amount: 0.85, from: 'center', grid: [grid.rows, grid.cols] },
        }, 0.95);
      }
      gsap.ticker.add(tickFn);
      return () => { gsap.ticker.remove(tickFn); };
    }, root);
    return () => { clearTimeout(failsafe); ctx.revert(); };
  }, [grid, onReveal, onDone]);

  return (
    <div ref={root} className="boot" aria-hidden="true">
      <div className="boot__tiles" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridAutoRows: `${grid.size}px` }}>
        {grid.tiles.map((t) => <i key={t.i} className={`boot__tile ${t.hot ? 'is-hot' : ''}`} />)}
      </div>

      <div className="boot__ui">
        <div className="boot__log">
          {LINES.map(([k, v]) => (
            <div className="boot__row" key={k}>
              <span className="boot__k">&gt; {k}</span>
              <span className="boot__dots" />
              <span className="boot__v">{v}</span>
            </div>
          ))}
        </div>

        <div className="boot__center">
          <svg className="boot__tick" viewBox="0 0 420 420">
            <circle cx="210" cy="210" r="196" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" opacity=".55" />
            <circle cx="210" cy="210" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity=".25" />
          </svg>
          <svg className="boot__ring" viewBox="0 0 420 420">
            <defs><path id="ringpath" d="M210 210 m-178 0 a178 178 0 1 1 356 0 a178 178 0 1 1 -356 0" /></defs>
            <g className="boot__ringtext">
              <text><textPath href="#ringpath" startOffset="0" textLength="1100" lengthAdjust="spacing">{RING}</textPath></text>
            </g>
          </svg>
          <svg className="boot__mono" viewBox="0 0 100 100">
            <path pathLength="1" d="M50 5 L93.3 25 V75 L50 95 L6.7 75 V25 Z" />
            <path pathLength="1" d="M25 75 L40 30 L55 75 M32 60 H48" />
            <path pathLength="1" d="M80 35 H60 L60 52 H80 L80 75 H60" />
          </svg>
        </div>

        <div className="boot__foot">
          <div ref={count} className="boot__count">000</div>
          <div className="boot__meta">
            <span>Ariyan Samal — Portfolio ’26</span>
            <div className="boot__bar"><i ref={bar} /></div>
            <span className="boot__hint">loading assets · {PROJECTS.length} projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
