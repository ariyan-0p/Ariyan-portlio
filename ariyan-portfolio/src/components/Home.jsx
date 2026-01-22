import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, MessageCircle, Code, MapPin } from 'lucide-react';

// Import Profile Image
import profileImg from '../assets/profile.jpg'; 

export default function Home() {
  // --- PARALLAX LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  function handleMouseMove(event) {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPos = clientX - left - width / 2;
    const yPos = clientY - top - height / 2;
    x.set(xPos);
    y.set(yPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]); 
  const rotateY = useTransform(mouseX, [-500, 500], [-15, 15]); 
  const cardX = useTransform(mouseX, [-500, 500], [-25, 25]);
  const cardY = useTransform(mouseY, [-500, 500], [-25, 25]);

  return (
    // FIX 1: Mobile uses 'h-[100dvh]' & 'overflow-hidden' (One Screen). Desktop keeps 'min-h-screen' (Scrollable).
    <div className="relative w-full h-[100dvh] md:min-h-screen overflow-hidden md:overflow-visible flex flex-col md:flex-row items-center justify-center pt-16 pb-20 md:pt-24 md:pb-40">
      
      {/* Central Glow Light */}
      <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-[500px] h-[500px] md:w-[1000px] md:h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/40 via-blue-600/20 to-transparent blur-[80px] md:blur-[120px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 h-full md:h-auto items-center">
        
        {/* LEFT COLUMN: Text Content */}
        {/* 'order-1' & 'justify-end' ensures text sits nicely at top on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left space-y-3 md:space-y-8 relative order-1 flex flex-col justify-end md:block pb-2 md:pb-0"
        >
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-2 py-1 md:px-3 md:py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] md:text-sm backdrop-blur-sm w-fit">
             <MapPin size={12} className="text-cyan-400" />
             Hyderabad, India
          </div>

          <h1 className="text-4xl md:text-8xl font-bold leading-tight tracking-tight">
            Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Ariyan.</span>
          </h1>
          
          <h2 className="text-sm md:text-4xl font-light text-slate-300 max-w-2xl leading-snug">
            Architecting <span className="text-white font-semibold">Scalable</span> Digital Realities.
          </h2>

          <div className="space-y-2 max-w-lg">
  <h2 className="text-purple-400 font-bold text-lg md:text-xl">
    Full-Spectrum Engineer.
  </h2>
  <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
    I don't just fit into a niche; I build the whole product. From pixel-perfect interfaces to complex server logic, I deliver complete solutions across all platforms.
  </p>
</div>

          <div className="flex gap-3 pt-2 w-full md:w-auto">
            {/* FIX 2: Mobile-Optimized Button */}
           <a 
  href="/resume.pdf" 
  download="Ariyan_Samal_Resume.pdf"
  className="flex-1 md:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs md:text-base font-bold rounded-full hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition transform active:scale-95 flex items-center justify-center gap-2"
>
  <span className="md:hidden">Resume</span>
  <span className="hidden md:block">Download Resume</span>
  <ArrowDown size={16} />
</a>

            <button className="flex-1 md:w-auto px-6 py-3 md:px-8 md:py-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full text-xs md:text-base hover:bg-white/10 transition active:scale-95 flex items-center justify-center gap-2">
              Let's Chat <MessageCircle size={16} />
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Image & Animations */}
        {/* FIX: 'flex-grow' allows image to take remaining space on mobile without scroll */}
        <div 
          className="relative w-full flex-grow md:h-[600px] flex items-center justify-center order-2 perspective-1000 min-h-0 md:mt-0"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          {/* ROTATING SQUARES */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-56 h-56 md:w-[450px] md:h-[450px] border-2 border-purple-500/40 rounded-[30px] md:rounded-[60px] z-0 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-60 h-60 md:w-[480px] md:h-[480px] border-2 border-blue-500/40 rounded-[30px] md:rounded-[60px] z-0 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          />

          {/* ANCHOR CONTAINER */}
          {/* Mobile: Limit width/height to fit inside rotating squares */}
          <div className="relative w-[220px] h-[300px] md:w-[400px] md:h-[550px] z-10">
            
              {/* MAIN PHOTO */}
              <motion.div 
                style={{ 
                  rotateX: window.innerWidth > 768 ? rotateX : 0, 
                  rotateY: window.innerWidth > 768 ? rotateY : 0,
                  transformStyle: "preserve-3d" 
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full bg-black rounded-[24px] md:rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
              >
                <img 
                  src={profileImg} 
                  alt="Ariyan Samal"
                  className="w-full h-full object-cover object-top rounded-[24px] md:rounded-[40px] opacity-90 pointer-events-none"
                />
                <div className="absolute inset-0 rounded-[24px] md:rounded-[40px] bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              </motion.div>

              {/* FLOATING CARDS - Adjusted for Mobile Fit */}
              
              {/* 1. NAMASTE */}
              <motion.div 
                style={{ x: window.innerWidth > 768 ? cardX : 0, y: window.innerWidth > 768 ? cardY : 0, z: 50 }} 
                animate={{ y: [0, -8, 0] }}
                transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 } }}
                // Mobile: Tucked tighter (-top-3, -left-2) | Desktop: (top-8, -left-20)
                className="absolute -top-3 -left-2 md:top-8 md:-left-20 bg-black/80 backdrop-blur-xl p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 flex items-center gap-2 md:gap-3 w-max"
              >
                <motion.div 
                  animate={{ rotate: [0, 20, 0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                  className="text-xl md:text-3xl"
                >
                  👋
                </motion.div>
                <div>
                    <p className="text-xs md:text-base font-bold text-white">Namaste</p>
                </div>
              </motion.div>

              {/* 2. TECH STACK */}
              <motion.div 
                style={{ x: window.innerWidth > 768 ? cardX : 0, y: window.innerWidth > 768 ? cardY : 0, z: 50 }} 
                animate={{ y: [0, -10, 0] }}
                transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                // Mobile: Tucked tighter (bottom-12, -right-3) | Desktop: (top-20, -right-16)
                className="absolute bottom-12 -right-3 md:top-20 md:-right-16 md:bottom-auto bg-black/80 backdrop-blur-xl p-2 md:p-4 rounded-xl md:rounded-2xl border border-purple-500/30 shadow-xl z-20 w-max"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-2 bg-purple-500/20 rounded-lg text-purple-300"><Code size={16} className="md:w-5 md:h-5" /></div>
                  <div>
                    <p className="text-[10px] md:text-lg font-bold text-white">Scalable Tech</p>
                  </div>
                </div>
              </motion.div>

              {/* 3. OPPORTUNITIES */}
              <motion.div 
                style={{ x: window.innerWidth > 768 ? cardX : 0, y: window.innerWidth > 768 ? cardY : 0, z: 50 }} 
                animate={{ y: [0, 10, 0] }}
                transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 } }}
                // Mobile: Tucked tighter (-bottom-5, -left-2) | Desktop: (bottom-20, -left-16)
                className="absolute -bottom-5 -left-2 md:bottom-20 md:-left-16 bg-black/80 backdrop-blur-xl p-2 md:p-4 rounded-xl md:rounded-2xl border border-green-500/30 shadow-xl z-20 w-max"
              >
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="relative">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                   </div>
                   <div>
                     <p className="text-[10px] md:text-lg font-bold text-white">Open to Work</p>
                   </div>
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}