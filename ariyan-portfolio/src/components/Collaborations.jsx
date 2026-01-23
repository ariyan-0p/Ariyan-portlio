import { motion } from 'framer-motion';
import { 
  Building2,    // Keystone
  Eye,          // Clearvision
  Rocket,       // Bounten
  Shirt,        // My Perfect Fit
  BrainCircuit, // Sharkify AI
  Globe,        // Kaizernews
  ArrowRight    // Added Arrow icon
} from 'lucide-react';

const PARTNERS = [
  { 
    id: 1, 
    name: "Keystone Projects", 
    icon: <Building2 size={24} />,
    color: "group-hover:text-amber-400",
    border: "group-hover:border-amber-500/50",
    bg: "group-hover:bg-amber-500/10"
  },
  { 
    id: 2, 
    name: "Clearvision", 
    icon: <Eye size={24} />,
    color: "group-hover:text-cyan-400",
    border: "group-hover:border-cyan-500/50",
    bg: "group-hover:bg-cyan-500/10"
  },
  { 
    id: 3, 
    name: "Bounten", 
    icon: <Rocket size={24} />,
    color: "group-hover:text-blue-400",
    border: "group-hover:border-blue-500/50",
    bg: "group-hover:bg-blue-500/10"
  },
  { 
    id: 4, 
    name: "My Perfect Fit", 
    icon: <Shirt size={24} />,
    color: "group-hover:text-pink-400",
    border: "group-hover:border-pink-500/50",
    bg: "group-hover:bg-pink-500/10"
  },
  { 
    id: 5, 
    name: "Sharkify AI", 
    icon: <BrainCircuit size={24} />,
    color: "group-hover:text-purple-400",
    border: "group-hover:border-purple-500/50",
    bg: "group-hover:bg-purple-500/10"
  },
  { 
    id: 6, 
    name: "Kaizernews", 
    icon: <Globe size={24} />,
    color: "group-hover:text-green-400",
    border: "group-hover:border-green-500/50",
    bg: "group-hover:bg-green-500/10"
  }
];

export default function Collaborations() {
  return (
    <section className="w-full py-24 flex flex-col justify-center items-center overflow-hidden bg-black/50 relative">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>

      {/* 1. HEADER */}
      <div className="px-6 md:px-12 text-center max-w-4xl mx-auto mb-16 space-y-6 relative z-10">
        
        {/* Badge */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs md:text-sm font-bold tracking-wider uppercase backdrop-blur-md"
        >
           <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
           Collaborations
        </motion.div>

        {/* Title */}
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="text-4xl md:text-6xl font-bold text-white tracking-tight"
        >
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Industry Leaders.</span>
        </motion.h2>
      </div>

      {/* 2. INFINITE SCROLL MARQUEE */}
      <div className="w-full relative flex overflow-hidden z-10 mb-20">
         
         {/* Fade Edges */}
         <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

         <motion.div 
           className="flex gap-6 md:gap-8 whitespace-nowrap pl-6 md:pl-0"
           animate={{ x: ["0%", "-50%"] }}
           transition={{ 
             repeat: Infinity, 
             ease: "linear", 
             duration: 30 
           }}
         >
            {/* Loop list 3 times */}
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div 
                key={index}
                className={`w-[200px] md:w-[260px] h-[110px] md:h-[130px] bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 transition-all duration-300 group cursor-default backdrop-blur-sm hover:scale-105 hover:shadow-2xl ${partner.border}`}
              >
                  {/* Icon Container */}
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/5 transition-colors duration-300 ${partner.bg} ${partner.color}`}>
                     {partner.icon}
                  </div>
                  
                  {/* Brand Name */}
                  <span className={`text-base md:text-lg font-bold transition-colors duration-300 group-hover:text-white`}>
                    {partner.name}
                  </span>
              </div>
            ))}
         </motion.div>
      </div>

      {/* 3. NEW: BOTTOM CTA & TEXT */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="px-6 text-center space-y-8 relative z-10"
      >
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          From early-stage startups to established enterprises, I engineer solutions that drive growth.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
           <h3 className="text-2xl md:text-3xl font-bold text-white">
             Ready to build the <span className="text-cyan-400">Next Big Thing?</span>
           </h3>
           
          <a 
  href="mailto:ariyansamal1201@gmail.com"
  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
>
  Let's Add Your Logo <ArrowRight size={20} />
</a>
        </div>
      </motion.div>

    </section>
  );
}