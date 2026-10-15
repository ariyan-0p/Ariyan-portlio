import{r as w,i as ce,S as le,a as ue,p as de,P as y,j as a,g as ve}from"./index-ZkHXLZ3N.js";import{W as me,S as he,P as fe,T as pe,e as ge,b as xe,c as B,f as ye,g as ee,L as Me,E as be,h as we,G as je,B as _e,a as Te,d as Se,i as Ee,C as Re,M as ze,R as Ne}from"./three.module-PexeZNWx.js";const V=15,O=7.8,P=6.4,te=P*.625,Ce=`
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
}`,Pe=`
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
}`,F=r=>new Re(r),De=r=>r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2,C=(r,j,h)=>Math.min(h,Math.max(j,r));function ke(r,j,{onActive:h,onHover:p,onOpen:M,mobile:f}){let g;try{g=new me({canvas:r,antialias:!f,alpha:!1,powerPreference:"high-performance"})}catch{return null}const E=Math.min(window.devicePixelRatio||1,f?1.5:1.75);g.setPixelRatio(E),g.setClearColor(789515,1);const T=new he,l=new fe(50,1,.1,160),n=j.length,x=new pe,c=j.map((t,o)=>{const s=x.load(t.shot,()=>{s.userData.ready=!0});s.colorSpace=ge,s.anisotropy=4;const v=new xe({vertexShader:Ce,fragmentShader:Pe,transparent:!0,depthWrite:!1,uniforms:{uTex:{value:s},uVel:{value:0},uTime:{value:0},uHover:{value:0},uOpacity:{value:1},uMouse:{value:new B(.5,.5)},uAccent:{value:F(t.accent)},uInk:{value:F("#0c0c0b")},uBone:{value:F("#ece8e0")}}}),u=new ye(new ee(P,te,28,18),v),d=new Me(new be(new ee(P+.3,te+.3)),new we({color:15526112,transparent:!0,opacity:.5})),m=new je;return m.add(u,d),m.position.set((o%2?1:-1)*3.5+Math.sin(o*1.7)*.7,Math.cos(o*1.3)*1.1,-o*V),m.rotation.set(Math.cos(o*.9)*.05,Math.sin(o*2.1)*.24,Math.sin(o*1.4)*.05),m.userData.bx=m.position.x,m.userData.ry=m.rotation.y,T.add(m),{group:m,mesh:u,mat:v,frame:d,hover:0,hoverT:0,mouse:new B(.5,.5)}}),S=f?500:1100,b=new Float32Array(S*3);for(let t=0;t<S;t++)b[t*3]=(Math.random()-.5)*36,b[t*3+1]=(Math.random()-.5)*20,b[t*3+2]=14-Math.random()*(n*V+30);const _=new _e;_.setAttribute("position",new Te(b,3));const D=new Se(_,new Ee({color:16731423,size:1.8,transparent:!0,opacity:.8,depthWrite:!1,sizeAttenuation:!1}));T.add(D);const e={progress:0,z:O,x:0,y:0,vel:0,active:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,hovered:-1,w:1,h:1,dist:O,xf:.55,init:!1,gov:{sum:0,n:0,level:0}},I=new Ne,H=new B,k=()=>{const t=r.clientWidth,o=r.clientHeight;if(!t||!o)return;e.w=t,e.h=o,g.setSize(t,o,!1),l.aspect=t/o,l.fov=t/o<1?70:50,l.updateProjectionMatrix();const s=t/o;e.dist=s<1?Math.min(15,P/.86/(2*Math.tan(ze.degToRad(35))*s)):O,e.xf=s<1?1:.55;const v=s<1?.28:1;c.forEach(u=>{u.group.position.x=u.group.userData.bx*v,u.group.rotation.y=u.group.userData.ry*(s<1?.45:1)}),e.init||(e.z=e.dist,e.init=!0)};k();const U=new ResizeObserver(k);U.observe(r);const W=(t,o)=>{const s=r.getBoundingClientRect();H.set((t-s.left)/s.width*2-1,-((o-s.top)/s.height)*2+1),I.setFromCamera(H,l);const u=I.intersectObjects(c.map(d=>d.mesh),!1).find(d=>c.findIndex(m=>m.mesh===d.object)>=0&&d.distance<24);return u?{i:c.findIndex(d=>d.mesh===u.object),uv:u.uv}:null},q=t=>{const o=r.getBoundingClientRect();e.mx=(t.clientX-o.left)/o.width*2-1,e.my=(t.clientY-o.top)/o.height*2-1;const s=W(t.clientX,t.clientY),v=s?s.i:-1;v!==e.hovered&&(e.hovered=v,p&&p(v)),c.forEach((u,d)=>{u.hoverT=d===v?1:0}),s&&c[s.i].mouse.copy(s.uv)},Y=()=>{e.hovered=-1,c.forEach(t=>{t.hoverT=0}),p&&p(-1)},X=t=>{const o=W(t.clientX,t.clientY);o?M&&M(o.i):f&&e.active>=0&&M&&M(e.active)};f||(r.addEventListener("pointermove",q,{passive:!0}),r.addEventListener("pointerleave",Y)),r.addEventListener("click",X);const J=new IntersectionObserver(([t])=>{e.visible=t.isIntersecting,e.visible&&!e.dead&&!e.raf&&(e.last=0,e.raf=requestAnimationFrame(A))});J.observe(r);const se=performance.now();function A(t){if(e.raf=0,e.dead||!e.visible)return;const o=Math.min((t-(e.last||t))/1e3,.1);e.last=t;const s=i=>1-Math.exp(-i*o),v=(t-se)/1e3;if(o>0){const i=e.gov;if(i.sum+=o,i.n+=1,i.n>=45){const z=i.sum/i.n;i.sum=0,i.n=0,z>.03&&i.level<2&&(i.level+=1,i.level===1?(g.setPixelRatio(1),k()):_.setDrawRange(0,Math.floor(S*.4)))}}const u=C(e.progress,0,1)*(n-1),d=Math.min(Math.floor(u),n-2),m=n===1?0:u-d,G=De(C(m,0,1)),$=n===1?0:d+G,R=c[d].group.position,Z=c[Math.min(d+1,n-1)].group.position,oe=-$*V+e.dist,ae=(R.x+(Z.x-R.x)*G)*e.xf,re=(R.y+(Z.y-R.y)*G)*.7,ne=e.z;e.z+=(oe-e.z)*s(5.5),e.x+=(ae-e.x)*s(4),e.y+=(re-e.y)*s(4);const ie=(ne-e.z)/Math.max(o,.001),K=f?.4:1.3;e.vel+=(C(ie*.045,-K,K)-e.vel)*s(8),e.mxs+=(e.mx-e.mxs)*s(3),e.mys+=(e.my-e.mys)*s(3),l.position.set(e.x+e.mxs*.7,e.y-e.mys*.45,e.z),l.rotation.set(-e.mys*.05,-e.mxs*.09,-e.mxs*.015+e.vel*.02);const L=Math.round($);L!==e.active&&(e.active=L,h&&h(L)),c.forEach((i,z)=>{i.hover+=(i.hoverT-i.hover)*s(8);const N=i.mat.uniforms;N.uVel.value=e.vel,N.uTime.value=v,N.uHover.value=i.hover,N.uMouse.value.lerp(i.mouse,s(14));const Q=l.position.z-i.group.position.z;i.frame.material.opacity=C(1-Math.abs(Q-e.dist)/34,0,.6)*(Q<1.5?0:1),i.group.position.y=Math.cos(z*1.3)*1.1+Math.sin(v*.6+z)*.08}),D.material.size=1.7+Math.min(1,Math.abs(e.vel))*1.2,g.render(T,l),e.raf=requestAnimationFrame(A)}return e.raf=requestAnimationFrame(A),{setProgress(t){e.progress=t},destroy(){e.dead=!0,cancelAnimationFrame(e.raf),J.disconnect(),U.disconnect(),r.removeEventListener("pointermove",q),r.removeEventListener("pointerleave",Y),r.removeEventListener("click",X),c.forEach(t=>{t.mesh.geometry.dispose(),t.mat.uniforms.uTex.value.dispose(),t.mat.dispose(),t.frame.geometry.dispose(),t.frame.material.dispose()}),_.dispose(),D.material.dispose(),g.dispose()}}}function Le({onOpen:r,onFallback:j}){const h=w.useRef(null),p=w.useRef(null),M=w.useRef(null),[f,g]=w.useState(0),E=ce();w.useEffect(()=>{const n=ke(p.current,y,{mobile:E,onActive:g,onHover:c=>{p.current&&p.current.setAttribute("data-cursor",c>=0?"OPEN":"")},onOpen:c=>r(y[c].slug)});if(!n){j();return}M.current=n;const x=le.create({trigger:h.current,start:"top top",end:"bottom bottom",onUpdate:c=>n.setProgress(c.progress)});return()=>{x.kill(),n.destroy(),M.current=null}},[]),w.useEffect(()=>ue()?de(h.current,h.current.querySelector(".gal__stage")):void 0,[]);const T=w.useCallback(n=>{const x=h.current,c=ve(),S=x.offsetHeight-window.innerHeight,b=x.getBoundingClientRect().top+window.scrollY+n/(y.length-1)*S;c?c.scrollTo(b,{duration:1.8,easing:_=>1-Math.pow(1-_,4)}):window.scrollTo({top:b,behavior:"smooth"})},[]),l=y[f]||y[0];return a.jsx("div",{ref:h,className:"gal",style:{height:`${y.length*85+100}vh`},children:a.jsxs("div",{className:"gal__stage",children:[a.jsx("canvas",{ref:p,className:"gal__canvas","aria-hidden":"true"}),a.jsxs("div",{className:"gal__hud",children:[a.jsxs("div",{className:"gal__top",children:[a.jsx("span",{children:E?"Scroll to fly · tap a plane to open":"Scroll to fly · click a plane to open"}),a.jsxs("span",{className:"gal__count",children:[a.jsx("b",{children:String(f+1).padStart(2,"0")})," / ",String(y.length).padStart(2,"0")]})]}),a.jsx("ol",{className:"gal__ticks","aria-label":"Jump to project",children:y.map((n,x)=>a.jsx("li",{children:a.jsxs("button",{className:x===f?"is-on":"",onClick:()=>T(x),"aria-label":`Go to ${n.title}`,"data-cursor":"GO",children:[a.jsx("span",{children:n.id}),a.jsx("i",{})]})},n.slug))}),a.jsxs("div",{className:"gal__info",style:{"--accent":l.accent},children:[a.jsxs("div",{className:"gal__cat",children:[a.jsx("i",{}),l.category," — ",l.year]}),a.jsx("h3",{className:"gal__title",children:a.jsx("span",{children:l.title})}),a.jsxs("div",{className:"gal__row",children:[a.jsx("div",{className:"gal__tags",children:l.tech.slice(0,4).map(n=>a.jsx("span",{children:n},n))}),a.jsxs("button",{className:"btn btn--solid",onClick:()=>r(l.slug),"data-cursor":"OPEN",children:[a.jsx("span",{children:"Open case"}),a.jsx("i",{children:"↗"})]})]})]},l.slug)]}),a.jsx("ul",{className:"sr-only",children:y.map(n=>a.jsx("li",{children:a.jsxs("a",{href:n.link,target:"_blank",rel:"noopener noreferrer",children:[n.title," — ",n.category]})},n.slug))})]})})}export{Le as default};
