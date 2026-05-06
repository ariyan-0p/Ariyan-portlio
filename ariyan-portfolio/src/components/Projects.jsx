import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ACCENT = "#ff3c00";

const PROJECTS = [
  {
    id: "01",
    title: "Keystone Projects",
    category: "Architectural Portfolio",
    url: "keystoneprojects.in",
    link: "https://keystoneprojects.in/",
    tech: ["React", "Tailwind", "Motion"],
    desc: "A bold digital presence for an architectural firm — spatial storytelling through the web.",
  },
  {
    id: "02",
    title: "Bounten App",
    category: "LMS Platform",
    url: "bounten.com",
    link: "https://play.google.com/store/apps/details?id=com.bounten.profitpartner",
    tech: ["Flutter", "Node.js", "Firebase"],
    desc: "A learning management system built for scale — mobile-first, fast, and frictionless.",
  },
  {
    id: "03",
    title: "Skanda Stores",
    category: "E-Commerce",
    url: "skandastores.com",
    link: "https://skandastores.com/",
    tech: ["Next.js", "MongoDB", "Stripe"],
    desc: "End-to-end commerce experience — from browsing to checkout, built to convert.",
  },
  {
    id: "04",
    title: "Groom 2b",
    category: "Niche Retail",
    url: "groom2b.in",
    link: "https://groom2b.in/",
    tech: ["React", "AWS", "UI/UX"],
    desc: "A curated retail experience for a niche market — clean UX with a refined edge.",
  },
  {
    id: "05",
    title: "MPF Style Club",
    category: "Luxury App",
    url: "mpfstyleclub.com",
    link: "https://www.mpfstyleclub.com/",
    tech: ["Flutter", "AI", "Cloud"],
    desc: "Luxury meets intelligence — an AI-powered style companion for the discerning user.",
  },
  {
    id: "06",
    title: "Reno Bill",
    category: "Billing SaaS",
    url: "renobill.com",
    link: "https://renobill.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    desc: "Billing infrastructure stripped to its essence — fast invoicing for modern businesses.",
  },
  {
    id: "07",
    title: "NTS with Ankit",
    category: "Personal Brand",
    url: "ntswithankit.com",
    link: "https://ntswithankit.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    desc: "A personal brand platform built with conviction — content, community, and credibility.",
  },
  {
    id: "08",
    title: "Carvaan Holidays",
    category: "Travel & Tourism",
    url: "carvaanholidays.com",
    link: "https://carvaanholidays.com/",
    tech: ["React", "Node.js", "Tailwind"],
    desc: "A travel discovery platform — curated journeys and seamless booking for the modern explorer.",
  },
];

function Card({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(1.4rem, 3vw, 2rem)",
        background: hovered ? "#111" : "#0d0d0d",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "4px",
        textDecoration: "none",
        transition: "background 0.3s, border-color 0.3s",
        minHeight: "clamp(200px, 26vw, 280px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent top bar — slides in on hover */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: ACCENT,
        transform: `scaleX(${hovered ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform 0.4s ease",
        borderRadius: "4px 4px 0 0",
      }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: hovered ? ACCENT : "rgba(255,255,255,0.2)",
          transition: "color 0.3s",
        }}>
          {project.id}
        </span>

        {/* Arrow */}
        <motion.span
          animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: 16,
            color: hovered ? ACCENT : "rgba(255,255,255,0.15)",
            transition: "color 0.3s",
            lineHeight: 1,
          }}
        >
          ↗
        </motion.span>
      </div>

      {/* Bottom content */}
      <div>
        {/* Category */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          marginBottom: "0.4rem",
        }}>
          {project.category}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: "#fff",
          margin: "0 0 0.6rem",
        }}>
          {project.title}
        </h3>

        {/* Desc */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(11px, 1.3vw, 13px)",
          color: "rgba(255,255,255,0.3)",
          lineHeight: 1.65,
          margin: "0 0 1rem",
        }}>
          {project.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              padding: "2px 8px",
              border: `1px solid ${hovered ? "rgba(255,60,0,0.25)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "2px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: hovered ? "rgba(255,60,0,0.7)" : "rgba(255,255,255,0.25)",
              transition: "border-color 0.3s, color 0.3s",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .proj-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 560px) {
          .proj-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .proj-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <section style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.2rem, 5vw, 2rem)",
      }}>

        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              margin: "0 0 0.8rem",
            }}
          >
            Selected Work
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.8rem, 10vw, 7.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#fff",
              margin: 0,
            }}
          >
            Projects
          </motion.h2>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: "1px",
              marginTop: "clamp(1.2rem, 3vw, 2rem)",
              background: `linear-gradient(to right, ${ACCENT}, transparent)`,
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Grid */}
        <div className="proj-grid">
          {[...PROJECTS].reverse().map((p, i) => (
            <Card key={p.id} project={p} index={i} />
          ))}
        </div>

      </section>
    </>
  );
}