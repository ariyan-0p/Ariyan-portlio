import * as THREE from 'three';

// Fly-through gallery. Every project is a plane in a long corridor; scroll moves the camera
// down it. Far planes are dithered posters in the project's accent colour and resolve to the
// real screenshot as you approach. Scroll velocity bends the planes and splits the colour
// channels; hovering bulges the plane under the cursor.

const GAP = 15; // distance between planes
const DIST = 7.8; // camera rest distance in front of a plane
const W = 6.4;
const H = W * 0.625;

const VERT = /* glsl */ `
uniform float uVel;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vDepth;
void main() {
  vUv = uv;
  vec3 p = position;
  float bend = sin(uv.x * 3.14159);
  p.z += bend * uVel * -1.1;
  p.y += sin(uv.x * 6.0 + uTime * 2.0) * uVel * 0.14;
  float d = distance(uv, uMouse);
  p.z += uHover * smoothstep(0.5, 0.0, d) * 0.55;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform float uVel;
uniform float uHover;
uniform float uOpacity;
uniform vec2 uMouse;
uniform vec3 uAccent;
uniform vec3 uInk;
uniform vec3 uBone;
varying vec2 vUv;
varying float vDepth;

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5 * a) * .25 + bayer2(a); }

void main() {
  vec2 uv = vUv;
  vec2 dir = uv - uMouse;
  float d = length(dir * vec2(1.6, 1.0));
  uv -= dir * uHover * smoothstep(0.38, 0.0, d) * 0.2;

  float s = uVel * 0.014;
  vec3 col = vec3(texture2D(uTex, uv + vec2(s, 0.)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(s, 0.)).b);

  // far = dithered duotone poster, near = real colour
  float near = 1.0 - smoothstep(10.0, 26.0, vDepth);
  float lum = dot(col, vec3(.299, .587, .114));
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  float tone = lum + (bayer8(cell) - .5) * .7;
  vec3 dith = tone < .3 ? uInk : (tone < .6 ? uAccent : uBone);
  col = mix(dith, col, near);

  float fade = (1.0 - smoothstep(42.0, 64.0, vDepth)) * smoothstep(0.4, 2.4, vDepth);
  gl_FragColor = vec4(col, uOpacity * fade);
}`;

const hex = (h) => new THREE.Color(h);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createGallery(canvas, items, { onActive, onHover, onOpen, mobile }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x0c0c0b, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 160);
  const N = items.length;

  // ── planes ──
  const loader = new THREE.TextureLoader();
  const planes = items.map((it, i) => {
    const tex = loader.load(it.shot, () => { tex.userData.ready = true; });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTex: { value: tex }, uVel: { value: 0 }, uTime: { value: 0 }, uHover: { value: 0 }, uOpacity: { value: 1 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uAccent: { value: hex(it.accent) },
        uInk: { value: hex('#0c0c0b') }, uBone: { value: hex('#ece8e0') },
      },
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H, 28, 18), mat);
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(W + 0.3, H + 0.3)),
      new THREE.LineBasicMaterial({ color: 0xece8e0, transparent: true, opacity: 0.5 }),
    );
    const group = new THREE.Group();
    group.add(mesh, frame);
    group.position.set((i % 2 ? 1 : -1) * 3.5 + Math.sin(i * 1.7) * 0.7, Math.cos(i * 1.3) * 1.1, -i * GAP);
    group.rotation.set(Math.cos(i * 0.9) * 0.05, Math.sin(i * 2.1) * 0.24, Math.sin(i * 1.4) * 0.05);
    group.userData.bx = group.position.x;
    group.userData.ry = group.rotation.y;
    scene.add(group);
    return { group, mesh, mat, frame, hover: 0, hoverT: 0, mouse: new THREE.Vector2(0.5, 0.5) };
  });

  // ── dust ──
  const COUNT = mobile ? 500 : 1100;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 36;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = 14 - Math.random() * (N * GAP + 30);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xff4d1f, size: 1.8, transparent: true, opacity: 0.8, depthWrite: false, sizeAttenuation: false }));
  scene.add(dust);

  // ── state ──
  const st = {
    progress: 0, z: DIST, x: 0, y: 0, vel: 0, active: -1, dead: false, raf: 0, visible: true, last: 0,
    mx: 0, my: 0, mxs: 0, mys: 0, hovered: -1, w: 1, h: 1, dist: DIST, xf: 0.55, init: false,
    gov: { sum: 0, n: 0, level: 0 },
  };
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    st.w = w; st.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the plane comfortably framed on tall (mobile) viewports
    camera.fov = w / h < 1 ? 70 : 50;
    camera.updateProjectionMatrix();
    // portrait screens: pull back so a whole plane fits, and stop sliding it off-centre
    const asp = w / h;
    st.dist = asp < 1 ? Math.min(15, W / 0.86 / (2 * Math.tan(THREE.MathUtils.degToRad(35)) * asp)) : DIST;
    st.xf = asp < 1 ? 1 : 0.55;
    const xs = asp < 1 ? 0.28 : 1;
    planes.forEach((p) => { p.group.position.x = p.group.userData.bx * xs; p.group.rotation.y = p.group.userData.ry * (asp < 1 ? 0.45 : 1); });
    if (!st.init) { st.z = st.dist; st.init = true; }
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const pick = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(planes.map((p) => p.mesh), false);
    const hit = hits.find((h) => planes.findIndex((p) => p.mesh === h.object) >= 0 && h.distance < 24);
    return hit ? { i: planes.findIndex((p) => p.mesh === hit.object), uv: hit.uv } : null;
  };

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    st.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    st.my = ((e.clientY - r.top) / r.height) * 2 - 1;
    const h = pick(e.clientX, e.clientY);
    const idx = h ? h.i : -1;
    if (idx !== st.hovered) {
      st.hovered = idx;
      onHover && onHover(idx);
    }
    planes.forEach((p, i) => { p.hoverT = i === idx ? 1 : 0; });
    if (h) planes[h.i].mouse.copy(h.uv);
  };
  const onLeave = () => {
    st.hovered = -1;
    planes.forEach((p) => { p.hoverT = 0; });
    onHover && onHover(-1);
  };
  const onClick = (e) => {
    const h = pick(e.clientX, e.clientY);
    if (h) onOpen && onOpen(h.i);
    else if (mobile && st.active >= 0) onOpen && onOpen(st.active);
  };
  if (!mobile) {
    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
  }
  canvas.addEventListener('click', onClick);

  const io = new IntersectionObserver(([e]) => {
    st.visible = e.isIntersecting;
    if (st.visible && !st.dead && !st.raf) { st.last = 0; st.raf = requestAnimationFrame(frame); }
  });
  io.observe(canvas);

  const t0 = performance.now();
  function frame(now) {
    st.raf = 0;
    if (st.dead || !st.visible) return;
    const dt = Math.min((now - (st.last || now)) / 1000, 0.1);
    st.last = now;
    const k = (r) => 1 - Math.exp(-r * dt);
    const t = (now - t0) / 1000;
    if (dt > 0) {
      const g = st.gov;
      g.sum += dt; g.n += 1;
      if (g.n >= 45) {
        const avg = g.sum / g.n;
        g.sum = 0; g.n = 0;
        if (avg > 0.03 && g.level < 2) {
          g.level += 1;
          if (g.level === 1) { renderer.setPixelRatio(1); resize(); }
          else dustGeo.setDrawRange(0, Math.floor(COUNT * 0.4));
        }
      }
    }

    // progress → fractional index with a dwell on every plane
    const f = clamp(st.progress, 0, 1) * (N - 1);
    const base = Math.min(Math.floor(f), N - 2);
    const frac = N === 1 ? 0 : f - base;
    const e = ease(clamp(frac, 0, 1));
    const g = N === 1 ? 0 : base + e;
    const a = planes[base].group.position;
    const b = planes[Math.min(base + 1, N - 1)].group.position;
    const tz = -g * GAP + st.dist;
    const tx = (a.x + (b.x - a.x) * e) * st.xf;
    const ty = (a.y + (b.y - a.y) * e) * 0.7;

    const prevZ = st.z;
    st.z += (tz - st.z) * k(5.5);
    st.x += (tx - st.x) * k(4);
    st.y += (ty - st.y) * k(4);
    const instVel = (prevZ - st.z) / Math.max(dt, 0.001); // units / s, + when flying forward
    const vmax = mobile ? 0.4 : 1.3;
    st.vel += (clamp(instVel * 0.045, -vmax, vmax) - st.vel) * k(8);

    st.mxs += (st.mx - st.mxs) * k(3);
    st.mys += (st.my - st.mys) * k(3);
    camera.position.set(st.x + st.mxs * 0.7, st.y - st.mys * 0.45, st.z);
    camera.rotation.set(-st.mys * 0.05, -st.mxs * 0.09, -st.mxs * 0.015 + st.vel * 0.02);

    const idx = Math.round(g);
    if (idx !== st.active) { st.active = idx; onActive && onActive(idx); }

    planes.forEach((p, i) => {
      p.hover += (p.hoverT - p.hover) * k(8);
      const u = p.mat.uniforms;
      u.uVel.value = st.vel;
      u.uTime.value = t;
      u.uHover.value = p.hover;
      u.uMouse.value.lerp(p.mouse, k(14));
      const depth = camera.position.z - p.group.position.z;
      p.frame.material.opacity = clamp(1 - Math.abs(depth - st.dist) / 34, 0, 0.6) * (depth < 1.5 ? 0 : 1);
      // gentle float
      p.group.position.y = Math.cos(i * 1.3) * 1.1 + Math.sin(t * 0.6 + i) * 0.08;
    });

    dust.material.size = 1.7 + Math.min(1, Math.abs(st.vel)) * 1.2;
    renderer.render(scene, camera);
    st.raf = requestAnimationFrame(frame);
  }
  st.raf = requestAnimationFrame(frame);

  return {
    setProgress(p) { st.progress = p; },
    destroy() {
      st.dead = true;
      cancelAnimationFrame(st.raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      planes.forEach((p) => {
        p.mesh.geometry.dispose(); p.mat.uniforms.uTex.value.dispose(); p.mat.dispose();
        p.frame.geometry.dispose(); p.frame.material.dispose();
      });
      dustGeo.dispose(); dust.material.dispose();
      renderer.dispose();
    },
  };
}
