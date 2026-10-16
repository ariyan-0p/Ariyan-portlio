import{r as j,i as ce,P as x,S as le,a as ue,p as de,j as n,g as me}from"./index-hQcN--MG.js";import{W as ve,S as he,P as fe,T as pe,e as ge,b as xe,c as B,f as ye,g as ee,L as Me,E as be,h as we,G as je,B as _e,a as Te,d as Se,i as Re,C as ze,M as Ee,R as Ce}from"./three.module-PexeZNWx.js";const V=15,F=7.8,k=6.4,te=k*.625,De=`
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
}`,ke=`
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
}`,I=a=>new ze(a),Ne=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,D=(a,_,p)=>Math.min(p,Math.max(_,a));function Pe(a,_,{onActive:p,onHover:M,onOpen:b,mobile:g}){let y;try{y=new ve({canvas:a,antialias:!g,alpha:!1,powerPreference:"high-performance"})}catch{return null}const S=Math.min(window.devicePixelRatio||1,g?1.25:1.75);y.setPixelRatio(S),y.setClearColor(789515,1);const R=new he,d=new fe(50,1,.1,160),i=_.length,h=new pe,c=_.map((t,o)=>{const s=h.load(t.shot,()=>{s.userData.ready=!0});s.colorSpace=ge,s.anisotropy=4;const m=new xe({vertexShader:De,fragmentShader:ke,transparent:!0,depthWrite:!1,uniforms:{uTex:{value:s},uVel:{value:0},uTime:{value:0},uHover:{value:0},uOpacity:{value:1},uMouse:{value:new B(.5,.5)},uAccent:{value:I(t.accent)},uInk:{value:I("#0c0c0b")},uBone:{value:I("#ece8e0")}}}),l=new ye(new ee(k,te,28,18),m),u=new Me(new be(new ee(k+.3,te+.3)),new we({color:15526112,transparent:!0,opacity:.5})),v=new je;return v.add(l,u),v.position.set((o%2?1:-1)*3.5+Math.sin(o*1.7)*.7,Math.cos(o*1.3)*1.1,-o*V),v.rotation.set(Math.cos(o*.9)*.05,Math.sin(o*2.1)*.24,Math.sin(o*1.4)*.05),v.userData.bx=v.position.x,v.userData.ry=v.rotation.y,R.add(v),{group:v,mesh:l,mat:m,frame:u,hover:0,hoverT:0,mouse:new B(.5,.5)}}),f=g?500:1100,w=new Float32Array(f*3);for(let t=0;t<f;t++)w[t*3]=(Math.random()-.5)*36,w[t*3+1]=(Math.random()-.5)*20,w[t*3+2]=14-Math.random()*(i*V+30);const T=new _e;T.setAttribute("position",new Te(w,3));const N=new Se(T,new Re({color:16731423,size:1.8,transparent:!0,opacity:.8,depthWrite:!1,sizeAttenuation:!1}));R.add(N);const e={progress:0,z:F,x:0,y:0,vel:0,active:-1,dead:!1,raf:0,visible:!0,last:0,mx:0,my:0,mxs:0,mys:0,hovered:-1,w:1,h:1,dist:F,xf:.55,init:!1,gov:{sum:0,n:0,level:0}},H=new Ce,O=new B,P=()=>{const t=a.clientWidth,o=a.clientHeight;if(!t||!o)return;e.w=t,e.h=o,y.setSize(t,o,!1),d.aspect=t/o,d.fov=t/o<1?70:50,d.updateProjectionMatrix();const s=t/o;e.dist=s<1?Math.min(15,k/.86/(2*Math.tan(Ee.degToRad(35))*s)):F,e.xf=s<1?1:.55;const m=s<1?.28:1;c.forEach(l=>{l.group.position.x=l.group.userData.bx*m,l.group.rotation.y=l.group.userData.ry*(s<1?.45:1)}),e.init||(e.z=e.dist,e.init=!0)};P();const U=new ResizeObserver(P);U.observe(a);const W=(t,o)=>{const s=a.getBoundingClientRect();O.set((t-s.left)/s.width*2-1,-((o-s.top)/s.height)*2+1),H.setFromCamera(O,d);const l=H.intersectObjects(c.map(u=>u.mesh),!1).find(u=>c.findIndex(v=>v.mesh===u.object)>=0&&u.distance<24);return l?{i:c.findIndex(u=>u.mesh===l.object),uv:l.uv}:null},q=t=>{const o=a.getBoundingClientRect();e.mx=(t.clientX-o.left)/o.width*2-1,e.my=(t.clientY-o.top)/o.height*2-1;const s=W(t.clientX,t.clientY),m=s?s.i:-1;m!==e.hovered&&(e.hovered=m,M&&M(m)),c.forEach((l,u)=>{l.hoverT=u===m?1:0}),s&&c[s.i].mouse.copy(s.uv)},Y=()=>{e.hovered=-1,c.forEach(t=>{t.hoverT=0}),M&&M(-1)},X=t=>{const o=W(t.clientX,t.clientY);o?b&&b(o.i):g&&e.active>=0&&b&&b(e.active)};g||(a.addEventListener("pointermove",q,{passive:!0}),a.addEventListener("pointerleave",Y)),a.addEventListener("click",X);const J=new IntersectionObserver(([t])=>{e.visible=t.isIntersecting,e.visible&&!e.dead&&!e.raf&&(e.last=0,e.raf=requestAnimationFrame(A))});J.observe(a);const se=performance.now();function A(t){if(e.raf=0,e.dead||!e.visible)return;const o=Math.min((t-(e.last||t))/1e3,.1);e.last=t;const s=r=>1-Math.exp(-r*o),m=(t-se)/1e3;if(o>0){const r=e.gov;if(r.sum+=o,r.n+=1,r.n>=45){const E=r.sum/r.n;r.sum=0,r.n=0,E>.03&&r.level<2&&(r.level+=1,r.level===1?(y.setPixelRatio(1),P()):T.setDrawRange(0,Math.floor(f*.4)))}}const l=D(e.progress,0,1)*(i-1),u=Math.min(Math.floor(l),i-2),v=i===1?0:l-u,G=Ne(D(v,0,1)),$=i===1?0:u+G,z=c[u].group.position,Z=c[Math.min(u+1,i-1)].group.position,oe=-$*V+e.dist,ae=(z.x+(Z.x-z.x)*G)*e.xf,ne=(z.y+(Z.y-z.y)*G)*.7,re=e.z;e.z+=(oe-e.z)*s(5.5),e.x+=(ae-e.x)*s(4),e.y+=(ne-e.y)*s(4);const ie=(re-e.z)/Math.max(o,.001),K=g?.4:1.3;e.vel+=(D(ie*.045,-K,K)-e.vel)*s(8),e.mxs+=(e.mx-e.mxs)*s(3),e.mys+=(e.my-e.mys)*s(3),d.position.set(e.x+e.mxs*.7,e.y-e.mys*.45,e.z),d.rotation.set(-e.mys*.05,-e.mxs*.09,-e.mxs*.015+e.vel*.02);const L=Math.round($);L!==e.active&&(e.active=L,p&&p(L)),c.forEach((r,E)=>{r.hover+=(r.hoverT-r.hover)*s(8);const C=r.mat.uniforms;C.uVel.value=e.vel,C.uTime.value=m,C.uHover.value=r.hover,C.uMouse.value.lerp(r.mouse,s(14));const Q=d.position.z-r.group.position.z;r.frame.material.opacity=D(1-Math.abs(Q-e.dist)/34,0,.6)*(Q<1.5?0:1),r.group.position.y=Math.cos(E*1.3)*1.1+Math.sin(m*.6+E)*.08}),N.material.size=1.7+Math.min(1,Math.abs(e.vel))*1.2,y.render(R,d),e.raf=requestAnimationFrame(A)}return e.raf=requestAnimationFrame(A),{setProgress(t){e.progress=t},destroy(){e.dead=!0,cancelAnimationFrame(e.raf),J.disconnect(),U.disconnect(),a.removeEventListener("pointermove",q),a.removeEventListener("pointerleave",Y),a.removeEventListener("click",X),c.forEach(t=>{t.mesh.geometry.dispose(),t.mat.uniforms.uTex.value.dispose(),t.mat.dispose(),t.frame.geometry.dispose(),t.frame.material.dispose()}),T.dispose(),N.material.dispose(),y.dispose()}}}function Le({onOpen:a,onFallback:_}){const p=j.useRef(null),M=j.useRef(null),b=j.useRef(null),[g,y]=j.useState(0),S=ce();j.useEffect(()=>{const i=S?x.map(f=>({...f,shot:f.thumb})):x,h=Pe(M.current,i,{mobile:S,onActive:y,onOpen:f=>a(x[f].slug)});if(!h){_();return}b.current=h;const c=le.create({trigger:p.current,start:"top top",end:"bottom bottom",onUpdate:f=>h.setProgress(f.progress)});return()=>{c.kill(),h.destroy(),b.current=null}},[]),j.useEffect(()=>ue()?de(p.current,p.current.querySelector(".gal__stage")):void 0,[]);const R=j.useCallback(i=>{const h=p.current,c=me(),f=h.offsetHeight-window.innerHeight,w=h.getBoundingClientRect().top+window.scrollY+i/(x.length-1)*f;c?c.scrollTo(w,{duration:1.8,easing:T=>1-Math.pow(1-T,4)}):window.scrollTo({top:w,behavior:"smooth"})},[]),d=x[g]||x[0];return n.jsx("div",{ref:p,className:"gal",style:{height:`${x.length*85+100}vh`},children:n.jsxs("div",{className:"gal__stage",children:[n.jsx("canvas",{ref:M,className:"gal__canvas","aria-hidden":"true"}),n.jsxs("div",{className:"gal__hud",children:[n.jsxs("div",{className:"gal__top",children:[n.jsx("span",{children:S?"Scroll to fly · tap a plane to open":"Scroll to fly · click a plane to open"}),n.jsxs("span",{className:"gal__count",children:[n.jsx("b",{children:String(g+1).padStart(2,"0")})," / ",String(x.length).padStart(2,"0")]})]}),n.jsx("ol",{className:"gal__ticks","aria-label":"Jump to project",children:x.map((i,h)=>n.jsx("li",{children:n.jsxs("button",{className:h===g?"is-on":"",onClick:()=>R(h),"aria-label":`Go to ${i.title}`,children:[n.jsx("span",{children:i.id}),n.jsx("i",{})]})},i.slug))}),n.jsxs("div",{className:"gal__info",style:{"--accent":d.accent},children:[n.jsxs("div",{className:"gal__cat",children:[n.jsx("i",{}),d.category," — ",d.year]}),n.jsx("h3",{className:"gal__title",children:n.jsx("span",{children:d.title})}),n.jsx("div",{className:"gal__row",children:n.jsxs("button",{className:"btn btn--solid",onClick:()=>a(d.slug),children:[n.jsx("span",{children:"Open case"}),n.jsx("i",{children:"↗"})]})})]},d.slug)]}),n.jsx("ul",{className:"sr-only",children:x.map(i=>n.jsx("li",{children:n.jsxs("a",{href:i.link,target:"_blank",rel:"noopener noreferrer",children:[i.title," — ",i.category]})},i.slug))})]})})}export{Le as default};
