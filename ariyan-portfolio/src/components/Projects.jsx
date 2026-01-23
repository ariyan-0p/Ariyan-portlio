import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  Smartphone, 
  ShoppingBag, 
  Crown, 
  Monitor, 
  ArrowUpRight 
} from 'lucide-react';

const PROJECTS = [
  // ... (Keep your existing PROJECTS array exactly as it is)
];

export default function Projects() {
  // Optimization 1: Memoize the project cards to prevent unnecessary re-renders during scroll
  const projectCards = useMemo(() => PROJECTS.map((project, index) => (
    <motion.a
      key={project.id}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 15 }} // Reduced distance for faster paint
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Trigger slightly before it hits the viewport
      transition={{ delay: index * 0.05, duration: 0.3 }} // Faster transitions
      className={`group relative bg-white/5 hover:bg-white/10 border border-white/10 ${project.border} rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block overflow-hidden`}
    >
      {/* Optimization 2: Use opacity and transform for gradients to keep them GPU-accelerated */}
      <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-md`}></div>

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
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

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
           {project.tech.map((t, i) => (
              <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] md:text-xs text-slate-300 font-medium">
                 {t}
              </span>
           ))}
        </div>
      </div>
    </motion.a>
  )), []);

  return (
    <section className="w-full min-h-screen flex flex-col justify-center max-w-[1200px] mx-auto px-6 md:px-12 py-24 md:py-32 relative overflow-hidden">
      
      {/* Optimization 3: Simplified Decor Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16 space-y-3 relative z-10"
      >
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Engineering
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Works.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
        {projectCards}
      </div>

    </section>
  );
}