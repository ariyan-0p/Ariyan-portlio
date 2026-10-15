// Raw WebGL ordered-dither portrait.
// Three-tone Bayer dither (ink / signal / bone) that resolves to the real photo
// inside a "lens" that follows the cursor (or drifts on its own when idle / on touch).

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uLens;
uniform float uTime;
uniform float uIntro;
uniform float uCell;
uniform vec3 uInk;
uniform vec3 uSignal;
uniform vec3 uBone;

float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5 * a) * .25 + bayer2(a); }

vec2 cover(vec2 uv){
  vec2 r = vec2(min((uRes.x / uRes.y) / (uImg.x / uImg.y), 1.), min((uRes.y / uRes.x) / (uImg.y / uImg.x), 1.));
  return vec2(uv.x * r.x + (1. - r.x) * .5, 1. - (1. - uv.y) * r.y);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / uCell);
  vec2 cuv = (cell + .5) * uCell / uRes;

  float breathe = sin(uTime * .6 + cuv.y * 6.) * .004;
  vec3 pix = texture2D(uTex, cover(cuv + vec2(breathe, 0.))).rgb;
  float lum = dot(pix, vec3(.299, .587, .114));
  lum = clamp((lum - .55) * 1.8 + .42, 0., 1.);

  float d = bayer8(cell) - .5;
  float v = lum + d * .62;
  vec3 dith = v < .30 ? uInk : (v < .56 ? uSignal : uBone);

  vec3 real = texture2D(uTex, cover(vUv)).rgb;
  real = (real - .5) * 1.08 + .5;

  float asp = uRes.x / uRes.y;
  float dist = length((vUv - uMouse) * vec2(asp, 1.));
  float r = .34 * uLens;
  float m = smoothstep(r, r * .82, dist);
  float ring = smoothstep(.006, 0., abs(dist - r)) * step(.01, uLens);

  vec3 col = mix(dith, real, m);
  col = mix(col, uInk, ring);

  // intro wipe: scan from the top, dithered edge
  float n = bayer8(cell) * .25;
  float visible = step(1. - vUv.y, uIntro * 1.2 - n * .2);

  gl_FragColor = vec4(mix(uBone, col, visible), 1.);
}`;

const hex = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function mountDither(canvas, src, { onReady, colors } = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const compile = (type, code) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, code);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n) => gl.getUniformLocation(prog, n);
  const u = {
    tex: U('uTex'), res: U('uRes'), img: U('uImg'), mouse: U('uMouse'), lens: U('uLens'),
    time: U('uTime'), intro: U('uIntro'), cell: U('uCell'), ink: U('uInk'), signal: U('uSignal'), bone: U('uBone'),
  };
  const c = { ink: '#0c0c0b', signal: '#ff4d1f', bone: '#ece8e0', ...colors };
  gl.uniform3fv(u.ink, hex(c.ink));
  gl.uniform3fv(u.signal, hex(c.signal));
  gl.uniform3fv(u.bone, hex(c.bone));

  const state = { mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, lens: 0, lensT: 0, intro: 0, introT: 0, last: 0, idle: true, visible: true, raf: 0, dead: false };
  let imgW = 1;
  let imgH = 1;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
    gl.uniform1f(u.cell, Math.max(3, Math.round(3.2 * dpr)));
  };

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (state.dead) return;
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u.tex, 0);
    gl.uniform2f(u.img, imgW, imgH);
    resize();
    onReady && onReady();
    state.raf = requestAnimationFrame(frame);
  };
  img.src = src;

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    state.tx = x;
    state.ty = y;
    state.idle = false;
    state.lastMove = performance.now();
    const near = x > -0.25 && x < 1.25 && y > -0.25 && y < 1.25;
    state.lensT = near ? 1 : 0.0;
  };
  const onLeave = () => { state.lensT = 0; };
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize);

  const io = new IntersectionObserver(([e]) => {
    state.visible = e.isIntersecting;
    if (state.visible && !state.dead && !state.raf) state.raf = requestAnimationFrame(frame);
  });
  io.observe(canvas);

  const t0 = performance.now();
  function frame(now) {
    state.raf = 0;
    if (state.dead || !state.visible) return;
    const t = (now - t0) / 1000;
    const dt = Math.min((now - (state.last || now)) / 1000, 0.25);
    state.last = now;
    const k = (rate) => 1 - Math.exp(-rate * dt); // frame-rate independent smoothing

    // idle wander: when the pointer has been still for a while the lens drifts by itself
    if (!state.idle && now - (state.lastMove || 0) > 2600) state.idle = true;
    if (state.idle) {
      state.tx = 0.5 + Math.sin(t * 0.55) * 0.28;
      state.ty = 0.52 + Math.cos(t * 0.42) * 0.3;
      state.lensT = 0.9;
    }
    state.mx += (state.tx - state.mx) * k(7);
    state.my += (state.ty - state.my) * k(7);
    state.lens += (state.lensT - state.lens) * k(5);
    state.intro += (state.introT - state.intro) * k(2.6);

    gl.uniform2f(u.mouse, state.mx, state.my);
    gl.uniform1f(u.lens, state.lens);
    gl.uniform1f(u.time, t);
    gl.uniform1f(u.intro, state.intro);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    state.raf = requestAnimationFrame(frame);
  }

  return {
    reveal() { state.introT = 1; },
    destroy() {
      state.dead = true;
      cancelAnimationFrame(state.raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    },
  };
}
