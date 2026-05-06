import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Globe, Smartphone, ShoppingBag, Cpu } from "lucide-react";

const ACCENT = "#ff3c00";

const PROJECTS = [
  {
    id: "01",
    title: "Keystone Projects",
    category: "Architectural Portfolio",
    type: "Web",
    year: "2025",
    status: "LIVE",
    url: "keystoneprojects.in",
    link: "https://keystoneprojects.in/",
    tech: ["React", "Tailwind", "Motion"],
    desc: "A bold digital presence for an architectural firm — spatial storytelling through the web.",
    gradient: "from-amber-500/30 via-orange-500/10 to-transparent",
    accent: "#f59e0b",
    featured: true,
  },
  {
    id: "02",
    title: "Bounten App",
    category: "LMS Platform",
    type: "Mobile",
    year: "2025",
    status: "LIVE",
    url: "bounten.com",
    link: "https://play.google.com/store/apps/details?id=com.bounten.profitpartner",
    tech: ["Flutter", "Node.js", "Firebase"],
    desc: "A learning management system built for scale — mobile-first, fast, and frictionless.",
    gradient: "from-blue-500/30 via-cyan-500/10 to-transparent",
    accent: "#3b82f6",
  },
  {
    id: "03",
    title: "Skanda Stores",
    category: "E-Commerce",
    type: "E-Commerce",
    year: "2024",
    status: "LIVE",
    url: "skandastores.com",
    link: "https://skandastores.com/",
    tech: ["Next.js", "MongoDB", "Stripe"],
    desc: "End-to-end commerce experience — from browsing to checkout, built to convert.",
    gradient: "from-rose-500/30 via-pink-500/10 to-transparent",
    accent: "#f43f5e",
  },
  {
    id: "04",
    title: "Groom 2b",
    category: "Niche Retail",
    type: "E-Commerce",
    year: "2024",
    status: "LIVE",
    url: "groom2b.in",
    link: "https://groom2b.in/",
    tech: ["React", "AWS", "UI/UX"],
    desc: "A curated retail experience for a niche market — clean UX with a refined edge.",
    gradient: "from-teal-500/30 via-emerald-500/10 to-transparent",
    accent: "#14b8a6",
  },
  {
    id: "05",
    title: "MPF Style Club",
    category: "Luxury App",
    type: "Mobile",
    year: "2024",
    status: "LIVE",
    url: "mpfstyleclub.com",
    link: "https://www.mpfstyleclub.com/",
    tech: ["Flutter", "AI", "Cloud"],
    desc: "Luxury meets intelligence — an AI-powered style companion for the discerning user.",
    gradient: "from-purple-500/30 via-fuchsia-500/10 to-transparent",
    accent: "#a855f7",
    featured: true,
  },
  {
    id: "06",
    title: "Reno Bill",
    category: "Billing SaaS",
    type: "SaaS",
    year: "2025",
    status: "LIVE",
    url: "renobill.com",
    link: "https://renobill.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    desc: "Billing infrastructure stripped to its essence — fast invoicing for modern businesses.",
    gradient: "from-cyan-500/30 via-sky-500/10 to-transparent",
    accent: "#06b6d4",
  },
  {
    id: "07",
    title: "NTS with Ankit",
    category: "Personal Brand",
    type: "Web",
    year: "2025",
    status: "LIVE",
    url: "ntswithankit.com",
    link: "https://ntswithankit.com/",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    desc: "A personal brand platform built with conviction — content, community, and credibility.",
    gradient: "from-indigo-500/30 via-violet-500/10 to-transparent",
    accent: "#6366f1",
  },
  {
    id: "08",
    title: "Carvaan Holidays",
    category: "Travel & Tourism",
    type: "Web",
    year: "2026",
    status: "NEW",
    url: "carvaanholidays.com",
    link: "https://carvaanholidays.com/",
    tech: ["React", "Node.js", "Tailwind"],
    desc: "A travel discovery platform — curated journeys and seamless booking for the modern explorer.",
    gradient: "from-lime-500/30 via-green-500/10 to-transparent",
    accent: "#84cc16",
    featured: true,
  },
];

const FILTERS = [
  { id: "All", icon: <Sparkles size={12} /> },
  { id: "Web", icon: <Globe size={12} /> },
  { id: "Mobile", icon: <Smartphone size={12} /> },
  { id: "E-Commerce", icon: <ShoppingBag size={12} /> },
  { id: "SaaS", icon: <Cpu size={12} /> },
];

// Bento sizing — cycles through patterns to break grid monotony
const SIZE_PATTERN = [
  "md:col-span-2 md:row-span-2", // big
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-1",
];

function ProjectCard({ project, index, sizeClass }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const isBig = sizeClass.includes("row-span-2");

  return (
    <motion.a
      ref={ref}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0a0a0a] transition-colors duration-300 hover:border-white/20 ${sizeClass} ${
        isBig ? "min-h-[380px] md:min-h-[460px]" : "min-h-[260px]"
      }`}
      style={{ textDecoration: "none" }}
    >
      {/* Mouse-follow spotlight */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mouse.x}% ${mouse.y}%, ${project.accent}22, transparent 60%)`,
        }}
      />

      {/* Gradient wash */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: project.accent }}
      />

      {/* Giant ghosted index number */}
      <div
        className="absolute select-none pointer-events-none font-bold leading-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: isBig ? "clamp(10rem, 22vw, 18rem)" : "clamp(7rem, 14vw, 11rem)",
          right: isBig ? "-1rem" : "-0.5rem",
          bottom: isBig ? "-3rem" : "-2rem",
          color: hovered ? `${project.accent}14` : "rgba(255,255,255,0.025)",
          letterSpacing: "-0.06em",
          transition: "color 0.5s",
        }}
      >
        {project.id}
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-7">
        {/* TOP ROW: browser chrome + status */}
        <div className="flex items-center justify-between gap-3">
          {/* Browser chrome with URL */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex gap-1 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
            </div>
            <div className="text-[10px] font-mono text-white/30 truncate tracking-wide">
              {project.url}
            </div>
          </div>

          {/* Live status badge */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border flex-shrink-0"
            style={{
              borderColor: project.status === "NEW" ? `${project.accent}55` : "rgba(255,255,255,0.08)",
              background: project.status === "NEW" ? `${project.accent}15` : "transparent",
            }}
          >
            <span className="relative flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: project.status === "NEW" ? project.accent : "#22c55e" }}
              />
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ background: project.status === "NEW" ? project.accent : "#22c55e" }}
              />
            </span>
            <span
              className="text-[9px] font-bold tracking-[0.15em]"
              style={{ color: project.status === "NEW" ? project.accent : "rgba(255,255,255,0.5)" }}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* MIDDLE: huge title (only big cards get a tagline render slot) */}
        <div className="flex-1 flex flex-col justify-end mt-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-mono tracking-[0.2em] uppercase"
              style={{ color: hovered ? project.accent : "rgba(255,255,255,0.35)", transition: "color 0.3s" }}
            >
              {project.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-mono tracking-[0.15em] text-white/30">{project.year}</span>
          </div>

          <h3
            className="text-white font-bold leading-[0.95] tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: isBig ? "clamp(2rem, 4vw, 3.2rem)" : "clamp(1.4rem, 2.2vw, 1.7rem)",
              letterSpacing: "-0.03em",
            }}
          >
            {project.title}
          </h3>

          <p
            className={`text-white/45 leading-relaxed mt-3 ${
              isBig ? "text-sm md:text-base max-w-md" : "text-[12px] line-clamp-2"
            }`}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {project.desc}
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {project.tech.slice(0, isBig ? 6 : 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-sm text-[9px] font-mono tracking-[0.12em] uppercase border transition-colors duration-300"
                style={{
                  borderColor: hovered ? `${project.accent}40` : "rgba(255,255,255,0.08)",
                  color: hovered ? project.accent : "rgba(255,255,255,0.4)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTA arrow — slides in on hover */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
            <span
              className="text-[10px] font-mono tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: hovered ? project.accent : "rgba(255,255,255,0.3)" }}
            >
              Visit Site
            </span>
            <motion.div
              animate={{ x: hovered ? 0 : -4, opacity: hovered ? 1 : 0.4 }}
              className="flex items-center justify-center w-8 h-8 rounded-full border"
              style={{
                borderColor: hovered ? project.accent : "rgba(255,255,255,0.1)",
                background: hovered ? `${project.accent}15` : "transparent",
              }}
            >
              <ArrowUpRight size={14} style={{ color: hovered ? project.accent : "rgba(255,255,255,0.5)" }} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === filter);
    return [...list].reverse();
  }, [filter]);

  const stats = useMemo(
    () => [
      { value: PROJECTS.length.toString().padStart(2, "0"), label: "Projects Shipped" },
      { value: "4+", label: "Years Building" },
      { value: new Set(PROJECTS.flatMap((p) => p.tech)).size.toString(), label: "Technologies" },
      { value: "100%", label: "Live in Production" },
    ],
    []
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .proj-bento {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: minmax(260px, auto);
          gap: 12px;
        }
        @media (min-width: 768px) {
          .proj-bento {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: minmax(220px, 1fr);
          }
        }

        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .proj-marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
      `}</style>

      <section
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.2rem, 5vw, 2rem)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* MARQUEE TICKER */}
        <div className="relative w-full overflow-hidden mb-16 md:mb-20 border-y border-white/[0.06] py-4">
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          <div className="proj-marquee-track flex gap-12 whitespace-nowrap will-change-transform">
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <span key={i} className="flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
                <span style={{ color: p.accent }}>●</span>
                {p.title}
                <span className="text-white/15">/</span>
                {p.category}
                <span className="text-white/15">—</span>
              </span>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <div ref={headerRef} className="mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-normal tracking-[0.28em] uppercase text-white/25 mb-3"
              >
                ✦ Selected Work / 2024 — 2026
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-bold m-0"
                style={{
                  fontSize: "clamp(2.8rem, 10vw, 7.5rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                }}
              >
                Projects<span style={{ color: ACCENT }}>.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              A field log of products I've architected and shipped — from MVPs to production-grade platforms serving real users.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] mt-8 origin-left"
            style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
          />
        </div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-[14px] overflow-hidden mb-10"
        >
          {stats.map((s, i) => (
            <div key={i} className="bg-[#0a0a0a] p-5 md:p-6 group hover:bg-[#111] transition-colors">
              <div
                className="text-white font-bold mb-1"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/35">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* FILTER PILLS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const count = f.id === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.type === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full border text-[11px] font-mono tracking-[0.15em] uppercase transition-all ${
                  active
                    ? "border-white/20 text-white bg-white/[0.06]"
                    : "border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/15"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-bg"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}40` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {f.icon}
                  {f.id}
                  <span className="opacity-50 text-[9px]">[{count}]</span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* BENTO GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="proj-bento"
          >
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                sizeClass={filter === "All" ? SIZE_PATTERN[i % SIZE_PATTERN.length] : "md:col-span-1"}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* FOOTER LINE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex items-center justify-between text-[10px] font-mono tracking-[0.25em] uppercase text-white/25"
        >
          <span>End of Archive</span>
          <span className="flex-1 mx-4 h-px bg-white/[0.06]" />
          <span style={{ color: ACCENT }}>● {filtered.length} Showing</span>
        </motion.div>
      </section>
    </>
  );
}
