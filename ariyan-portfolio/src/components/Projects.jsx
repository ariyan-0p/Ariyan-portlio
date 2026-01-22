import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Globe, 
  ShoppingBag, 
  Crown, 
  Monitor, 
  ArrowUpRight 
} from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: "Keystone Projects",
    category: "Portfolio",
    description: "High-performance architectural portfolio with smooth frame animations.",
    tech: ["React", "Tailwind", "Motion"],
    icon: <Monitor className="w-5 h-5 text-amber-400" />,
    gradient: "from-amber-600/20 to-orange-500/20",
    border: "group-hover:border-amber-500/50",
    link: "https://keystoneprojects.in/" 
  },
  {
    id: 2,
    title: "Bounten App",
    category: "LMS Tool",
    description: "LMS platform with automated QR generation and progress tracking.",
    tech: ["Flutter", "Node.js", "Firebase"],
    icon: <Smartphone className="w-5 h-5 text-blue-400" />,
    gradient: "from-blue-600/20 to-cyan-500/20",
    border: "group-hover:border-blue-500/50",
    link: "https://play.google.com/store/apps/details?id=com.bounten.profitpartner&hl=en"
  },
  {
    id: 3,
    title: "Skanda Stores",
    category: "E-Commerce",
    description: "Scalable platform with real-time inventory and secure payments.",
    tech: ["Next.js", "MongoDB", "Stripe"],
    icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
    gradient: "from-emerald-600/20 to-green-500/20",
    border: "group-hover:border-emerald-500/50",
    link: "https://skandastores.com/"
  },
  {
    id: 4,
    title: "Groom2b",
    category: "Niche Retail",
    description: "Specialized wedding attire market optimized for high-res visual journeys.",
    tech: ["React", "AWS", "UI/UX"],
    icon: <ShoppingBag className="w-5 h-5 text-pink-400" />,
    gradient: "from-pink-600/20 to-rose-500/20",
    border: "group-hover:border-pink-500/50",
    link: "https://groom2b.in/"
  },
  {
    id: 5,
    title: "MPF Style Club",
    category: "Luxury App",
    description: "AI-powered luxury styling app with premium member features.",
    tech: ["Flutter", "AI", "Cloud"],
    icon: <Crown className="w-5 h-5 text-purple-400" />,
    gradient: "from-purple-600/20 to-violet-500/20",
    border: "group-hover:border-purple-500/50",
    link: "https://www.mpfstyleclub.com/"
  }
];

export default function Projects() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16 space-y-3 relative z-10"
      >
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Engineering
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Works.</span>
        </h2>
      </motion.div>

      {/* COMPACT RECTANGULAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
        {PROJECTS.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`group relative bg-white/5 hover:bg-white/10 border border-white/10 ${project.border} rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block`}
          >
            {/* Hover Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-lg`}></div>

            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
              
              {/* Top Row: Icon + Title + Arrow */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Middle: Description */}
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Bottom: Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                 {project.tech.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] md:text-xs text-slate-300 font-medium">
                       {t}
                    </span>
                 ))}
              </div>

            </div>
          </motion.a>
        ))}
      </div>

    </section>
  );
}