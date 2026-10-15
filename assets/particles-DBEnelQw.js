import{W as J,S as K,P as Q,B as Z,a as _,V as N,b as tt,c as et,A as at,d as ot,D as nt,M as rt}from"./three.module-PexeZNWx.js";const it=`
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
}`,st=`
precision highp float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vCol, a * vAlpha);
}`,D=[1,.3,.12],lt=[1,.13,.1],E=[1,.93,.86];function ct(o,A){const R=Math.random()*A;let p=0,g=o.length-1;for(;p<g;){const C=p+g>>1;o[C]<R?p=C+1:g=C}return p}function q(o,A,R,p,g,C,S,h,M=""){const b=Math.max(300,Math.round(1100*p/R)),i=document.createElement("canvas");i.width=1100,i.height=b;const v=i.getContext("2d",{willReadFrequently:!0});let x=b*.4;v.font=`${A.weight} ${x}px ${A.family}`;const l=Math.max(...o.map(r=>v.measureText(r).width)),k=A.lh||.88;x*=Math.min(g*1100/l,C*b/(o.length*k)),v.font=`${A.weight} ${x}px ${A.family}`,v.fillStyle="#fff",v.textAlign="center",v.textBaseline="middle";const f=o.length*k*x;o.forEach((r,w)=>v.fillText(r,1100/2,b/2-f/2+(w+.5)*k*x+x*(A.dy||0)));const m=v.getImageData(0,0,1100,b).data,z=[],c=[];for(let r=0;r<b;r++)for(let w=0;w<1100;w++)m[(r*1100+w)*4+3]>150&&(z.push(w),c.push(r));const y=new Float32Array(S*3),n=new Float32Array(S*3);for(let r=0;r<S;r++){const w=Math.random()*z.length|0;y[r*3]=((z[w]+Math.random()-.5)/1100-.5)*R,y[r*3+1]=(.5-(c[w]+Math.random()-.5)/b)*p,y[r*3+2]=(Math.random()-.5)*h;const P=Math.random(),F=M==="red"?P<.5?lt:P<.8?E:D:P<.2?D:E,t=.75+Math.random()*.25;n[r*3]=F[0]*t,n[r*3+1]=F[1]*t,n[r*3+2]=F[2]*t}return{pos:y,col:n}}function ut(o,A,R,p){const S=document.createElement("canvas");S.width=360,S.height=480;const h=S.getContext("2d",{willReadFrequently:!0}),M=o.naturalWidth/o.naturalHeight;let T=o.naturalWidth,b=o.naturalHeight;M>360/480?T=b*(360/480):b=T/(360/480),h.drawImage(o,(o.naturalWidth-T)/2,0,T,b,0,0,360,480);const i=h.getImageData(0,0,360,480).data,v=new Float64Array(360*480);let x=0;for(let c=0;c<480;c++)for(let y=0;y<360;y++){const n=c*360+y,r=(i[n*4]*.299+i[n*4+1]*.587+i[n*4+2]*.114)/255,w=(y/360-.5)*2,P=(c/480-.46)*2,F=Math.sqrt(w*w*.85+P*P*.8),t=Math.min(1,Math.max(0,(1.05-F)/.5));x+=(.06+Math.pow(1-r,1.5))*t*t,v[n]=x}let l=R*.96,k=l*.75;k>A*.94&&(k=A*.94,l=k/.75);const f=new Float32Array(p*3),m=new Float32Array(p*3),z=new Float32Array(p*3);for(let c=0;c<p;c++){const y=ct(v,x),n=y%360,r=y/360|0,w=i[y*4]/255,P=i[y*4+1]/255,F=i[y*4+2]/255,t=1-(w*.299+P*.587+F*.114);f[c*3]=((n+Math.random())/360-.5)*k,f[c*3+1]=(.5-(r+Math.random())/480)*l-R*.01,f[c*3+2]=(t-.45)*2.2+(Math.random()-.5)*.12;const H=Math.min(1,Math.max(0,(t-.58)/.28)),W=.7+t*.45;m[c*3]=(D[0]+(E[0]-D[0])*H)*W,m[c*3+1]=(D[1]+(E[1]-D[1])*H)*W,m[c*3+2]=(D[2]+(E[2]-D[2])*H)*W,z[c*3]=Math.min(1,Math.pow(w,.7)*1.25),z[c*3+1]=Math.min(1,Math.pow(P,.7)*1.25),z[c*3+2]=Math.min(1,Math.pow(F,.7)*1.25)}return{pos:f,col:m,real:z}}function ht(o,A,R){const p=new Float32Array(o*3),g=new Float32Array(o*3),C=Math.min(R*.8,A*.92),S=3;for(let h=0;h<o;h++){const M=Math.random(),T=M<.15,b=!T&&M<.23;let i,v,x,l;if(T)i=Math.abs(Math.random()+Math.random()+Math.random()-1.5)*2.8,v=Math.random()*Math.PI*2,x=(Math.random()-.5)*1.8,l=0;else if(b)i=C*(.25+Math.random()*.95),v=Math.random()*Math.PI*2,x=(Math.random()-.5)*3,l=Math.min(1,i/C);else{const m=Math.pow(Math.random(),.7);i=1+m*C,v=i*.62+h%S*(Math.PI*2/S)+(Math.random()-.5)*(.07+m*.15),x=(Math.random()-.5)*(1.6-m*1.1),l=m}p[h*3]=Math.cos(v)*i,p[h*3+1]=Math.sin(v)*i*.62,p[h*3+2]=x;const k=T?E:b||Math.random()<.22+l*.5?D:E;let f=T?.95:b?.45:(1-l*.45)*(.7+Math.random()*.45);Math.random()<.05&&(f=Math.min(1.5,f*1.6)),g[h*3]=k[0]*f,g[h*3+1]=k[1]*f,g[h*3+2]=k[2]*f}return{pos:p,col:g}}async function mt(o,{photo:A,mobile:R,onStage:p}){let g;try{g=new J({canvas:o,antialias:!1,alpha:!1,powerPreference:"high-performance"})}catch{return null}const C=Math.min(window.devicePixelRatio||1,R?1.5:2);g.setPixelRatio(C),g.setClearColor(789515,1);const S=new K,h=new Q(35,1,.1,120);h.position.z=22;const M=R?38e3:85e3,T=new Image,b=new Promise(e=>{T.onload=e,T.onerror=e});T.src=A,await Promise.all([b,document.fonts?document.fonts.load('800 200px "Inter Tight"'):null,document.fonts?document.fonts.load('500 200px "JetBrains Mono"'):null].filter(Boolean));const i=new Z;i.setAttribute("position",new _(new Float32Array(M*3),3));const v=(e,a,s=3)=>{const d=new _(a,s);return d.setUsage(nt),i.setAttribute(e,d),d},x=new Float32Array(M*4);for(let e=0;e<M*4;e++)x[e]=Math.random();v("aRand",x,4);const l={},k=()=>new Float32Array(M*3);["aA","aB","aC","aD","aColA","aColB","aColC","aColD","aReal"].forEach(e=>{l[e]=v(e,k())});let f=1,m=1;const z=()=>{const e=o.clientWidth||1,a=o.clientHeight||1,s=e/a;m=2*h.position.z*Math.tan(rt.degToRad(h.fov/2)),f=m*s,typeof n<"u"&&(n.uniforms.uW.value=f,n.uniforms.uH.value=m);const d=s<1.05,I=d?q(["ARIYAN","SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.84,dy:.02},f,m,.9,.5,M,.5,"red"):q(["ARIYAN SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.9,dy:.02},f,m,.9,.46,M,.5,"red"),u=q(["</>"],{weight:500,family:'"JetBrains Mono", monospace',lh:1},f,m,d?.9:.62,d?.3:.55,M,1.4),B=ut(T,f,m,M),Y=ht(M,f,m);l.aA.array.set(I.pos),l.aColA.array.set(I.col),l.aB.array.set(B.pos),l.aColB.array.set(B.col),l.aReal.array.set(B.real),l.aC.array.set(u.pos),l.aColC.array.set(u.col),l.aD.array.set(Y.pos),l.aColD.array.set(Y.col),Object.values(l).forEach(U=>{U.needsUpdate=!0})},c=Array.from({length:12},()=>({x:0,y:0,t:-99})),y=Array.from({length:12},()=>new N(0,0,0)),n=new tt({vertexShader:it,fragmentShader:st,transparent:!0,depthWrite:!1,blending:at,uniforms:{uTime:{value:0},uMorph:{value:0},uPixel:{value:C},uSize:{value:R?2:1.7},uDisperse:{value:0},uShockT:{value:0},uSpin:{value:0},uTension:{value:0},uShockAmp:{value:1},uW:{value:22},uH:{value:13.9},uShockP:{value:new et},uFrom:{value:3},uTo:{value:0},uTrail:{value:y}}}),r=new ot(i,n);r.frustumCulled=!1,S.add(r);const w=()=>{const e=o.clientWidth,a=o.clientHeight;!e||!a||(g.setSize(e,a,!1),h.aspect=e/a,h.updateProjectionMatrix())};w(),z();let P=0;const F=new ResizeObserver(()=>{w(),clearTimeout(P),P=setTimeout(z,220)});F.observe(o);const t={from:3,to:0,morph:1,dur:2.6,started:!1,stage:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,shock:-1,disperse:0,timer:0,pauseUntil:0,px:99,py:99,gov:{sum:0,n:0,level:0},spin:0,revealAt:0},H=[2.5,6.4,4.2],W=(e,a)=>{e===t.stage&&t.morph>=1||(t.from=t.morph>=1?t.stage<0?3:t.stage:t.to,t.dur=t.from===3?3.6:2.6,t.to=e,t.stage=e,t.morph=0,t.timer=0,n.uniforms.uFrom.value=t.from,n.uniforms.uTo.value=t.to,a&&(t.pauseUntil=performance.now()+9e3),p&&p(e))},O=(e,a)=>{const s=o.getBoundingClientRect();return[((e-s.left)/s.width-.5)*f,(.5-(a-s.top)/s.height)*m]},j=(e,a,s)=>{const d=e-t.px,I=a-t.py;if(d*d+I*I<.05)return;t.px=e,t.py=a;const u=c[t.ti||0];u.x=e,u.y=a,u.t=s,t.ti=((t.ti||0)+1)%12},$=e=>{const a=o.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom)return;t.mx=(e.clientX-a.left)/a.width*2-1,t.my=(e.clientY-a.top)/a.height*2-1;const[s,d]=O(e.clientX,e.clientY);j(s,d,performance.now())},V=e=>{const a=o.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom||e.target.closest&&e.target.closest("button,a,input"))return;const[s,d]=O(e.clientX,e.clientY);n.uniforms.uShockAmp.value=1,n.uniforms.uShockP.value.set(s,d),t.shock=0};window.addEventListener("pointermove",$,{passive:!0}),window.addEventListener("pointerdown",V,{passive:!0});const G=new IntersectionObserver(([e])=>{t.visible=e.isIntersecting,t.visible&&!t.dead&&!t.raf&&(t.last=0,t.raf=requestAnimationFrame(L))});G.observe(o);const X=performance.now();function L(e){if(t.raf=0,t.dead||!t.visible)return;const a=Math.min((e-(t.last||e))/1e3,.1);if(t.last=e,t.started&&a>0){const u=t.gov;if(u.sum+=a,u.n+=1,u.n>=45){const B=u.sum/u.n;u.sum=0,u.n=0,B>.03&&u.level<2&&(u.level+=1,u.level===1?(g.setPixelRatio(1),n.uniforms.uPixel.value=1,w()):i.setDrawRange(0,Math.floor(M*.45)))}}const s=n.uniforms;s.uTime.value=(e-X)/1e3;let d=0;!t.started&&t.revealAt?d=Math.min(1,Math.max(0,1-(t.revealAt-e/1e3)/.9)):t.started&&t.from===3&&t.morph<1&&(d=1),d*=d,t.spin+=a*(.9+2.6*d),s.uSpin.value=t.spin,s.uTension.value=d;const I=t.started&&t.from===3&&t.morph<.3?Math.sin(Math.PI*Math.min(1,t.morph/.3))*.22:0;r.position.set((Math.random()-.5)*I,(Math.random()-.5)*I,0),t.started&&(t.morph<1?(t.morph=Math.min(1,t.morph+a/t.dur),t.morph>=1&&(t.timer=0)):e>t.pauseUntil&&(t.timer+=a,t.timer>H[t.stage]&&W((t.stage+1)%3,!1)),s.uMorph.value=t.morph),t.shock>=0&&(t.shock+=a,s.uShockT.value=t.shock,t.shock>4&&(t.shock=-1,s.uShockT.value=0));for(let u=0;u<12;u++){const B=c[u],Y=(e-B.t)/1e3,U=Y>=1.7?0:Math.pow(1-Y/1.7,.8);y[u].set(B.x,B.y,U)}t.mxs+=(t.mx-t.mxs)*(1-Math.exp(-3*a)),t.mys+=(t.my-t.mys)*(1-Math.exp(-3*a)),r.rotation.y=t.mxs*.22,r.rotation.x=t.mys*.1,s.uDisperse.value+=(t.disperse-s.uDisperse.value)*(1-Math.exp(-6*a)),g.render(S,h),t.raf=requestAnimationFrame(L)}return t.raf=requestAnimationFrame(L),{reveal(e=3.4){t.started||t.pending||(t.revealAt=performance.now()/1e3+e,t.pending=setTimeout(()=>{t.pending=0,!(t.started||t.dead)&&(t.started=!0,W(0,!1),setTimeout(()=>{t.dead||(n.uniforms.uShockAmp.value=1,n.uniforms.uShockP.value.set(0,0),t.shock=0)},1080),setTimeout(()=>{t.dead||(n.uniforms.uShockAmp.value=.28,n.uniforms.uShockP.value.set(0,0),t.shock=0)},3350))},e*1e3))},goTo(e){clearTimeout(t.pending),t.pending=0,t.revealAt=0,t.started=!0,W(e,!0)},shock(e=0,a=0){n.uniforms.uShockP.value.set(e,a),t.shock=0},setDisperse(e){t.disperse=e},destroy(){t.dead=!0,cancelAnimationFrame(t.raf),clearTimeout(P),clearTimeout(t.pending),G.disconnect(),F.disconnect(),window.removeEventListener("pointermove",$),window.removeEventListener("pointerdown",V),i.dispose(),n.dispose(),g.dispose()}}}export{mt as createHeroParticles};
