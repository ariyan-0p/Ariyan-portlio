import{r as _,i as ie,S as ce,P as g,j as a,g as le}from"./index-DMRs05al.js";import{W as ue,S as de,P as me,T as ve,e as he,b as fe,c as B,f as pe,g as Q,L as ge,E as xe,h as ye,G as be,B as Me,a as we,d as je,i as _e,C as Te,M as Se,R as Re}from"./three.module-PexeZNWx.js";const V=15,F=7.8,P=6.4,ee=P*.625,ze=`
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
}`,Ee=`
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
}`,O=n=>new Te(n),Ne=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,C=(n,w,x)=>Math.min(x,Math.max(w,n));function Ce(n,w,{onActive:x,onHover:v,onOpen:b,mobile:y}){let h;try{h=new ue({canvas:n,antialias:!y,alpha:!1,powerPreference:"high-performance"})}catch{return null}const R=Math.min(window.devicePixelRatio||1,y?1.5:1.75);h.setPixelRatio(R),h.setClearColor(789515,1);const T=new de,l=new me(50,1,.1,160),r=w.length,f=new ve,c=w.map((t,s)=>{const o=f.load(t.shot,()=>{o.userData.ready=!0});o.colorSpace=he,o.anisotropy=4;const d=new fe({vertexShader:ze,fragmentShader:Ee,transparent:!0,depthWrite:!1,uniforms:{uTex:{value:o},uVel:{value:0},uTime:{value:0},uHover:{value:0},uOpacity:{value:1},uMouse:{value:new B(.5,.5)},uAccent:{value:O(t.accent)},uInk:{value:O("#0c0c0b")},uBone:{value:O("#ece8e0")}}}),m=new pe(new Q(P,ee,28,18),d),u=new ge(new xe(new Q(P+.3,ee+.3)),new ye({color:15526112,transparent:!0,opacity:.5})),p=new be;return p.add(m,u),p.position.set((s%2?1:-1)*3.5+Math.sin(s*1.7)*.7,Math.cos(s*1.3)*1.1,-s*V),p.rotation.set(Math.cos(s*.9)*.05,Math.sin(s*2.1)*.24,Math.sin(s*1.4)*.05),T.add(p),{group:p,mesh:m,mat:d,frame:u,hover:0,hoverT:0,mouse:new B(.5,.5)}}),S=y?500:1100,M=new Float32Array(S*3);for(let t=0;t<S;t++)M[t*3]=(Math.random()-.5)*36,M[t*3+1]=(Math.random()-.5)*20,M[t*3+2]=14-Math.random()*(r*V+30);const j=new Me;j.setAttribute("position",new we(M,3));const k=new je(j,new _e({color:16731423,size:.07,transparent:!0,opacity:.8,depthWrite:!1,sizeAttenuation:!0}));T.add(k);const e={progress:0,z:F,x:0,y:0,vel:0,active:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,hovered:-1,w:1,h:1,dist:F,xf:.55,init:!1,gov:{sum:0,n:0,level:0}},H=new Re,I=new B,A=()=>{const t=n.clientWidth,s=n.clientHeight;if(!t||!s)return;e.w=t,e.h=s,h.setSize(t,s,!1),l.aspect=t/s,l.fov=t/s<1?70:50,l.updateProjectionMatrix();const o=t/s;e.dist=o<1?Math.min(15,P/.86/(2*Math.tan(Se.degToRad(35))*o)):F,e.xf=o<1?1:.55,e.init||(e.z=e.dist,e.init=!0)};A();const U=new ResizeObserver(A);U.observe(n);const W=(t,s)=>{const o=n.getBoundingClientRect();I.set((t-o.left)/o.width*2-1,-((s-o.top)/o.height)*2+1),H.setFromCamera(I,l);const m=H.intersectObjects(c.map(u=>u.mesh),!1).find(u=>c.findIndex(p=>p.mesh===u.object)>=0&&u.distance<24);return m?{i:c.findIndex(u=>u.mesh===m.object),uv:m.uv}:null},Y=t=>{const s=n.getBoundingClientRect();e.mx=(t.clientX-s.left)/s.width*2-1,e.my=(t.clientY-s.top)/s.height*2-1;const o=W(t.clientX,t.clientY),d=o?o.i:-1;d!==e.hovered&&(e.hovered=d,v&&v(d)),c.forEach((m,u)=>{m.hoverT=u===d?1:0}),o&&c[o.i].mouse.copy(o.uv)},q=()=>{e.hovered=-1,c.forEach(t=>{t.hoverT=0}),v&&v(-1)},X=t=>{const s=W(t.clientX,t.clientY);s?b&&b(s.i):y&&e.active>=0&&b&&b(e.active)};n.addEventListener("pointermove",Y,{passive:!0}),n.addEventListener("pointerleave",q),n.addEventListener("click",X);const J=new IntersectionObserver(([t])=>{e.visible=t.isIntersecting,e.visible&&!e.dead&&!e.raf&&(e.last=0,e.raf=requestAnimationFrame(G))});J.observe(n);const te=performance.now();function G(t){if(e.raf=0,e.dead||!e.visible)return;const s=Math.min((t-(e.last||t))/1e3,.1);e.last=t;const o=i=>1-Math.exp(-i*s),d=(t-te)/1e3;if(s>0){const i=e.gov;if(i.sum+=s,i.n+=1,i.n>=45){const E=i.sum/i.n;i.sum=0,i.n=0,E>.03&&i.level<2&&(i.level+=1,i.level===1?(h.setPixelRatio(1),A()):j.setDrawRange(0,Math.floor(S*.4)))}}const m=C(e.progress,0,1)*(r-1),u=Math.min(Math.floor(m),r-2),p=r===1?0:m-u,D=Ne(C(p,0,1)),$=r===1?0:u+D,z=c[u].group.position,Z=c[Math.min(u+1,r-1)].group.position,se=-$*V+e.dist,oe=(z.x+(Z.x-z.x)*D)*e.xf,ae=(z.y+(Z.y-z.y)*D)*.7,ne=e.z;e.z+=(se-e.z)*o(5.5),e.x+=(oe-e.x)*o(4),e.y+=(ae-e.y)*o(4);const re=(ne-e.z)/Math.max(s,.001);e.vel+=(C(re*.045,-1.6,1.6)-e.vel)*o(8),e.mxs+=(e.mx-e.mxs)*o(3),e.mys+=(e.my-e.mys)*o(3),l.position.set(e.x+e.mxs*.7,e.y-e.mys*.45,e.z),l.rotation.set(-e.mys*.05,-e.mxs*.09,-e.mxs*.015+e.vel*.02);const L=Math.round($);L!==e.active&&(e.active=L,x&&x(L)),c.forEach((i,E)=>{i.hover+=(i.hoverT-i.hover)*o(8);const N=i.mat.uniforms;N.uVel.value=e.vel,N.uTime.value=d,N.uHover.value=i.hover,N.uMouse.value.lerp(i.mouse,o(14));const K=l.position.z-i.group.position.z;i.frame.material.opacity=C(1-Math.abs(K-e.dist)/34,0,.6)*(K<1.5?0:1),i.group.position.y=Math.cos(E*1.3)*1.1+Math.sin(d*.6+E)*.08}),k.material.size=.07+Math.abs(e.vel)*.06,h.render(T,l),e.raf=requestAnimationFrame(G)}return e.raf=requestAnimationFrame(G),{setProgress(t){e.progress=t},destroy(){e.dead=!0,cancelAnimationFrame(e.raf),J.disconnect(),U.disconnect(),n.removeEventListener("pointermove",Y),n.removeEventListener("pointerleave",q),n.removeEventListener("click",X),c.forEach(t=>{t.mesh.geometry.dispose(),t.mat.uniforms.uTex.value.dispose(),t.mat.dispose(),t.frame.geometry.dispose(),t.frame.material.dispose()}),j.dispose(),k.material.dispose(),h.dispose()}}}function Ae({onOpen:n,onFallback:w}){const x=_.useRef(null),v=_.useRef(null),b=_.useRef(null),[y,h]=_.useState(0),R=ie();_.useEffect(()=>{const r=Ce(v.current,g,{mobile:R,onActive:h,onHover:c=>{v.current&&v.current.setAttribute("data-cursor",c>=0?"OPEN":"")},onOpen:c=>n(g[c].slug)});if(!r){w();return}b.current=r;const f=ce.create({trigger:x.current,start:"top top",end:"bottom bottom",onUpdate:c=>r.setProgress(c.progress)});return()=>{f.kill(),r.destroy(),b.current=null}},[]);const T=_.useCallback(r=>{const f=x.current,c=le(),S=f.offsetHeight-window.innerHeight,M=f.getBoundingClientRect().top+window.scrollY+r/(g.length-1)*S;c?c.scrollTo(M,{duration:1.8,easing:j=>1-Math.pow(1-j,4)}):window.scrollTo({top:M,behavior:"smooth"})},[]),l=g[y]||g[0];return a.jsx("div",{ref:x,className:"gal",style:{height:`${g.length*85+100}vh`},children:a.jsxs("div",{className:"gal__stage",children:[a.jsx("canvas",{ref:v,className:"gal__canvas","aria-hidden":"true"}),a.jsxs("div",{className:"gal__hud",children:[a.jsxs("div",{className:"gal__top",children:[a.jsx("span",{children:R?"Scroll to fly · tap a plane to open":"Scroll to fly · click a plane to open"}),a.jsxs("span",{className:"gal__count",children:[a.jsx("b",{children:String(y+1).padStart(2,"0")})," / ",String(g.length).padStart(2,"0")]})]}),a.jsx("ol",{className:"gal__ticks","aria-label":"Jump to project",children:g.map((r,f)=>a.jsx("li",{children:a.jsxs("button",{className:f===y?"is-on":"",onClick:()=>T(f),"aria-label":`Go to ${r.title}`,"data-cursor":"GO",children:[a.jsx("span",{children:r.id}),a.jsx("i",{})]})},r.slug))}),a.jsxs("div",{className:"gal__info",style:{"--accent":l.accent},children:[a.jsxs("div",{className:"gal__cat",children:[a.jsx("i",{}),l.category," — ",l.year]}),a.jsx("h3",{className:"gal__title",children:a.jsx("span",{children:l.title})}),a.jsxs("div",{className:"gal__row",children:[a.jsx("div",{className:"gal__tags",children:l.tech.slice(0,4).map(r=>a.jsx("span",{children:r},r))}),a.jsxs("button",{className:"btn btn--solid",onClick:()=>n(l.slug),"data-cursor":"OPEN",children:[a.jsx("span",{children:"Open case"}),a.jsx("i",{children:"↗"})]})]})]},l.slug)]}),a.jsx("ul",{className:"sr-only",children:g.map(r=>a.jsx("li",{children:a.jsxs("a",{href:r.link,target:"_blank",rel:"noopener noreferrer",children:[r.title," — ",r.category]})},r.slug))})]})})}export{Ae as default};
