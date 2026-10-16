import * as THREE from 'three';

// Hero: one cloud of particles that keeps re-forming — name → face → code.
// Every particle owns a target position for each form; the vertex shader blends between them
// (with per-particle delay + turbulence in flight), then the cursor wake pushes them around.

const VERT = /* glsl */ `
attribute vec3 aA; attribute vec3 aB; attribute vec3 aC; attribute vec3 aD;
attribute vec3 aColA; attribute vec3 aColB; attribute vec3 aColC; attribute vec3 aColD;
attribute vec3 aReal;
attribute vec4 aRand;
uniform float uTime, uMorph, uPixel, uSize, uDisperse, uShockT, uSpin, uTension, uShockAmp, uW, uH;
uniform vec2 uShockP;
uniform int uFrom, uTo;
uniform vec3 uTrail[12];
varying vec3 vCol;
varying float vAlpha;

vec3 pick(int i) { if (i == 0) return aA; if (i == 1) return aB; if (i == 2) return aC; return aD; }
vec3 pickCol(int i) { if (i == 0) return aColA; if (i == 1) return aColB; if (i == 2) return aColC; return aColD; }

vec2 rot(vec2 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

void main() {
  bool intro = (uFrom == 3);
  vec3 pf = pick(uFrom);
  vec3 pt = pick(uTo);
  float rad = 0.0;
  if (intro) {
    // the galaxy: differential rotation (core spins faster), tightening as the moment approaches
    float rr = length(pf.xy);
    rad = clamp(rr / 11.0, 0.0, 1.0);
    pf.xy = rot(pf.xy, uSpin * (1.1 / (0.5 + rr * 0.18)));
    pf.xy *= 1.0 - 0.1 * uTension;
  }

  float t;
  float e;
  float bell;
  float sing = 0.0;
  float flare = 0.0;
  float boom = 0.0;
  vec3 p;

  if (intro) {
    float m = uMorph;
    // A - the galaxy is dragged into one spinning point, in place (as before)
    float a = clamp(m / 0.30, 0.0, 1.0);
    float ea = a * a * (3.0 - 2.0 * a);
    vec3 pa = mix(pf, vec3(pf.xy * 0.07, pf.z * 0.2), ea);
    pa.xy = rot(pa.xy, 3.4 * ea * (1.0 - 0.5 * rad));
    // B - it detonates: every particle is thrown out and spreads across the whole page
    float bl = clamp((m - 0.30) / 0.18, 0.0, 1.0);
    float ebl = 1.0 - pow(1.0 - bl, 4.0);
    vec3 spread = vec3((aRand.x - 0.5) * uW * 1.3, (aRand.y - 0.5) * uH * 1.3, (aRand.z - 0.5) * 8.0);
    vec3 pb = mix(pa, spread, ebl);
    pb.xy = rot(pb.xy, 0.4 * smoothstep(0.3, 0.6, m));          // a slow swirl while it hangs there
    // C - then the spread cloud is pulled together and rebuilds the name, left to right
    float dx = clamp(pt.x / uW + 0.5, 0.0, 1.0);
    float b = clamp((m - 0.56 - dx * 0.2) / 0.24, 0.0, 1.0);
    float eb = 1.0 - pow(1.0 - b, 3.0);
    p = mix(pb, pt, eb);
    p.xy = rot(p.xy, 1.9 * sin(3.14159265 * b) * (1.0 - rad * 0.4));
    t = b;
    e = eb;
    bell = sin(3.14159265 * b) * 0.4;
    sing = ea * (1.0 - smoothstep(0.0, 0.25, bl));
    boom = step(0.30, m) * exp(-(m - 0.30) * 14.0);
    flare = sin(3.14159265 * clamp((b - 0.5) / 0.5, 0.0, 1.0));
  } else {
    t = clamp(uMorph * 1.75 - aRand.w * 0.75, 0.0, 1.0);
    e = t * t * (3.0 - 2.0 * t);
    p = mix(pf, pt, e);
    bell = sin(3.14159265 * t);
  }

  vec3 turb = vec3(
    sin(pf.y * 1.3 + uTime * 0.9 + aRand.x * 6.0),
    sin(pf.z * 1.1 + pf.x * 0.7 + uTime * 0.8 + aRand.y * 6.0),
    cos(pf.x * 1.2 + uTime + aRand.z * 6.0));
  p += turb * bell * (intro ? (0.3 + aRand.z * 0.8) : (1.2 + aRand.z * 3.0));
  p += vec3(sin(uTime * 0.7 + aRand.x * 40.0), cos(uTime * 0.6 + aRand.y * 40.0), sin(uTime * 0.5 + aRand.z * 40.0)) * 0.022;

  float lens = 0.0;
  for (int i = 0; i < 12; i++) {
    vec3 tr = uTrail[i];
    if (tr.z > 0.0) {
      vec2 dv = p.xy - tr.xy;
      float dist = length(dv);
      float f = smoothstep(1.7 * tr.z, 0.0, dist);
      p.xy += normalize(dv + 1e-4) * f * 0.62 * tr.z;
      p.z += f * 1.6 * tr.z;
      lens = max(lens, smoothstep(1.5 * tr.z, 0.0, dist));
    }
  }

  if (uShockT > 0.0) {
    float r = uShockT * 10.0;
    vec2 dv = p.xy - uShockP;
    float ring = smoothstep(1.4, 0.0, abs(length(dv) - r));
    float fade = exp(-uShockT * 1.1);
    p.xy += normalize(dv + 1e-4) * ring * 1.6 * fade * uShockAmp;
    p.z += ring * 2.4 * fade * uShockAmp;
  }

  p += vec3(aRand.x - 0.5, aRand.y - 0.1, aRand.z - 0.5) * 16.0 * uDisperse * uDisperse;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float gx = intro ? (1.0 - e) : 0.0;   // 1 while still part of the galaxy, 0 once landed
  float tw = 0.78 + 0.22 * sin(uTime * 2.0 + aRand.x * 30.0);
  gl_PointSize = uSize * uPixel * (0.8 + aRand.y * 0.9) * tw * (22.0 / -mv.z) * (1.0 + lens * 0.8) * (1.0 + 0.55 * gx + 0.25 * sing);

  vec3 col = mix(pickCol(uFrom), pickCol(uTo), e);
  float faceW = (uFrom == 1 ? 1.0 - e : 0.0) + (uTo == 1 ? e : 0.0);
  col = mix(col, aReal, clamp(lens * 1.4, 0.0, 1.0) * faceW);
  col += vec3(1.0, 0.45, 0.15) * bell * 0.5;
  col *= 1.0 + uTension * 0.8 * gx;
  col += vec3(1.0, 0.22, 0.14) * sing * 0.8;        // the singularity burns red, not white
  col += vec3(1.0, 0.32, 0.22) * flare * 1.0;       // each particle flares red-hot as it locks in
  col += vec3(1.0, 0.5, 0.3) * boom * 1.0;          // white-hot flash at the instant of the blast
  vCol = col;
  vAlpha = (1.0 - uDisperse) * (0.34 + 0.4 * aRand.w) * (1.0 + 0.9 * gx) * (1.0 - 0.88 * sing);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vCol, a * vAlpha);
}`;

const ORANGE = [1, 0.3, 0.12];
const RED = [1, 0.13, 0.1];
const BONE = [1, 0.93, 0.86];

// ── target builders ──────────────────────────────────────────────

function pickIndex(cum, total) {
  const r = Math.random() * total;
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < r) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function textTarget(lines, font, W, H, boxW, boxH, N, depth, tone = '') {
  const cw = 1100;
  const ch = Math.max(300, Math.round((cw * H) / W));
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  let fs = ch * 0.4;
  ctx.font = `${font.weight} ${fs}px ${font.family}`;
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const lh = font.lh || 0.88;
  fs *= Math.min((boxW * cw) / widest, (boxH * ch) / (lines.length * lh));
  ctx.font = `${font.weight} ${fs}px ${font.family}`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const total = lines.length * lh * fs;
  lines.forEach((l, i) => ctx.fillText(l, cw / 2, ch / 2 - total / 2 + (i + 0.5) * lh * fs + fs * (font.dy || 0)));

  const data = ctx.getImageData(0, 0, cw, ch).data;
  const xs = [];
  const ys = [];
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (data[(y * cw + x) * 4 + 3] > 150) { xs.push(x); ys.push(y); }
    }
  }
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const k = (Math.random() * xs.length) | 0;
    pos[i * 3] = ((xs[k] + Math.random() - 0.5) / cw - 0.5) * W;
    pos[i * 3 + 1] = (0.5 - (ys[k] + Math.random() - 0.5) / ch) * H;
    pos[i * 3 + 2] = (Math.random() - 0.5) * depth;
    const q = Math.random();
    const c1 = tone === 'red' ? (q < 0.5 ? RED : (q < 0.8 ? BONE : ORANGE)) : (q < 0.2 ? ORANGE : BONE);
    const v = 0.75 + Math.random() * 0.25;
    col[i * 3] = c1[0] * v; col[i * 3 + 1] = c1[1] * v; col[i * 3 + 2] = c1[2] * v;
  }
  return { pos, col };
}

function faceTarget(img, W, H, N) {
  const fw = 360;
  const fh = 480;
  const c = document.createElement('canvas');
  c.width = fw; c.height = fh;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  // cover-crop the photo into 3:4
  const ir = img.naturalWidth / img.naturalHeight;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (ir > fw / fh) sw = sh * (fw / fh); else sh = sw / (fw / fh);
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, 0, sw, sh, 0, 0, fw, fh);
  const data = ctx.getImageData(0, 0, fw, fh).data;

  const cum = new Float64Array(fw * fh);
  let total = 0;
  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const i = y * fw + x;
      const lum = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
      const u = (x / fw - 0.5) * 2;
      const v = (y / fh - 0.46) * 2;
      const r = Math.sqrt(u * u * 0.85 + v * v * 0.8);
      const mask = Math.min(1, Math.max(0, (1.05 - r) / 0.5));
      total += (0.06 + Math.pow(1 - lum, 1.5)) * mask * mask;
      cum[i] = total;
    }
  }

  let ph = H * 0.96;
  let pw = ph * 0.75;
  if (pw > W * 0.94) { pw = W * 0.94; ph = pw / 0.75; }
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const real = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const k = pickIndex(cum, total);
    const x = k % fw;
    const y = (k / fw) | 0;
    const r = data[k * 4] / 255;
    const g = data[k * 4 + 1] / 255;
    const b = data[k * 4 + 2] / 255;
    const dark = 1 - (r * 0.299 + g * 0.587 + b * 0.114);
    pos[i * 3] = ((x + Math.random()) / fw - 0.5) * pw;
    pos[i * 3 + 1] = (0.5 - (y + Math.random()) / fh) * ph - H * 0.01;
    pos[i * 3 + 2] = (dark - 0.45) * 2.2 + (Math.random() - 0.5) * 0.12;
    // stylised: lit areas bone, mid-tones orange
    const m = Math.min(1, Math.max(0, (dark - 0.58) / 0.28));
    const v = 0.7 + dark * 0.45;
    col[i * 3] = (ORANGE[0] + (BONE[0] - ORANGE[0]) * m) * v;
    col[i * 3 + 1] = (ORANGE[1] + (BONE[1] - ORANGE[1]) * m) * v;
    col[i * 3 + 2] = (ORANGE[2] + (BONE[2] - ORANGE[2]) * m) * v;
    real[i * 3] = Math.min(1, Math.pow(r, 0.7) * 1.25);
    real[i * 3 + 1] = Math.min(1, Math.pow(g, 0.7) * 1.25);
    real[i * 3 + 2] = Math.min(1, Math.pow(b, 0.7) * 1.25);
  }
  return { pos, col, real };
}

// ── public API ───────────────────────────────────────────────────

function spiralTarget(N, W, H) {
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const R = Math.min(H * 0.8, W * 0.92);
  const ARMS = 3;
  for (let i = 0; i < N; i++) {
    const roll = Math.random();
    const core = roll < 0.15;
    const halo = !core && roll < 0.23;
    let r;
    let th;
    let z;
    let tt;
    if (core) {
      r = Math.abs(Math.random() + Math.random() + Math.random() - 1.5) * 2.8;
      th = Math.random() * Math.PI * 2;
      z = (Math.random() - 0.5) * 1.8;
      tt = 0;
    } else if (halo) {
      r = R * (0.25 + Math.random() * 0.95);
      th = Math.random() * Math.PI * 2;
      z = (Math.random() - 0.5) * 3;
      tt = Math.min(1, r / R);
    } else {
      const t = Math.pow(Math.random(), 0.7);
      r = 1.0 + t * R;
      th = r * 0.62 + (i % ARMS) * ((Math.PI * 2) / ARMS) + (Math.random() - 0.5) * (0.07 + t * 0.15);
      z = (Math.random() - 0.5) * (1.6 - t * 1.1);
      tt = t;
    }
    pos[i * 3] = Math.cos(th) * r;
    pos[i * 3 + 1] = Math.sin(th) * r * 0.62;
    pos[i * 3 + 2] = z;
    const c = core ? BONE : (halo ? ORANGE : (Math.random() < 0.22 + tt * 0.5 ? ORANGE : BONE));
    let v = core ? 0.95 : (halo ? 0.45 : (1 - tt * 0.45) * (0.7 + Math.random() * 0.45));
    if (Math.random() < 0.05) v = Math.min(1.5, v * 1.6); // the odd bright star
    col[i * 3] = c[0] * v; col[i * 3 + 1] = c[1] * v; col[i * 3 + 2] = c[2] * v;
  }
  return { pos, col };
}

export async function createHeroParticles(canvas, { photo, mobile, onStage }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x0c0c0b, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
  camera.position.z = 22;
  const N = mobile ? 38000 : 85000;

  const img = new Image();
  const imgReady = new Promise((res) => { img.onload = res; img.onerror = res; });
  img.src = photo;
  await Promise.all([
    imgReady,
    document.fonts ? document.fonts.load('800 200px "Inter Tight"') : null,
    document.fonts ? document.fonts.load('500 200px "JetBrains Mono"') : null,
  ].filter(Boolean));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const attr = (name, arr, size = 3) => {
    const a = new THREE.BufferAttribute(arr, size);
    a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute(name, a);
    return a;
  };
  const rand = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) rand[i] = Math.random();
  attr('aRand', rand, 4);
  const A = {};
  const blank = () => new Float32Array(N * 3);
  ['aA', 'aB', 'aC', 'aD', 'aColA', 'aColB', 'aColC', 'aColD', 'aReal'].forEach((n) => { A[n] = attr(n, blank()); });

  let W = 1;
  let H = 1;
  const build = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const asp = w / h;
    H = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    W = H * asp;
    if (typeof mat !== 'undefined') { mat.uniforms.uW.value = W; mat.uniforms.uH.value = H; }
    const tall = asp < 1.05;
    const name = tall
      ? textTarget(['ARIYAN', 'SAMAL'], { weight: 800, family: '"Inter Tight", sans-serif', lh: 0.84, dy: 0.02 }, W, H, 0.9, 0.5, N, 0.5, 'red')
      : textTarget(['ARIYAN SAMAL'], { weight: 800, family: '"Inter Tight", sans-serif', lh: 0.9, dy: 0.02 }, W, H, 0.9, 0.46, N, 0.5, 'red');
    const code = textTarget(['</>'], { weight: 500, family: '"JetBrains Mono", monospace', lh: 1 }, W, H, tall ? 0.9 : 0.62, tall ? 0.3 : 0.55, N, 1.4);
    const face = faceTarget(img, W, H, N);
    const access = spiralTarget(N, W, H);
    A.aA.array.set(name.pos); A.aColA.array.set(name.col);
    A.aB.array.set(face.pos); A.aColB.array.set(face.col); A.aReal.array.set(face.real);
    A.aC.array.set(code.pos); A.aColC.array.set(code.col);
    A.aD.array.set(access.pos); A.aColD.array.set(access.col);
    Object.values(A).forEach((a) => { a.needsUpdate = true; });
  };

  const trail = Array.from({ length: 12 }, () => ({ x: 0, y: 0, t: -99 }));
  const trailU = Array.from({ length: 12 }, () => new THREE.Vector3(0, 0, 0));
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uMorph: { value: 0 }, uPixel: { value: dpr }, uSize: { value: mobile ? 2.0 : 1.7 },
      uDisperse: { value: 0 }, uShockT: { value: 0 }, uSpin: { value: 0 }, uTension: { value: 0 }, uShockAmp: { value: 1 }, uW: { value: 22 }, uH: { value: 13.9 }, uShockP: { value: new THREE.Vector2() },
      uFrom: { value: 3 }, uTo: { value: 0 }, uTrail: { value: trailU },
    },
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  build();

  let rt = 0;
  const ro = new ResizeObserver(() => {
    resize();
    clearTimeout(rt);
    rt = setTimeout(build, 220);
  });
  ro.observe(canvas);

  // ── state ──
  const S = {
    from: 3, to: 0, morph: 1, dur: 2.6, started: false, stage: -1, dead: false, raf: 0, visible: true, last: 0,
    mx: 0, my: 0, mxs: 0, mys: 0, shock: -1, disperse: 0, timer: 0, hold: 0, auto: true, pauseUntil: 0,
    px: 99, py: 99,
    gov: { sum: 0, n: 0, level: 0 },
    spin: 0, revealAt: 0,
  };
  const HOLD = [2.5, 6.4, 4.2];

  const goTo = (i, manual) => {
    if (i === S.stage && S.morph >= 1) return;
    S.from = S.morph >= 1 ? (S.stage < 0 ? 3 : S.stage) : S.to;
    S.dur = S.from === 3 ? 3.6 : 2.6;
    S.to = i;
    S.stage = i;
    S.morph = 0;
    S.timer = 0;
    mat.uniforms.uFrom.value = S.from;
    mat.uniforms.uTo.value = S.to;
    if (manual) S.pauseUntil = performance.now() + 9000;
    onStage && onStage(i);
  };

  const toWorld = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return [((cx - r.left) / r.width - 0.5) * W, (0.5 - (cy - r.top) / r.height) * H];
  };
  const pushTrail = (x, y, now) => {
    const dx = x - S.px;
    const dy = y - S.py;
    if (dx * dx + dy * dy < 0.05) return;
    S.px = x; S.py = y;
    const p = trail[S.ti || 0];
    p.x = x; p.y = y; p.t = now;
    S.ti = ((S.ti || 0) + 1) % 12;
  };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    S.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    S.my = ((e.clientY - r.top) / r.height) * 2 - 1;
    const [x, y] = toWorld(e.clientX, e.clientY);
    pushTrail(x, y, performance.now());
  };
  const onDown = (e) => {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    if (e.target.closest && e.target.closest('button,a,input')) return;
    const [x, y] = toWorld(e.clientX, e.clientY);
    mat.uniforms.uShockAmp.value = 1;
    mat.uniforms.uShockP.value.set(x, y);
    S.shock = 0;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });

  const io = new IntersectionObserver(([e]) => {
    S.visible = e.isIntersecting;
    if (S.visible && !S.dead && !S.raf) { S.last = 0; S.raf = requestAnimationFrame(frame); }
  });
  io.observe(canvas);

  const t0 = performance.now();
  function frame(now) {
    S.raf = 0;
    if (S.dead || !S.visible) return;
    const dt = Math.min((now - (S.last || now)) / 1000, 0.1);
    S.last = now;
    // quality governor: if the average frame is slow, shed work in two steps instead of stuttering
    if (S.started && dt > 0) {
      const g = S.gov;
      g.sum += dt; g.n += 1;
      if (g.n >= 45) {
        const avg = g.sum / g.n;
        g.sum = 0; g.n = 0;
        if (avg > 0.03 && g.level < 2) {
          g.level += 1;
          if (g.level === 1) { renderer.setPixelRatio(1); mat.uniforms.uPixel.value = 1; resize(); }
          else geo.setDrawRange(0, Math.floor(N * 0.45));
        }
      }
    }
    const u = mat.uniforms;
    u.uTime.value = (now - t0) / 1000;
    // galaxy wind-up: spin speeds up and the cloud tightens during the last 0.9s before the collapse
    let tension = 0;
    if (!S.started && S.revealAt) tension = Math.min(1, Math.max(0, 1 - (S.revealAt - now / 1000) / 0.9));
    else if (S.started && S.from === 3 && S.morph < 1) tension = 1;
    tension *= tension;
    S.spin += dt * (0.9 + 2.6 * tension);
    u.uSpin.value = S.spin;
    u.uTension.value = tension;
    // the singularity trembles just before it detonates
    const shake = S.started && S.from === 3 && S.morph < 0.3 ? Math.sin(Math.PI * Math.min(1, S.morph / 0.3)) * 0.22 : 0;
    points.position.set((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 0);

    if (S.started) {
      if (S.morph < 1) {
        S.morph = Math.min(1, S.morph + dt / S.dur);
        if (S.morph >= 1) { S.timer = 0; }
      } else if (S.auto && now > S.pauseUntil) {
        S.timer += dt;
        if (S.timer > HOLD[S.stage]) goTo((S.stage + 1) % 3, false);
      }
      u.uMorph.value = S.morph;
    }

    if (S.shock >= 0) { S.shock += dt; u.uShockT.value = S.shock; if (S.shock > 4) { S.shock = -1; u.uShockT.value = 0; } }

    // idle wander when the pointer has been away: a faint wake keeps the cloud alive on touch
    for (let i = 0; i < 12; i++) {
      const p = trail[i];
      const age = (now - p.t) / 1000;
      const a = age >= 1.7 ? 0 : Math.pow(1 - age / 1.7, 0.8);
      trailU[i].set(p.x, p.y, a);
    }

    S.mxs += (S.mx - S.mxs) * (1 - Math.exp(-3 * dt));
    S.mys += (S.my - S.mys) * (1 - Math.exp(-3 * dt));
    points.rotation.y = S.mxs * 0.22;
    points.rotation.x = S.mys * 0.1;
    u.uDisperse.value += (S.disperse - u.uDisperse.value) * (1 - Math.exp(-6 * dt));

    renderer.render(scene, camera);
    S.raf = requestAnimationFrame(frame);
  }
  S.raf = requestAnimationFrame(frame);

  return {
    // hold the spinning galaxy for `delay` seconds, wind it up, then spiral it into the name
    reveal(delay = 3.4) {
      if (S.started || S.pending) return;
      S.revealAt = performance.now() / 1000 + delay;
      S.pending = setTimeout(() => {
        S.pending = 0;
        if (S.started || S.dead) return;
        S.started = true;
        goTo(0, false);
        // crisp ring right as the letters lock into place
        // the blast: a full-strength ring right as the point detonates
        setTimeout(() => { if (!S.dead) { mat.uniforms.uShockAmp.value = 1; mat.uniforms.uShockP.value.set(0, 0); S.shock = 0; } }, 1080);
        // and a gentle ripple as the last letters lock in
        setTimeout(() => { if (!S.dead) { mat.uniforms.uShockAmp.value = 0.28; mat.uniforms.uShockP.value.set(0, 0); S.shock = 0; } }, 3350);
      }, delay * 1000);
    },
    goTo(i) { clearTimeout(S.pending); S.pending = 0; S.revealAt = 0; S.started = true; goTo(i, true); },
    shock(x = 0, y = 0, amp = 1) { mat.uniforms.uShockAmp.value = amp; mat.uniforms.uShockP.value.set(x, y); S.shock = 0; },
    setDisperse(v) { S.disperse = v; },
    destroy() {
      S.dead = true;
      cancelAnimationFrame(S.raf);
      clearTimeout(rt);
      clearTimeout(S.pending);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
