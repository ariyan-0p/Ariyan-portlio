import { useEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/scroll';
import { PROFILE, PROJECTS } from '../data';

// A fake "hack-in" terminal that is secretly doing real work: it preloads the fonts, the portrait
// and every project screenshot, and reads the visitor's viewport / cores / timezone locally.

const boxed = (rows) => {
  const w = Math.max(...rows.map((r) => [...r].length)) + 6;
  const pad = (r) => { const n = w - [...r].length; const l = Math.floor(n / 2); return '║' + ' '.repeat(l) + r + ' '.repeat(n - l) + '║'; };
  return ['╔' + '═'.repeat(w) + '╗', ...rows.map(pad), '╚' + '═'.repeat(w) + '╝'].join('\n');
};
const BANNER = boxed(['A R I Y A N   S A M A L', 'full-stack engineer · interface → infra', 'portfolio v3.0 · 2026']);

const ASSETS = [
  ['ariyan.jpg', PROFILE.photo],
  ...PROJECTS.map((p) => [`${p.slug}.jpg`, p.shot]),
];

const HEX = '0123456789abcdef';
const hexByte = () => HEX[(Math.random() * 16) | 0] + HEX[(Math.random() * 16) | 0];
const WORDS = ['ariyan', 'react ', 'three ', 'gsap  ', 'node  ', 'flutter', 'webgl ', 'shader', 'build ', 'ship  '];

function hexLine(n) {
  const addr = (n * 16).toString(16).padStart(6, '0');
  const bytes = Array.from({ length: 12 }, hexByte);
  const ascii = Array.from({ length: 12 }, () => (Math.random() < 0.18 ? WORDS[(Math.random() * WORDS.length) | 0][0] : '.')).join('');
  return `<b>0x${addr}</b>  ${bytes.join(' ')}  <i>|${ascii}|</i>`;
}

export default function Loader({ onWarm, cloudReady, onReveal, onDone }) {
  const root = useRef(null);
  const crt = useRef(null);
  const term = useRef(null);
  const main = useRef(null);
  const hex = useRef(null);
  const files = useRef(null);
  const meter = useRef(null);
  const grant = useRef(null);

  useEffect(() => {
    const fast = reduceMotion() || sessionStorage.getItem('as_seen') === '1';
    let dead = false;
    const timers = new Set();
    const sleep = (ms) => new Promise((res) => {
      const t = setTimeout(() => { timers.delete(t); res(); }, fast ? ms * 0.22 : ms);
      timers.add(t);
    });

    const M = main.current;
    const Hx = hex.current;
    const F = files.current;
    M.innerHTML = ''; Hx.innerHTML = ''; F.innerHTML = '';

    // ── asset loading (real) ──
    const prog = { done: 0, total: ASSETS.length + 1 };
    const fileEls = ASSETS.map(([name]) => {
      const row = document.createElement('div');
      row.innerHTML = `<span class="t-dim">${name.padEnd(16, '.')}</span> <span class="t-wait">decrypting</span>`;
      F.appendChild(row);
      return row;
    });
    const mark = (i) => {
      prog.done += 1;
      if (i != null && fileEls[i]) fileEls[i].lastElementChild.outerHTML = '<span class="t-ok">✓ ok</span>';
    };
    ASSETS.forEach(([, url], i) => {
      const img = new Image();
      img.onload = () => mark(i);
      img.onerror = () => mark(i);
      img.src = url;
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => mark(null), () => mark(null)); else mark(null);
    const failsafe = setTimeout(() => { prog.done = prog.total; }, 8000);
    const assetFrac = () => Math.min(1, prog.done / prog.total);

    // ── side panes ──
    let hexN = 0;
    const hexTimer = setInterval(() => {
      const d = document.createElement('div');
      d.innerHTML = hexLine(hexN++);
      Hx.appendChild(d);
      while (Hx.children.length > 22) Hx.removeChild(Hx.firstChild);
      meter.current.style.transform = `scaleX(${Math.max(assetFrac(), 0.04)})`;
    }, fast ? 20 : 70);

    // ── terminal primitives ──
    const caret = document.createElement('span');
    caret.className = 't-caret';
    const add = (html, cls = '') => {
      const d = document.createElement('div');
      d.className = `t-line ${cls}`;
      d.innerHTML = html;
      M.appendChild(d);
      while (M.children.length > 40) M.removeChild(M.firstChild);
      return d;
    };
    const type = async (text) => {
      const d = add('<span class="t-prompt">visitor@ariyan</span><span class="t-dim">:</span><span class="t-path">~</span><span class="t-dim">$</span> <span class="t-typed"></span>');
      const span = d.querySelector('.t-typed');
      d.appendChild(caret);
      for (const ch of text) {
        if (dead) return;
        span.textContent += ch;
        await sleep(9 + Math.random() * 16);
      }
      await sleep(150);
      caret.remove();
    };
    const ok = (s) => add(`<span class="t-ok">[ OK ]</span> ${s}`);

    const scramble = (el, final, ms) => new Promise((res) => {
      const chars = '█▓▒░<>/\\|{}[]#$%&*+=?!01';
      const t0 = performance.now();
      const step = () => {
        if (dead) { res(); return; }
        const p = Math.min(1, (performance.now() - t0) / ms);
        el.textContent = [...final].map((c, i) => (c === ' ' || i < p * final.length ? c : chars[(Math.random() * chars.length) | 0])).join('');
        if (p < 1) requestAnimationFrame(step); else res();
      };
      step();
    });

    async function access() {
      clearInterval(hexTimer);
      const G = grant.current;
      G.style.display = 'grid';
      const big = G.querySelector('.g-big');
      gsap.fromTo(G, { opacity: 0 }, { opacity: 1, duration: 0.12 });
      await scramble(big, 'ACCESS GRANTED', fast ? 120 : 650);
      if (dead) return;
      await sleep(fast ? 200 : 380);
      if (dead) return;
      // let the hero's particle cloud finish building (it is already waiting beneath as a spinning galaxy)
      const t0 = performance.now();
      while (!dead && cloudReady && !cloudReady() && performance.now() - t0 < 4000) await new Promise((r) => setTimeout(r, 50));
      if (dead) return;

      // the terminal window shrinks and flies into the "AS" badge in the nav
      const logo = document.querySelector('.nav__logo');
      const lr = logo ? logo.getBoundingClientRect() : { left: 34, top: 18, width: 32, height: 32 };
      const T = term.current.getBoundingClientRect();
      const dx = lr.left + lr.width / 2 - (T.left + T.width / 2);
      const dy = lr.top + lr.height / 2 - (T.top + T.height / 2);
      const scan = root.current.querySelector('.boot__scan');

      const tl = gsap.timeline({ onComplete: () => { root.current.style.display = 'none'; if (onDone) onDone(); } });
      tl.to(crt.current, { x: () => (Math.random() - 0.5) * 22, skewX: 4, filter: 'hue-rotate(40deg) saturate(2)', duration: 0.05, repeat: 3, yoyo: true, ease: 'none' });
      tl.set(crt.current, { x: 0, skewX: 0, filter: 'none' });
      tl.add(() => { if (onReveal) onReveal(); });
      tl.to(grant.current, { opacity: 0, duration: 0.18, ease: 'none' }, '<');
      tl.to(term.current, { x: dx, y: dy, scaleX: lr.width / T.width, scaleY: lr.height / T.height, duration: 0.95, ease: 'expo.inOut', transformOrigin: '50% 50%' }, '<');
      tl.to(root.current, { backgroundColor: 'rgba(7, 9, 8, 0)', duration: 0.75, ease: 'power2.inOut' }, '<0.1');
      tl.to(scan, { opacity: 0, duration: 0.5 }, '<');
      tl.to(term.current, { opacity: 0, duration: 0.18, ease: 'none' }, '-=0.2');
      tl.fromTo('.nav__logo', { scale: 1.8 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.45)' }, '-=0.12');
    }

    async function run() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cores = navigator.hardwareConcurrency || '?';
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
      const gl2 = !!document.createElement('canvas').getContext('webgl2');

      await sleep(250);
      await type('ssh visitor@ariyansamal.dev');
      add('<span class="t-dim">Connecting to ariyansamal.dev (17.3850° N, 78.4867° E) …</span>');
      await sleep(260);
      ok('handshake complete · cipher <b>chacha20-poly1305</b>');
      await sleep(120);
      ok(`visitor detected · <b>${w}×${h}</b> · <b>${cores}</b> cores · <b>${tz}</b>`);
      await sleep(180);

      await type('./boot --portfolio --year=2026');
      add(`<pre class="t-art">${BANNER}</pre>`);
      await sleep(140);
      ok('kernel · <b>react 19</b> · <b>three</b> · <b>gsap</b> · <b>lenis</b>');
      await sleep(90);
      add(gl2 ? '<span class="t-ok">[ OK ]</span> webgl2 context acquired' : '<span class="t-warn">[ !! ]</span> webgl2 unavailable — falling back to 2d');
      await sleep(90);
      ok(`mounting <b>/work</b> · ${PROJECTS.length} products · all live`);
      await sleep(200);

      if (onWarm) onWarm();
      await type('decrypt portfolio.enc --key=••••••••');
      const bar = add('');
      let shown = 0;
      const t0 = performance.now();
      const need = fast ? 400 : 1500;
      while (!dead) {
        const target = Math.min(assetFrac(), Math.min(1, (performance.now() - t0) / need));
        shown += (target - shown) * 0.25;
        const n = Math.round(shown * 100);
        const fill = Math.round(shown * 28);
        bar.innerHTML = `<span class="t-dim">decrypting</span> <span class="t-bar">[${'█'.repeat(fill)}${'░'.repeat(28 - fill)}]</span> <b>${String(n).padStart(3, ' ')}%</b>`;
        if (n >= 100) break;
        await sleep(40);
      }
      if (dead) return;
      ok('integrity check passed · <b>0</b> errors');
      await sleep(160);

      await type('whoami');
      add('<span class="t-hi">ariyan samal</span> — full-stack engineer · hyderabad · <b>available</b>');
      await sleep(240);
      await type('sudo open portfolio');
      add('<span class="t-dim">[sudo] password for visitor: ••••••</span>');
      await sleep(260);
      add('<span class="t-ok">permission granted</span>');
      await sleep(260);
      if (dead) return;
      sessionStorage.setItem('as_seen', '1');
      await access();
    }

    run();
    const cr = crt.current;
    const rt = root.current;
    const gr = grant.current;
    return () => {
      dead = true;
      timers.forEach(clearTimeout);
      clearTimeout(failsafe);
      clearInterval(hexTimer);
      gsap.killTweensOf([cr, rt, gr]);
    };
  }, [onWarm, cloudReady, onReveal, onDone]);

  return (
    <div ref={root} className="boot" aria-hidden="true">
      <div ref={crt} className="boot__crt">
        <div ref={term} className="term">
          <div className="term__bar">
            <i /><i /><i />
            <span>visitor@ariyansamal.dev — zsh — 120×36</span>
            <em>secure ▸ tls1.3</em>
          </div>
          <div className="term__body">
            <div ref={main} className="term__main" />
            <aside className="term__side">
              <div className="term__pane">
                <header>hexdump — /dev/portfolio</header>
                <div ref={hex} className="term__hex" />
              </div>
              <div className="term__pane">
                <header>assets — decrypting</header>
                <div ref={files} className="term__files" />
              </div>
            </aside>
          </div>
          <div className="term__foot"><div className="term__meter"><i ref={meter} /></div><span>boot</span></div>
        </div>

        <div ref={grant} className="boot__grant">
          <div className="g-big">ACCESS GRANTED</div>
          <div className="g-sub">welcome, visitor</div>
        </div>
        <div className="boot__scan" />
      </div>
    </div>
  );
}
