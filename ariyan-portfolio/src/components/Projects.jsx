import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "01",
    title: "Keystone\nProjects",
    category: "Architectural Portfolio",
    url: "keystoneprojects.in",
    link: "https://keystoneprojects.in/",
    tech: ["React", "Tailwind", "Motion"],
    year: "2024",
    color: "#e8c547",
    size: "hero",
  },
  {
    id: "02",
    title: "Bounten\nApp",
    category: "LMS Platform",
    url: "bounten.com",
    link: "https://play.google.com/store/apps/details?id=com.bounten.profitpartner&hl=en",
    tech: ["Flutter", "Node.js", "Firebase"],
    year: "2024",
    color: "#38c7f0",
    size: "tall",
  },
  {
    id: "03",
    title: "Skanda\nStores",
    category: "E-Commerce",
    url: "skandastores.com",
    link: "https://skandastores.com/",
    tech: ["Next.js", "MongoDB", "Stripe"],
    year: "2024",
    color: "#4ade80",
    size: "wide",
  },
  {
    id: "04",
    title: "Groom\n2b",
    category: "Niche Retail",
    url: "groom2b.in",
    link: "https://groom2b.in/",
    tech: ["React", "AWS", "UI/UX"],
    year: "2023",
    color: "#f472b6",
    size: "small",
  },
  {
    id: "05",
    title: "MPF Style\nClub",
    category: "Luxury App",
    url: "mpfstyleclub.com",
    link: "https://www.mpfstyleclub.com/",
    tech: ["Flutter", "AI", "Cloud"],
    year: "2023",
    color: "#c084fc",
    size: "small",
  },
  {
    id: "06",
    title: "Reno\nBill",
    category: "Billing SaaS",
    url: "renobill.com",
    link: "https://renobill.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    year: "2024",
    color: "#fb923c",
    size: "wide",
  },
  {
    id: "07",
    title: "NTS with\nAnkit",
    category: "Personal Brand",
    url: "ntswithankit.com",
    link: "https://ntswithankit.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    year: "2025",
    color: "#34d399",
    size: "tall",
  },
];

/* ─── DETECT TOUCH ────────────────────────────────────────────────────── */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);
  return isTouch;
}

/* ─── PROJECT CELL ────────────────────────────────────────────────────── */
function ProjectCell({ project, onHover, isTouch }) {
  const [hovered, setHovered] = useState(false);
  // On touch devices, always show content (no hover needed)
  const active = isTouch ? true : hovered;
  const titleLines = project.title.split('\n');

  const isHero  = project.size === 'hero';
  const isWide  = project.size === 'wide';
  const isTall  = project.size === 'tall';
  const isSmall = project.size === 'small';

  // Responsive title sizes — bigger on hero/tall, smaller on small cells
  const titleSize = isHero
    ? 'clamp(2rem, 4vw, 4rem)'
    : isWide
    ? 'clamp(1.6rem, 2.8vw, 2.8rem)'
    : isTall
    ? 'clamp(1.6rem, 2.5vw, 2.6rem)'
    : 'clamp(1.4rem, 2vw, 2.2rem)';

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { if (!isTouch) { setHovered(true); onHover(project.color); } }}
      onMouseLeave={() => { if (!isTouch) { setHovered(false); onHover(null); } }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(1rem, 3vw, 1.6rem) clamp(1rem, 3vw, 1.8rem)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${active && !isTouch ? project.color + '55' : isTouch ? project.color + '22' : 'rgba(255,255,255,0.06)'}`,
        background: isTouch
          ? `linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))`
          : 'rgba(255,255,255,0.025)',
        cursor: isTouch ? 'pointer' : 'none',
        textDecoration: 'none',
        transition: 'border-color 0.4s',
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`projects-cell projects-cell--${project.size}`}
    >
      {/* Colour flood */}
      <motion.div
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: isTouch ? 0 : 0.5 }}
        style={{
          position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 20% 80%, ${project.color}22 0%, ${project.color}06 55%, transparent 100%)`,
        }}
      />

      {/* Corner brackets */}
      <motion.div
        animate={{ opacity: active ? 0.65 : 0.12, scale: active ? 1 : 0.85 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', top: 12, right: 12, width: 16, height: 16,
          borderTop: `2px solid ${project.color}`, borderRight: `2px solid ${project.color}`,
          borderRadius: '0 4px 0 0', pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: active ? 0.65 : 0.12, scale: active ? 1 : 0.85 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', bottom: 12, left: 12, width: 16, height: 16,
          borderBottom: `2px solid ${project.color}`, borderLeft: `2px solid ${project.color}`,
          borderRadius: '0 0 0 4px', pointerEvents: 'none',
        }}
      />

      {/* Index */}
      <div style={{
        position: 'absolute', top: '1rem', left: '1.1rem',
        fontFamily: "'DM Mono', monospace", fontSize: 9,
        letterSpacing: '0.2em',
        color: active ? project.color : 'rgba(255,255,255,0.2)',
        transition: 'color 0.3s', zIndex: 2,
      }}>
        {project.id}
      </div>

      {/* Year */}
      <div style={{
        position: 'absolute', top: '1rem', right: '2.6rem',
        fontFamily: "'DM Mono', monospace", fontSize: 9,
        letterSpacing: '0.1em', color: 'rgba(255,255,255,0.16)', zIndex: 2,
      }}>
        {project.year}
      </div>

      {/* Arrow */}
      <motion.div
        animate={{ x: active && !isTouch ? 4 : 0, y: active && !isTouch ? -4 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', top: '0.85rem', right: '1.1rem', zIndex: 2,
          color: active ? project.color : 'rgba(255,255,255,0.15)',
          transition: 'color 0.3s',
        }}
      >
        <ArrowUpRight size={17} />
      </motion.div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* Category — always visible on touch, hover-reveal on desktop */}
        <motion.div
          animate={{ y: active ? 0 : 10, opacity: active ? 1 : 0 }}
          transition={{ duration: isTouch ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: project.color, marginBottom: '0.4rem',
          }}
        >
          {project.category}
        </motion.div>

        {/* Title */}
        <div>
          {titleLines.map((line, li) => (
            <div key={li} style={{ overflow: 'hidden' }}>
              <motion.div
                animate={{ y: active ? 0 : (li === 0 ? 8 : -6) }}
                transition={{ duration: isTouch ? 0 : 0.4, ease: [0.22, 1, 0.36, 1], delay: li * 0.05 }}
                style={{
                  fontFamily: "'Clash Display', 'Anton', sans-serif",
                  fontWeight: 700,
                  fontSize: titleSize,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: active ? project.color : '#fff',
                  transition: 'color 0.32s',
                  display: 'block',
                  whiteSpace: 'nowrap',
                }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </div>

        {/* URL + tags */}
        <motion.div
          animate={{ y: active ? 0 : 12, opacity: active ? 1 : 0 }}
          transition={{ duration: isTouch ? 0 : 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          style={{
            marginTop: '0.65rem',
            display: 'flex', alignItems: 'center',
            gap: '0.5rem', flexWrap: 'wrap',
          }}
        >
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: 'rgba(255,255,255,0.38)', letterSpacing: '0.03em',
          }}>
            ↗ {project.url}
          </span>
          {project.tech.slice(0, 3).map((t, i) => (
            <span key={i} style={{
              padding: '2px 6px', borderRadius: 3,
              border: `1px solid ${project.color}44`,
              fontFamily: "'DM Mono', monospace",
              fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: project.color, background: `${project.color}12`,
            }}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom sweep line */}
      <motion.div
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: isTouch ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: '1.1rem', right: '1.1rem',
          height: 2, background: project.color,
          borderRadius: 9999, transformOrigin: 'left', zIndex: 4,
        }}
      />
    </motion.a>
  );
}

/* ─── MAGNETIC CURSOR ORB (desktop only) ─────────────────────────────── */
function CursorOrb({ activeColor, isTouch }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 160, damping: 20 });
  const springY = useSpring(y, { stiffness: 160, damping: 20 });
  const trailX  = useSpring(x, { stiffness: 80, damping: 18 });
  const trailY  = useSpring(y, { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (isTouch) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999,
          width: 38, height: 38,
          x: springX, y: springY,
          translateX: '-50%', translateY: '-50%',
          borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
        animate={{
          backgroundColor: activeColor || 'rgba(255,255,255,0.55)',
          scale: activeColor ? 1.55 : 1,
          boxShadow: activeColor
            ? `0 0 36px 14px ${activeColor}88`
            : '0 0 12px 4px rgba(255,255,255,0.25)',
        }}
        transition={{ duration: 0.28 }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9998,
          width: 66, height: 66,
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          borderRadius: '50%', pointerEvents: 'none',
        }}
        animate={{
          borderColor: activeColor || 'rgba(255,255,255,0.2)',
          scale: activeColor ? 1.25 : 1,
          opacity: activeColor ? 0.75 : 0.35,
          border: `1.5px solid ${activeColor || 'rgba(255,255,255,0.2)'}`,
        }}
        transition={{ duration: 0.38 }}
      />
    </>
  );
}

/* ─── SECTION ─────────────────────────────────────────────────────────── */
export default function Projects() {
  const [orbColor, setOrbColor] = useState(null);
  const isTouch = useIsTouch();

  return (
    <>
      <style>{`
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
      `}</style>

      <CursorOrb activeColor={orbColor} isTouch={isTouch} />

      <section style={{
        width: '100%',
        maxWidth: 1180,
        margin: '0 auto',
        padding: 'clamp(4rem, 10vw, 7rem) clamp(1rem, 4vw, 1.5rem) clamp(4rem, 10vw, 8rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Ambient blobs */}
        <div style={{
          position: 'absolute', top: '8%', right: '-12%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,60,180,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '2%', left: '-10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(56,199,240,0.07) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)',
        }} />

        {/* ── Header — minimal ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(2rem, 5vw, 3.5rem)', position: 'relative', zIndex: 10 }}
        >
          {/* Eyebrow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 'clamp(0.6rem, 2vw, 1rem)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#a78bfa',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', flexShrink: 0,
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            Selected Works
          </div>

          {/* Title — single clean word */}
          <h2 style={{
            fontFamily: "'Clash Display', 'Anton', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: '#fff',
            margin: 0,
          }}>
            Projects
          </h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 1,
              marginTop: 'clamp(1.2rem, 3vw, 2rem)',
              background: 'linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.03), transparent)',
              transformOrigin: 'left',
            }}
          />
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="projects-bento" style={{ position: 'relative', zIndex: 10 }}>
          {PROJECTS.map((project) => (
            <ProjectCell
              key={project.id}
              project={project}
              onHover={setOrbColor}
              isTouch={isTouch}
            />
          ))}
        </div>

      </section>
    </>
  );
}