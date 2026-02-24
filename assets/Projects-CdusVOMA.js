import{c as x,r as l,j as t,m as r,u as f,a as m}from"./index-DcjHQotg.js";const b=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],w=x("arrow-up-right",b),v=[{id:"01",title:`Keystone
Projects`,category:"Architectural Portfolio",url:"keystoneprojects.in",link:"https://keystoneprojects.in/",tech:["React","Tailwind","Motion"],year:"2024",color:"#e8c547",size:"hero"},{id:"02",title:`Bounten
App`,category:"LMS Platform",url:"bounten.com",link:"https://play.google.com/store/apps/details?id=com.bounten.profitpartner&hl=en",tech:["Flutter","Node.js","Firebase"],year:"2024",color:"#38c7f0",size:"tall"},{id:"03",title:`Skanda
Stores`,category:"E-Commerce",url:"skandastores.com",link:"https://skandastores.com/",tech:["Next.js","MongoDB","Stripe"],year:"2024",color:"#4ade80",size:"wide"},{id:"04",title:`Groom
2b`,category:"Niche Retail",url:"groom2b.in",link:"https://groom2b.in/",tech:["React","AWS","UI/UX"],year:"2023",color:"#f472b6",size:"small"},{id:"05",title:`MPF Style
Club`,category:"Luxury App",url:"mpfstyleclub.com",link:"https://www.mpfstyleclub.com/",tech:["Flutter","AI","Cloud"],year:"2023",color:"#c084fc",size:"small"},{id:"06",title:`Reno
Bill`,category:"Billing SaaS",url:"renobill.com",link:"https://renobill.com/",tech:["MongoDB","Express","React","Node.js"],year:"2024",color:"#fb923c",size:"wide"},{id:"07",title:`NTS with
Ankit`,category:"Personal Brand",url:"ntswithankit.com",link:"https://ntswithankit.com/",tech:["MongoDB","Express","React","Node.js"],year:"2025",color:"#34d399",size:"tall"}];function k(){const[e,n]=l.useState(!1);return l.useEffect(()=>{n(window.matchMedia("(hover: none)").matches)},[]),e}function S({project:e,onHover:n,isTouch:o}){const[a,d]=l.useState(!1),i=o?!0:a,g=e.title.split(`
`),u=e.size==="hero",c=e.size==="wide",p=e.size==="tall";e.size;const y=u?"clamp(2rem, 4vw, 4rem)":c?"clamp(1.6rem, 2.8vw, 2.8rem)":p?"clamp(1.6rem, 2.5vw, 2.6rem)":"clamp(1.4rem, 2vw, 2.2rem)";return t.jsxs(r.a,{href:e.link,target:"_blank",rel:"noopener noreferrer",onMouseEnter:()=>{o||(d(!0),n(e.color))},onMouseLeave:()=>{o||(d(!1),n(null))},initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-40px"},transition:{duration:.55,ease:[.22,1,.36,1]},style:{position:"relative",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"clamp(1rem, 3vw, 1.6rem) clamp(1rem, 3vw, 1.8rem)",borderRadius:"16px",overflow:"hidden",border:`1px solid ${i&&!o?e.color+"55":o?e.color+"22":"rgba(255,255,255,0.06)"}`,background:o?"linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))":"rgba(255,255,255,0.025)",cursor:o?"pointer":"none",textDecoration:"none",transition:"border-color 0.4s",WebkitTapHighlightColor:"transparent"},className:`projects-cell projects-cell--${e.size}`,children:[t.jsx(r.div,{animate:{opacity:i?1:0},transition:{duration:o?0:.5},style:{position:"absolute",inset:0,borderRadius:16,pointerEvents:"none",background:`radial-gradient(ellipse at 20% 80%, ${e.color}22 0%, ${e.color}06 55%, transparent 100%)`}}),t.jsx(r.div,{animate:{opacity:i?.65:.12,scale:i?1:.85},transition:{duration:.3},style:{position:"absolute",top:12,right:12,width:16,height:16,borderTop:`2px solid ${e.color}`,borderRight:`2px solid ${e.color}`,borderRadius:"0 4px 0 0",pointerEvents:"none"}}),t.jsx(r.div,{animate:{opacity:i?.65:.12,scale:i?1:.85},transition:{duration:.3},style:{position:"absolute",bottom:12,left:12,width:16,height:16,borderBottom:`2px solid ${e.color}`,borderLeft:`2px solid ${e.color}`,borderRadius:"0 0 0 4px",pointerEvents:"none"}}),t.jsx("div",{style:{position:"absolute",top:"1rem",left:"1.1rem",fontFamily:"'DM Mono', monospace",fontSize:9,letterSpacing:"0.2em",color:i?e.color:"rgba(255,255,255,0.2)",transition:"color 0.3s",zIndex:2},children:e.id}),t.jsx("div",{style:{position:"absolute",top:"1rem",right:"2.6rem",fontFamily:"'DM Mono', monospace",fontSize:9,letterSpacing:"0.1em",color:"rgba(255,255,255,0.16)",zIndex:2},children:e.year}),t.jsx(r.div,{animate:{x:i&&!o?4:0,y:i&&!o?-4:0},transition:{duration:.25},style:{position:"absolute",top:"0.85rem",right:"1.1rem",zIndex:2,color:i?e.color:"rgba(255,255,255,0.15)",transition:"color 0.3s"},children:t.jsx(w,{size:17})}),t.jsxs("div",{style:{position:"relative",zIndex:3},children:[t.jsx(r.div,{animate:{y:i?0:10,opacity:i?1:0},transition:{duration:o?0:.36,ease:[.22,1,.36,1]},style:{fontFamily:"'DM Mono', monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:e.color,marginBottom:"0.4rem"},children:e.category}),t.jsx("div",{children:g.map((h,s)=>t.jsx("div",{style:{overflow:"hidden"},children:t.jsx(r.div,{animate:{y:i?0:s===0?8:-6},transition:{duration:o?0:.4,ease:[.22,1,.36,1],delay:s*.05},style:{fontFamily:"'Clash Display', 'Anton', sans-serif",fontWeight:700,fontSize:y,lineHeight:1,letterSpacing:"-0.02em",color:i?e.color:"#fff",transition:"color 0.32s",display:"block",whiteSpace:"nowrap"},children:h})},s))}),t.jsxs(r.div,{animate:{y:i?0:12,opacity:i?1:0},transition:{duration:o?0:.38,ease:[.22,1,.36,1],delay:.06},style:{marginTop:"0.65rem",display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[t.jsxs("span",{style:{fontFamily:"'DM Mono', monospace",fontSize:10,color:"rgba(255,255,255,0.38)",letterSpacing:"0.03em"},children:["↗ ",e.url]}),e.tech.slice(0,3).map((h,s)=>t.jsx("span",{style:{padding:"2px 6px",borderRadius:3,border:`1px solid ${e.color}44`,fontFamily:"'DM Mono', monospace",fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",color:e.color,background:`${e.color}12`},children:h},s))]})]}),t.jsx(r.div,{animate:{scaleX:i?1:0,opacity:i?1:0},transition:{duration:o?0:.42,ease:[.22,1,.36,1]},style:{position:"absolute",bottom:0,left:"1.1rem",right:"1.1rem",height:2,background:e.color,borderRadius:9999,transformOrigin:"left",zIndex:4}})]})}function j({activeColor:e,isTouch:n}){const o=f(-200),a=f(-200),d=m(o,{stiffness:160,damping:20}),i=m(a,{stiffness:160,damping:20}),g=m(o,{stiffness:80,damping:18}),u=m(a,{stiffness:80,damping:18});return l.useEffect(()=>{if(n)return;const c=p=>{o.set(p.clientX),a.set(p.clientY)};return window.addEventListener("mousemove",c),()=>window.removeEventListener("mousemove",c)},[o,a,n]),n?null:t.jsxs(t.Fragment,{children:[t.jsx(r.div,{style:{position:"fixed",top:0,left:0,zIndex:9999,width:38,height:38,x:d,y:i,translateX:"-50%",translateY:"-50%",borderRadius:"50%",pointerEvents:"none",mixBlendMode:"screen"},animate:{backgroundColor:e||"rgba(255,255,255,0.55)",scale:e?1.55:1,boxShadow:e?`0 0 36px 14px ${e}88`:"0 0 12px 4px rgba(255,255,255,0.25)"},transition:{duration:.28}}),t.jsx(r.div,{style:{position:"fixed",top:0,left:0,zIndex:9998,width:66,height:66,x:g,y:u,translateX:"-50%",translateY:"-50%",borderRadius:"50%",pointerEvents:"none"},animate:{borderColor:e||"rgba(255,255,255,0.2)",scale:e?1.25:1,opacity:e?.75:.35,border:`1.5px solid ${e||"rgba(255,255,255,0.2)"}`},transition:{duration:.38}})]})}function M(){const[e,n]=l.useState(null),o=k();return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Anton&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* Hide default cursor on desktop only */
        @media (hover: hover) {
          * { cursor: none !important; }
        }

        /* ── Bento Grid ── */
        .projects-bento {
          display: grid;
          gap: 12px;
        }

        /* Mobile — single column, fixed card heights */
        @media (max-width: 639px) {
          .projects-bento {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
          }
          .projects-cell {
            grid-column: 1 !important;
            grid-row: auto !important;
            min-height: 160px !important;
          }
        }

        /* Tablet — 2 cols, hero spans both */
        @media (min-width: 640px) and (max-width: 1023px) {
          .projects-bento {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 190px;
          }
          .projects-cell                { grid-column: span 1; grid-row: span 1; }
          .projects-cell--hero          { grid-column: span 2; grid-row: span 2; }
          .projects-cell--tall          { grid-column: span 1; grid-row: span 2; }
          .projects-cell--wide          { grid-column: span 2; grid-row: span 1; }
          .projects-cell--small         { grid-column: span 1; grid-row: span 1; }
        }

        /* Desktop — 4 cols asymmetric bento */
        @media (min-width: 1024px) {
          .projects-bento {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 210px;
            gap: 14px;
          }
          .projects-cell--hero  { grid-column: span 2; grid-row: span 2; }
          .projects-cell--tall  { grid-column: span 1; grid-row: span 2; }
          .projects-cell--wide  { grid-column: span 2; grid-row: span 1; }
          .projects-cell--small { grid-column: span 1; grid-row: span 1; }
        }
      `}),t.jsx(j,{activeColor:e,isTouch:o}),t.jsxs("section",{style:{width:"100%",maxWidth:1180,margin:"0 auto",padding:"clamp(4rem, 10vw, 7rem) clamp(1rem, 4vw, 1.5rem) clamp(4rem, 10vw, 8rem)",position:"relative",overflow:"hidden"},children:[t.jsx("div",{style:{position:"absolute",top:"8%",right:"-12%",width:600,height:600,background:"radial-gradient(circle, rgba(99,60,180,0.1) 0%, transparent 70%)",borderRadius:"50%",pointerEvents:"none",filter:"blur(70px)"}}),t.jsx("div",{style:{position:"absolute",bottom:"2%",left:"-10%",width:400,height:400,background:"radial-gradient(circle, rgba(56,199,240,0.07) 0%, transparent 70%)",borderRadius:"50%",pointerEvents:"none",filter:"blur(60px)"}}),t.jsxs(r.div,{initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.6,ease:[.22,1,.36,1]},style:{marginBottom:"clamp(2rem, 5vw, 3.5rem)",position:"relative",zIndex:10},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:"clamp(0.6rem, 2vw, 1rem)",fontFamily:"'DM Mono', monospace",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"#a78bfa"},children:[t.jsx("span",{style:{width:5,height:5,borderRadius:"50%",background:"#a78bfa",flexShrink:0,animation:"pulse-dot 2s ease-in-out infinite"}}),"Selected Works"]}),t.jsx("h2",{style:{fontFamily:"'Clash Display', 'Anton', sans-serif",fontWeight:700,fontSize:"clamp(3rem, 8vw, 7rem)",lineHeight:.9,letterSpacing:"-0.04em",color:"#fff",margin:0},children:"Projects"}),t.jsx(r.div,{initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0},transition:{duration:.75,delay:.2,ease:[.22,1,.36,1]},style:{height:1,marginTop:"clamp(1.2rem, 3vw, 2rem)",background:"linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.03), transparent)",transformOrigin:"left"}})]}),t.jsx("div",{className:"projects-bento",style:{position:"relative",zIndex:10},children:v.map(a=>t.jsx(S,{project:a,onHover:n,isTouch:o},a.id))})]})]})}export{M as default};
