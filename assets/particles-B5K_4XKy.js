import{W as J,S as N,P as K,B as Q,a as V,V as Z,b as tt,c as et,A as at,d as ot,D as nt,M as rt}from"./three.module-PexeZNWx.js";const st=`
attribute vec3 aA; attribute vec3 aB; attribute vec3 aC; attribute vec3 aD;
attribute vec3 aColA; attribute vec3 aColB; attribute vec3 aColC; attribute vec3 aColD;
attribute vec3 aReal;
attribute vec4 aRand;
uniform float uTime, uMorph, uPixel, uSize, uDisperse, uShockT;
uniform vec2 uShockP;
uniform int uFrom, uTo;
uniform vec3 uTrail[12];
varying vec3 vCol;
varying float vAlpha;

vec3 pick(int i) { if (i == 0) return aA; if (i == 1) return aB; if (i == 2) return aC; return aD; }
vec3 pickCol(int i) { if (i == 0) return aColA; if (i == 1) return aColB; if (i == 2) return aColC; return aColD; }

void main() {
  vec3 pf = pick(uFrom);
  vec3 pt = pick(uTo);
  float t = clamp(uMorph * 1.75 - aRand.w * 0.75, 0.0, 1.0);
  float e = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(pf, pt, e);

  float bell = sin(3.14159265 * t);
  vec3 turb = vec3(
    sin(pf.y * 1.3 + uTime * 0.9 + aRand.x * 6.0),
    sin(pf.z * 1.1 + pf.x * 0.7 + uTime * 0.8 + aRand.y * 6.0),
    cos(pf.x * 1.2 + uTime + aRand.z * 6.0));
  p += turb * bell * (1.2 + aRand.z * 3.0);
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
    p.xy += normalize(dv + 1e-4) * ring * 1.6 * fade;
    p.z += ring * 2.4 * fade;
  }

  p += vec3(aRand.x - 0.5, aRand.y - 0.1, aRand.z - 0.5) * 16.0 * uDisperse * uDisperse;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.78 + 0.22 * sin(uTime * 2.0 + aRand.x * 30.0);
  gl_PointSize = uSize * uPixel * (0.8 + aRand.y * 0.9) * tw * (22.0 / -mv.z) * (1.0 + lens * 0.8);

  vec3 col = mix(pickCol(uFrom), pickCol(uTo), e);
  float faceW = (uFrom == 1 ? 1.0 - e : 0.0) + (uTo == 1 ? e : 0.0);
  col = mix(col, aReal, clamp(lens * 1.4, 0.0, 1.0) * faceW);
  col += vec3(1.0, 0.45, 0.15) * bell * 0.5;
  vCol = col;
  vAlpha = (1.0 - uDisperse) * (0.34 + 0.4 * aRand.w);
}`,it=`
precision highp float;
varying vec3 vCol;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vCol, a * vAlpha);
}`,E=[1,.3,.12],L=[1,.93,.86];function lt(r,y){const C=Math.random()*y;let h=0,p=r.length-1;for(;h<p;){const F=h+p>>1;r[F]<C?h=F+1:p=F}return h}function Y(r,y,C,h,p,F,S,T,v=!1){const x=Math.max(300,Math.round(1100*h/C)),m=document.createElement("canvas");m.width=1100,m.height=x;const w=m.getContext("2d",{willReadFrequently:!0});let M=x*.4;w.font=`${y.weight} ${M}px ${y.family}`;const f=Math.max(...r.map(n=>w.measureText(n).width)),z=y.lh||.88;M*=Math.min(p*1100/f,F*x/(r.length*z)),w.font=`${y.weight} ${M}px ${y.family}`,w.fillStyle="#fff",w.textAlign="center",w.textBaseline="middle";const g=r.length*z*M;r.forEach((n,c)=>w.fillText(n,1100/2,x/2-g/2+(c+.5)*z*M+M*(y.dy||0)));const d=w.getImageData(0,0,1100,x).data,R=[],s=[];for(let n=0;n<x;n++)for(let c=0;c<1100;c++)d[(n*1100+c)*4+3]>150&&(R.push(c),s.push(n));const u=new Float32Array(S*3),l=new Float32Array(S*3);for(let n=0;n<S;n++){const c=Math.random()*R.length|0;u[n*3]=((R[c]+Math.random()-.5)/1100-.5)*C,u[n*3+1]=(.5-(s[c]+Math.random()-.5)/x)*h,u[n*3+2]=(Math.random()-.5)*T;const A=(v?Math.random()<.88:Math.random()<.2)?E:L,b=.75+Math.random()*.25;l[n*3]=A[0]*b,l[n*3+1]=A[1]*b,l[n*3+2]=A[2]*b}return{pos:u,col:l}}function ct(r,y,C,h){const S=document.createElement("canvas");S.width=360,S.height=480;const T=S.getContext("2d",{willReadFrequently:!0}),v=r.naturalWidth/r.naturalHeight;let D=r.naturalWidth,x=r.naturalHeight;v>360/480?D=x*(360/480):x=D/(360/480),T.drawImage(r,(r.naturalWidth-D)/2,0,D,x,0,0,360,480);const m=T.getImageData(0,0,360,480).data,w=new Float64Array(360*480);let M=0;for(let s=0;s<480;s++)for(let u=0;u<360;u++){const l=s*360+u,n=(m[l*4]*.299+m[l*4+1]*.587+m[l*4+2]*.114)/255,c=(u/360-.5)*2,A=(s/480-.46)*2,b=Math.sqrt(c*c*.85+A*A*.8),t=Math.min(1,Math.max(0,(1.05-b)/.5));M+=(.06+Math.pow(1-n,1.5))*t*t,w[l]=M}let f=C*.96,z=f*.75;z>y*.94&&(z=y*.94,f=z/.75);const g=new Float32Array(h*3),d=new Float32Array(h*3),R=new Float32Array(h*3);for(let s=0;s<h;s++){const u=lt(w,M),l=u%360,n=u/360|0,c=m[u*4]/255,A=m[u*4+1]/255,b=m[u*4+2]/255,t=1-(c*.299+A*.587+b*.114);g[s*3]=((l+Math.random())/360-.5)*z,g[s*3+1]=(.5-(n+Math.random())/480)*f-C*.01,g[s*3+2]=(t-.45)*2.2+(Math.random()-.5)*.12;const I=Math.min(1,Math.max(0,(t-.58)/.28)),B=.7+t*.45;d[s*3]=(E[0]+(L[0]-E[0])*I)*B,d[s*3+1]=(E[1]+(L[1]-E[1])*I)*B,d[s*3+2]=(E[2]+(L[2]-E[2])*I)*B,R[s*3]=Math.min(1,Math.pow(c,.7)*1.25),R[s*3+1]=Math.min(1,Math.pow(A,.7)*1.25),R[s*3+2]=Math.min(1,Math.pow(b,.7)*1.25)}return{pos:g,col:d,real:R}}async function ft(r,{photo:y,mobile:C,onStage:h}){let p;try{p=new J({canvas:r,antialias:!1,alpha:!1,powerPreference:"high-performance"})}catch{return null}const F=Math.min(window.devicePixelRatio||1,C?1.5:2);p.setPixelRatio(F),p.setClearColor(789515,1);const S=new N,T=new K(35,1,.1,120);T.position.z=22;const v=C?38e3:85e3,D=new Image,x=new Promise(e=>{D.onload=e,D.onerror=e});D.src=y,await Promise.all([x,document.fonts?document.fonts.load('800 200px "Inter Tight"'):null,document.fonts?document.fonts.load('500 200px "JetBrains Mono"'):null].filter(Boolean));const m=new Q;m.setAttribute("position",new V(new Float32Array(v*3),3));const w=(e,a,i=3)=>{const o=new V(a,i);return o.setUsage(nt),m.setAttribute(e,o),o},M=new Float32Array(v*4);for(let e=0;e<v*4;e++)M[e]=Math.random();w("aRand",M,4);const f={},z=()=>new Float32Array(v*3);["aA","aB","aC","aD","aColA","aColB","aColC","aColD","aReal"].forEach(e=>{f[e]=w(e,z())});let g=1,d=1;const R=()=>{const e=r.clientWidth||1,a=r.clientHeight||1,i=e/a;d=2*T.position.z*Math.tan(rt.degToRad(T.fov/2)),g=d*i;const o=i<1.05,k=o?Y(["ARIYAN","SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.84,dy:.02},g,d,.9,.5,v,.5):Y(["ARIYAN SAMAL"],{weight:800,family:'"Inter Tight", sans-serif',lh:.9,dy:.02},g,d,.9,.46,v,.5),P=Y(["</>"],{weight:500,family:'"JetBrains Mono", monospace',lh:1},g,d,o?.9:.62,o?.3:.55,v,1.4),W=ct(D,g,d,v),H=Y(["ACCESS GRANTED"],{weight:800,family:'"Inter Tight", sans-serif',lh:.9,dy:.02},g,d,o?.9:.79,.3,v,.3,!0);f.aA.array.set(k.pos),f.aColA.array.set(k.col),f.aB.array.set(W.pos),f.aColB.array.set(W.col),f.aReal.array.set(W.real),f.aC.array.set(P.pos),f.aColC.array.set(P.col),f.aD.array.set(H.pos),f.aColD.array.set(H.col),Object.values(f).forEach(X=>{X.needsUpdate=!0})},s=Array.from({length:12},()=>({x:0,y:0,t:-99})),u=Array.from({length:12},()=>new Z(0,0,0)),l=new tt({vertexShader:st,fragmentShader:it,transparent:!0,depthWrite:!1,blending:at,uniforms:{uTime:{value:0},uMorph:{value:0},uPixel:{value:F},uSize:{value:C?2:1.7},uDisperse:{value:0},uShockT:{value:0},uShockP:{value:new et},uFrom:{value:3},uTo:{value:0},uTrail:{value:u}}}),n=new ot(m,l);n.frustumCulled=!1,S.add(n);const c=()=>{const e=r.clientWidth,a=r.clientHeight;!e||!a||(p.setSize(e,a,!1),T.aspect=e/a,T.updateProjectionMatrix())};c(),R();let A=0;const b=new ResizeObserver(()=>{c(),clearTimeout(A),A=setTimeout(R,220)});b.observe(r);const t={from:3,to:0,morph:1,dur:2.6,started:!1,stage:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,shock:-1,disperse:0,timer:0,pauseUntil:0,px:99,py:99,gov:{sum:0,n:0,level:0}},I=[2.5,6.4,4.2],B=(e,a)=>{e===t.stage&&t.morph>=1||(t.from=t.morph>=1?t.stage<0?3:t.stage:t.to,t.to=e,t.stage=e,t.morph=0,t.timer=0,l.uniforms.uFrom.value=t.from,l.uniforms.uTo.value=t.to,a&&(t.pauseUntil=performance.now()+9e3),h&&h(e))},q=(e,a)=>{const i=r.getBoundingClientRect();return[((e-i.left)/i.width-.5)*g,(.5-(a-i.top)/i.height)*d]},_=(e,a,i)=>{const o=e-t.px,k=a-t.py;if(o*o+k*k<.05)return;t.px=e,t.py=a;const P=s[t.ti||0];P.x=e,P.y=a,P.t=i,t.ti=((t.ti||0)+1)%12},O=e=>{const a=r.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom)return;t.mx=(e.clientX-a.left)/a.width*2-1,t.my=(e.clientY-a.top)/a.height*2-1;const[i,o]=q(e.clientX,e.clientY);_(i,o,performance.now())},$=e=>{const a=r.getBoundingClientRect();if(e.clientY<a.top||e.clientY>a.bottom||e.target.closest&&e.target.closest("button,a,input"))return;const[i,o]=q(e.clientX,e.clientY);l.uniforms.uShockP.value.set(i,o),t.shock=0};window.addEventListener("pointermove",O,{passive:!0}),window.addEventListener("pointerdown",$,{passive:!0});const G=new IntersectionObserver(([e])=>{t.visible=e.isIntersecting,t.visible&&!t.dead&&!t.raf&&(t.last=0,t.raf=requestAnimationFrame(U))});G.observe(r);const j=performance.now();function U(e){if(t.raf=0,t.dead||!t.visible)return;const a=Math.min((e-(t.last||e))/1e3,.1);if(t.last=e,t.started&&a>0){const o=t.gov;if(o.sum+=a,o.n+=1,o.n>=45){const k=o.sum/o.n;o.sum=0,o.n=0,k>.03&&o.level<2&&(o.level+=1,o.level===1?(p.setPixelRatio(1),l.uniforms.uPixel.value=1,c()):m.setDrawRange(0,Math.floor(v*.45)))}}const i=l.uniforms;i.uTime.value=(e-j)/1e3,t.started&&(t.morph<1?(t.morph=Math.min(1,t.morph+a/t.dur),t.morph>=1&&(t.timer=0)):e>t.pauseUntil&&(t.timer+=a,t.timer>I[t.stage]&&B((t.stage+1)%3,!1)),i.uMorph.value=t.morph),t.shock>=0&&(t.shock+=a,i.uShockT.value=t.shock,t.shock>4&&(t.shock=-1,i.uShockT.value=0));for(let o=0;o<12;o++){const k=s[o],P=(e-k.t)/1e3,W=P>=1.7?0:Math.pow(1-P/1.7,.8);u[o].set(k.x,k.y,W)}t.mxs+=(t.mx-t.mxs)*(1-Math.exp(-3*a)),t.mys+=(t.my-t.mys)*(1-Math.exp(-3*a)),n.rotation.y=t.mxs*.22,n.rotation.x=t.mys*.1,i.uDisperse.value+=(t.disperse-i.uDisperse.value)*(1-Math.exp(-6*a)),p.render(S,T),t.raf=requestAnimationFrame(U)}return t.raf=requestAnimationFrame(U),{reveal(){t.started||(t.started=!0,B(0,!1))},goTo(e){t.started=!0,B(e,!0)},shock(e=0,a=0){l.uniforms.uShockP.value.set(e,a),t.shock=0},setDisperse(e){t.disperse=e},destroy(){t.dead=!0,cancelAnimationFrame(t.raf),clearTimeout(A),G.disconnect(),b.disconnect(),window.removeEventListener("pointermove",O),window.removeEventListener("pointerdown",$),m.dispose(),l.dispose(),p.dispose()}}}export{ft as createHeroParticles};
