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
  ...PROJECTS.map((p) => [`${p.slug}.jpg`, p.thumb]),
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
    const fast = reduceMotion();
    let dead = false;
    const timers = new Set();
    const sleep = (ms) => new Promise((res) => {
      const t = setTimeout(() => { timers.delete(t); res(); }, ms * (fast ? 0.22 : 0.5));
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
    }, fast ? 20 : 40);

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

    // The whole screen cracks into glass shards (live copies of the terminal, clipped to triangles)
    // that fly toward the viewer in 3D, while a flash, a screen shake and a shockwave through the
    // particle galaxy hit at the same instant.
    function shatter() {
      return new Promise((resolve) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const finish = () => { root.current.style.display = 'none'; if (onDone) onDone(); resolve(); };
        if (reduceMotion()) {
          if (onReveal) onReveal();
          gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: finish });
          return;
        }
        if (/[?&]slow=1/.test(window.location.search)) gsap.globalTimeline.timeScale(0.12); // debugging aid: watch the break in slow motion
        const BG = '#070908';
        const cols = vw < 700 ? 3 : 7;
        const rows = vw < 700 ? 5 : 4;
        // jittered grid of points (the border stays straight so the shards tile the whole screen)
        const pt = [];
        for (let j = 0; j <= rows; j++) {
          pt[j] = [];
          for (let i = 0; i <= cols; i++) {
            const edge = i === 0 || j === 0 || i === cols || j === rows;
            const jx = edge ? 0 : (Math.random() - 0.5) * (vw / cols) * 0.7;
            const jy = edge ? 0 : (Math.random() - 0.5) * (vh / rows) * 0.7;
            // keep the outer edge exactly on the screen edge
            pt[j][i] = [(i / cols) * vw + (i === 0 || i === cols ? 0 : jx), (j / rows) * vh + (j === 0 || j === rows ? 0 : jy)];
          }
        }
        const tris = [];
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const a = pt[j][i], b = pt[j][i + 1], c = pt[j + 1][i + 1], d = pt[j + 1][i];
            if (Math.random() < 0.5) { tris.push([a, b, c]); tris.push([a, c, d]); } else { tris.push([a, b, d]); tris.push([b, c, d]); }
          }
        }

        const layer = document.createElement('div');
        layer.className = 'boot__shards';
        root.current.appendChild(layer);
        const source = crt.current;
        const shards = tris.map((t) => {
          const xs = t.map((p) => p[0]);
          const ys = t.map((p) => p[1]);
          const bx = Math.min(...xs), by = Math.min(...ys);
          const bw = Math.max(...xs) - bx, bh = Math.max(...ys) - by;
          const el = document.createElement('div');
          el.className = 'boot__shard';
          el.style.cssText = `left:${bx}px;top:${by}px;width:${bw}px;height:${bh}px;background:${BG};clip-path:polygon(${t.map((p) => `${p[0] - bx}px ${p[1] - by}px`).join(',')});`;
          const inner = source.cloneNode(true);
          inner.removeAttribute('class');
          inner.style.cssText = `position:absolute;left:${-bx}px;top:${-by}px;width:${vw}px;height:${vh}px;`;
          el.appendChild(inner);
          const shine = document.createElement('i');
          shine.className = 'boot__shine';
          el.appendChild(shine);
          layer.appendChild(el);
          const mx = (t[0][0] + t[1][0] + t[2][0]) / 3;
          const my = (t[0][1] + t[1][1] + t[2][1]) / 3;
          el.style.transformOrigin = `${mx - bx}px ${my - by}px`;
          return { el, mx, my };
        });

        // the original screen is replaced by its shards; the galaxy underneath is now visible between them
        source.style.visibility = 'hidden';
        root.current.style.background = 'transparent';

        const flash = document.createElement('div');
        flash.className = 'boot__flash';
        layer.appendChild(flash);
        gsap.fromTo(flash, { opacity: 0.7 }, { opacity: 0, duration: 0.45, ease: 'power2.out' });

        // impact: page shake + shockwave through the galaxy + the rest of the site starts to come in
        const main = document.querySelector('main');
        if (main) gsap.fromTo(main, { x: 0, y: 0 }, { x: () => (Math.random() - 0.5) * 18, y: () => (Math.random() - 0.5) * 14, duration: 0.04, repeat: 11, yoyo: true, ease: 'none', onComplete: () => gsap.set(main, { x: 0, y: 0 }) });
        window.dispatchEvent(new CustomEvent('hero:impact'));
        if (onReveal) onReveal();

        const cx = vw / 2;
        const cy = vh / 2;
        const maxD = Math.hypot(cx, cy);
        const k = fast ? 0.7 : 1;
        let left = shards.length;
        shards.forEach(({ el, mx, my }) => {
          const dx = mx - cx;
          const dy = my - cy;
          const d = Math.hypot(dx, dy) || 1;
          const fly = (420 + Math.random() * 900) * (0.55 + d / maxD);
          gsap.to(el, {
            x: (dx / d) * fly, y: (dy / d) * fly + (Math.random() - 0.3) * 160,
            z: 250 + Math.random() * 1000,
            rotationX: (Math.random() - 0.5) * 700, rotationY: (Math.random() - 0.5) * 700, rotationZ: (Math.random() - 0.5) * 420,
            scale: 0.4 + Math.random() * 0.9,
            opacity: 0,
            duration: (1.15 + Math.random() * 0.9) * k,
            delay: 0.1 + (d / maxD) * 0.28 + Math.random() * 0.08,
            ease: 'power3.out',
            onComplete: () => { left -= 1; if (left === 0) { layer.remove(); finish(); } },
          });
        });
      });
    }

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

      // a short glitch, then the whole screen breaks
      await new Promise((res) => {
        gsap.timeline({ onComplete: res })
          .to(crt.current, { x: () => (Math.random() - 0.5) * 26, skewX: 5, filter: 'hue-rotate(40deg) saturate(2)', duration: 0.045, repeat: 7, yoyo: true, ease: 'none' })
          .set(crt.current, { x: 0, skewX: 0, filter: 'none' });
      });
      if (dead) return;
      await shatter();
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
      const need = fast ? 300 : 750;
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
          <div className="g-sub">welcome</div>
        </div>
        <div className="boot__scan" />
      </div>
    </div>
  );
}
