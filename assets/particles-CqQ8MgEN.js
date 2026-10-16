import{W as Q,S as Z,P as N,B as tt,a as j,V as et,b as at,c as ot,A as nt,d as rt,M as it,D as st}from"./three.module-PexeZNWx.js";const lt=`
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
}`,ct=`
precision highp float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vCol, a * vAlpha);
}`,B=[1,.3,.12],ut=[1,.13,.1],E=[1,.93,.86];function ft(n,T){const C=Math.random()*T;let v=0,w=n.length-1;for(;v<w;){const S=v+w>>1;n[S]<C?v=S+1:w=S}return v}function O(n,T,C,v,w,S,k,m,M=""){const l=k<5e4?640:1100,b=Math.max(300,Math.round(l*v/C)),s=document.createElement("canvas");s.width=l,s.height=b;const g=s.getContext("2d",{willReadFrequently:!0});let y=b*.4;g.font=`${T.weight} ${y}px ${T.family}`;const c=Math.max(...n.map(i=>g.measureText(i).width)),R=T.lh||.88;y*=Math.min(w*l/c,S*b/(n.length*R)),g.font=`${T.weight} ${y}px ${T.family}`,g.fillStyle="#fff",g.textAlign="center",g.textBaseline="middle";const h=n.length*R*y;n.forEach((i,x)=>g.fillText(i,l/2,b/2-h/2+(x+.5)*R*y+y*(T.dy||0)));const d=g.getImageData(0,0,l,b).data,D=[],u=[];for(let i=0;i<b;i++)for(let x=0;x<l;x++)d[(i*l+x)*4+3]>150&&(D.push(x),u.push(i));const o=new Float32Array(k*3),A=new Float32Array(k*3);for(let i=0;i<k;i++){const x=Math.random()*D.length|0;o[i*3]=((D[x]+Math.random()-.5)/l-.5)*C,o[i*3+1]=(.5-(u[x]+Math.random()-.5)/b)*v,o[i*3+2]=(Math.random()-.5)*m;const z=Math.random(),F=M==="red"?z<.5?ut:z<.8?E:B:z<.2?B:E,P=.75+Math.random()*.25;A[i*3]=F[0]*P,A[i*3+1]=F[1]*P,A[i*3+2]=F[2]*P}return{pos:o,col:A}}function mt(n,T,C,v){const k=document.createElement("canvas");k.width=360,k.height=480;const m=k.getContext("2d",{willReadFrequently:!0}),M=n.naturalWidth/n.naturalHeight;let l=n.naturalWidth,b=n.naturalHeight;M>360/480?l=b*(360/480):b=l/(360/480),m.drawImage(n,(n.naturalWidth-l)/2,0,l,b,0,0,360,480);const s=m.getImageData(0,0,360,480).data,g=new Float64Array(360*480);let y=0;for(let u=0;u<480;u++)for(let o=0;o<360;o++){const A=u*360+o,i=(s[A*4]*.299+s[A*4+1]*.587+s[A*4+2]*.114)/255,x=(o/360-.5)*2,z=(u/480-.46)*2,F=Math.sqrt(x*x*.85+z*z*.8),P=Math.min(1,Math.max(0,(1.05-F)/.5));y+=(.06+Math.pow(1-i,1.5))*P*P,g[A]=y}let c=C*.96,R=c*.75;R>T*.94&&(R=T*.94,c=R/.75);const h=new Float32Array(v*3),d=new Float32Array(v*3),D=new Float32Array(v*3);for(let u=0;u<v;u++){const o=ft(g,y),A=o%360,i=o/360|0,x=s[o*4]/255,z=s[o*4+1]/255,F=s[o*4+2]/255,P=1-(x*.299+z*.587+F*.114);h[u*3]=((A+Math.random())/360-.5)*R,h[u*3+1]=(.5-(i+Math.random())/480)*c-C*.01,h[u*3+2]=(P-.45)*2.2+(Math.random()-.5)*.12;const H=Math.min(1,Math.max(0,(P-.58)/.28)),t=.7+P*.45;d[u*3]=(B[0]+(E[0]-B[0])*H)*t,d[u*3+1]=(B[1]+(E[1]-B[1])*H)*t,d[u*3+2]=(B[2]+(E[2]-B[2])*H)*t,D[u*3]=Math.min(1,Math.pow(x,.7)*1.25),D[u*3+1]=Math.min(1,Math.pow(z,.7)*1.25),D[u*3+2]=Math.min(1,Math.pow(F,.7)*1.25)}return{pos:h,col:d,real:D}}function ht(n,T,C){const v=new Float32Array(n*3),w=new Float32Array(n*3),S=Math.min(C*.8,T*.92),k=3;for(let m=0;m<n;m++){const M=Math.random(),l=M<.15,b=!l&&M<.23;let s,g,y,c;if(l)s=Math.abs(Math.random()+Math.random()+Math.random()-1.5)*2.8,g=Math.random()*Math.PI*2,y=(Math.random()-.5)*1.8,c=0;else if(b)s=S*(.25+Math.random()*.95),g=Math.random()*Math.PI*2,y=(Math.random()-.5)*3,c=Math.min(1,s/S);else{const d=Math.pow(Math.random(),.7);s=1+d*S,g=s*.62+m%k*(Math.PI*2/k)+(Math.random()-.5)*(.07+d*.15),y=(Math.random()-.5)*(1.6-d*1.1),c=d}v[m*3]=Math.cos(g)*s,v[m*3+1]=Math.sin(g)*s*.62,v[m*3+2]=y;const R=l?E:b||Math.random()<.22+c*.5?B:E;let h=l?.95:b?.45:(1-c*.45)*(.7+Math.random()*.45);Math.random()<.05&&(h=Math.min(1.5,h*1.6)),w[m*3]=R[0]*h,w[m*3+1]=R[1]*h,w[m*3+2]=R[2]*h}return{pos:v,col:w}}async function pt(n,{photo:T,mobile:C,onStage:v}){let w;try{w=new Q({canvas:n,antialias:!1,alpha:!1,powerPreference:"high-performance"})}catch{return null}const S=Math.min(window.devicePixelRatio||1,C?1.25:2);w.setPixelRatio(S),w.setClearColor(789515,1);const k=new Z,m=new N(35,1,.1,120);m.position.z=22;const M=C?3e4:85e3,l=new Image,b=new Promise(e=>{l.onload=e,l.onerror=e});l.src=T,await Promise.all([b,document.fonts?document.fonts.load('800 200px "Inter Tight"'):null,document.fonts?document.fonts.load('500 200px "JetBrains Mono"'):null].filter(Boolean));const s=new tt;s.setAttribute("position",new j(new Float32Array(M*3),3));const g=(e,a,r=3)=>{const p=new j(a,r);return p.setUsage(st),s.setAttribute(e,p),p},y=new Float32Array(M*4);for(let e=0;e<M*4;e++)y[e]=Math.random();g("aRand",y,4);const c={},R=()=>new Float32Array(M*3);["aA","aB","aC","aD","aColA","aColB","aColC","aColD","aReal"].forEach(e=>{c[e]=g(e,R())});let h=1,d=1;const D=Array.from({length:12},()=>({x:0,y:0,t:-99})),u=Array.from({length:12},()=>new et(0,0,0)),o=new at({vertexShader:lt,fragmentShader:ct,transparent:!0,depthWrite:!1,blending:nt,uniforms:{uTime:{value:0},uMorph:{value:0},uPixel:{value:S},uSize:{value:C?2:1.7},uDisperse:{value:0},uShockT:{value:0},uSpin:{value:0},uTension:{value:0},uShockAmp:{value:1},uW:{value:22},uH:{value:13.9},uShockP:{value:new ot},uFrom:{value:3},uTo:{value:0},uTrail:{value:u}}}),A=new rt(s,o);A.frustumCulled=!1,k.add(A);const i=()=>{const e=n.clientWidth,a=n.clientHeight;!e||!a||(w.setSize(e,a,!1),m.aspect=e/a,m.updateProjectionMatrix())};i(),await z();const x=()=>new Promise(e=>requestAnimationFrame(()=>e()));async function z(){const e=n.clientWidth||1,a=n.clientHeight||1,r=e/a;d=2*m.position.z*Math.tan(it.degToRad(m.fov/2)),h=d*r,o.uniforms.uW.value=h,o.uniforms.uH.value=d;const p=r<1.05,W=p?O(["ARIYAN","SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.84,dy:.02},h,d,.9,.5,M,.5,"red"):O(["ARIYAN SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.9,dy:.02},h,d,.9,.46,M,.5,"red");c.aA.array.set(W.pos),c.aColA.array.set(W.col),await x();const f=O(["</>"],{weight:500,family:'"JetBrains Mono", monospace',lh:1},h,d,p?.9:.62,p?.3:.55,M,1.4);c.aC.array.set(f.pos),c.aColC.array.set(f.col),await x();const I=mt(l,h,d,M);c.aB.array.set(I.pos),c.aColB.array.set(I.col),c.aReal.array.set(I.real),await x();const Y=ht(M,h,d);c.aD.array.set(Y.pos),c.aColD.array.set(Y.col),Object.values(c).forEach(U=>{U.needsUpdate=!0})}let F=0,P=!0;const H=new ResizeObserver(()=>{if(i(),P){P=!1;return}clearTimeout(F),F=setTimeout(()=>{z()},220)});H.observe(n);const t={from:3,to:0,morph:1,dur:2.6,started:!1,stage:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,shock:-1,disperse:0,timer:0,pauseUntil:0,px:99,py:99,gov:{sum:0,n:0,level:0},spin:0,revealAt:0,live:!1,drawn:!1},X=[2.5,6.4,4.2],q=(e,a)=>{e===t.stage&&t.morph>=1||(t.from=t.morph>=1?t.stage<0?3:t.stage:t.to,t.dur=t.from===3?3.6:2.6,t.to=e,t.stage=e,t.morph=0,t.timer=0,o.uniforms.uFrom.value=t.from,o.uniforms.uTo.value=t.to,a&&(t.pauseUntil=performance.now()+9e3),v&&v(e))},$=(e,a)=>{const r=n.getBoundingClientRect();return[((e-r.left)/r.width-.5)*h,(.5-(a-r.top)/r.height)*d]},J=(e,a,r)=>{const p=e-t.px,W=a-t.py;if(p*p+W*W<.05)return;t.px=e,t.py=a;const f=D[t.ti||0];f.x=e,f.y=a,f.t=r,t.ti=((t.ti||0)+1)%12},V=e=>{const a=n.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom)return;t.mx=(e.clientX-a.left)/a.width*2-1,t.my=(e.clientY-a.top)/a.height*2-1;const[r,p]=$(e.clientX,e.clientY);J(r,p,performance.now())},G=e=>{const a=n.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom||e.target.closest&&e.target.closest("button,a,input"))return;const[r,p]=$(e.clientX,e.clientY);o.uniforms.uShockAmp.value=1,o.uniforms.uShockP.value.set(r,p),t.shock=0};window.addEventListener("pointermove",V,{passive:!0}),window.addEventListener("pointerdown",G,{passive:!0});const _=new IntersectionObserver(([e])=>{t.visible=e.isIntersecting,t.visible&&!t.dead&&!t.raf&&(t.last=0,t.raf=requestAnimationFrame(L))});_.observe(n);const K=performance.now();function L(e){if(t.raf=0,t.dead||!t.visible)return;const a=Math.min((e-(t.last||e))/1e3,.1);if(t.last=e,t.started&&a>0){const f=t.gov;if(f.sum+=a,f.n+=1,f.n>=45){const I=f.sum/f.n;f.sum=0,f.n=0,I>.03&&f.level<2&&(f.level+=1,f.level===1?(w.setPixelRatio(1),o.uniforms.uPixel.value=1,i()):s.setDrawRange(0,Math.floor(M*.45)))}}const r=o.uniforms;r.uTime.value=(e-K)/1e3;let p=0;!t.started&&t.revealAt?p=Math.min(1,Math.max(0,1-(t.revealAt-e/1e3)/.9)):t.started&&t.from===3&&t.morph<1&&(p=1),p*=p,t.spin+=a*(.9+2.6*p),r.uSpin.value=t.spin,r.uTension.value=p;const W=t.started&&t.from===3&&t.morph<.3?Math.sin(Math.PI*Math.min(1,t.morph/.3))*.22:0;A.position.set((Math.random()-.5)*W,(Math.random()-.5)*W,0),t.started&&(t.morph<1?(t.morph=Math.min(1,t.morph+a/t.dur),t.morph>=1&&(t.timer=0)):e>t.pauseUntil&&(t.timer+=a,t.timer>X[t.stage]&&q((t.stage+1)%3,!1)),r.uMorph.value=t.morph),t.shock>=0&&(t.shock+=a,r.uShockT.value=t.shock,t.shock>4&&(t.shock=-1,r.uShockT.value=0));for(let f=0;f<12;f++){const I=D[f],Y=(e-I.t)/1e3,U=Y>=1.7?0:Math.pow(1-Y/1.7,.8);u[f].set(I.x,I.y,U)}t.mxs+=(t.mx-t.mxs)*(1-Math.exp(-3*a)),t.mys+=(t.my-t.mys)*(1-Math.exp(-3*a)),A.rotation.y=t.mxs*.22,A.rotation.x=t.mys*.1,r.uDisperse.value+=(t.disperse-r.uDisperse.value)*(1-Math.exp(-6*a)),(t.live||!t.drawn)&&(w.render(k,m),t.drawn=!0),t.raf=requestAnimationFrame(L)}return t.raf=requestAnimationFrame(L),{reveal(e=3.4){t.live=!0,!(t.started||t.pending)&&(t.revealAt=performance.now()/1e3+e,t.pending=setTimeout(()=>{t.pending=0,!(t.started||t.dead)&&(t.started=!0,q(0,!1),setTimeout(()=>{t.dead||(o.uniforms.uShockAmp.value=1,o.uniforms.uShockP.value.set(0,0),t.shock=0)},1080),setTimeout(()=>{t.dead||(o.uniforms.uShockAmp.value=.28,o.uniforms.uShockP.value.set(0,0),t.shock=0)},3350))},e*1e3))},goTo(e){t.live=!0,clearTimeout(t.pending),t.pending=0,t.revealAt=0,t.started=!0,q(e,!0)},shock(e=0,a=0,r=1){o.uniforms.uShockAmp.value=r,o.uniforms.uShockP.value.set(e,a),t.shock=0},setDisperse(e){t.disperse=e},destroy(){t.dead=!0,cancelAnimationFrame(t.raf),clearTimeout(F),clearTimeout(t.pending),_.disconnect(),H.disconnect(),window.removeEventListener("pointermove",V),window.removeEventListener("pointerdown",G),s.dispose(),o.dispose(),w.dispose()}}}export{pt as createHeroParticles};
