import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Layout, Server, BrainCircuit, Cpu, Zap, 
  Briefcase, MapPin, GraduationCap 
} from 'lucide-react';
import AboutBackground3D from './AboutBackground3D';
import ScrollRevealText from './ScrollRevealText';
import profileImg from '../assets/about.jpg'; 

// --- 1. DATA ---

const TIMELINE = [
  {
    id: 1,
    type: "work",
    role: "Full Stack Developer",
    company: "Sharkify AI",
    location: "Hyderabad",
    date: "Nov 2024 - Present",
    desc: "Leading full-stack development for AI-driven solutions. Architecting scalable web platforms and integrating advanced LLM features.",
    color: "text-purple-400",
    border: "group-hover:border-purple-500/50",
    bg: "group-hover:bg-purple-500/10"
  },
  {
    id: 2,
    type: "work",
    role: "Development Intern",
    company: "My Perfect Fit",
    location: "Hyderabad",
    date: "Jan 2024 - July 2024",
    desc: "Contributed to the development of a luxury fashion-tech platform. Optimized frontend performance and enhanced mobile responsiveness.",
    color: "text-pink-400",
    border: "group-hover:border-pink-500/50",
    bg: "group-hover:bg-pink-500/10"
  },
  {
    id: 3,
    type: "work",
    role: "DevOps Intern",
    company: "EstateDekho.com",
    location: "Hyderabad",
    date: "Oct 2023 - Dec 2023",
    desc: "Managed cloud infrastructure and CI/CD pipelines. Automated deployment workflows to improve release efficiency.",
    color: "text-orange-400",
    border: "group-hover:border-orange-500/50",
    bg: "group-hover:bg-orange-500/10"
  },
  {
    id: 4,
    type: "education",
    role: "B.Tech in Computer Science",
    company: "KIIT University",
    location: "Bhubaneswar",
    date: "Aug 2021 - Aug 2024",
    desc: "Graduated with a focus on Software Engineering and Algorithms. Active member of the university coding society.",
    color: "text-green-400",
    border: "group-hover:border-green-500/50",
    bg: "group-hover:bg-green-500/10"
  },
  {
    id: 5,
    type: "education",
    role: "Diploma in Computer Science",
    company: "Polytechnic",
    location: "Berhampur",
    date: "June 2018 - July 2021",
    desc: "Built a strong foundation in computer science fundamentals, networking, and basic programming logic.",
    color: "text-blue-400",
    border: "group-hover:border-blue-500/50",
    bg: "group-hover:bg-blue-500/10"
  },
  {
    id: 6,
    type: "education",
    role: "Matriculation",
    company: "De Paul School",
    location: "Berhampur",
    date: "2018",
    desc: "Completed secondary education with distinction.",
    color: "text-slate-400",
    border: "group-hover:border-slate-500/50",
    bg: "group-hover:bg-slate-500/10"
  }
];

const EXPERTISE = [
  {
    icon: <Layout size={28} />,
    title: "Frontend Architecture",
    desc: "Crafting pixel-perfect, responsive interfaces using React, Next.js, and Tailwind.",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    icon: <Server size={28} />,
    title: "Backend Systems",
    desc: "Building scalable microservices and REST APIs with Node.js and Go.",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    icon: <BrainCircuit size={28} />,
    title: "AI & Machine Learning",
    desc: "Integrating LLMs and building predictive models using Python and TensorFlow.",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30" 
  },
  {
    icon: <Cpu size={28} />,
    title: "System Design",
    desc: "Architecting cloud-native solutions on AWS/Docker with CI/CD automation.",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  }
];

// --- 2. ULTRA-SMOOTH EXPERIENCE TIMELINE ---

function ExperienceTimeline() {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // ULTRA-SMOOTH: Spring physics + precise range for 6 items
  const smoothX = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-96%"]), {
    stiffness: 120,
    damping: 25,
    mass: 0.8
  });

  // Subtle parallax scale effect
  const scale = useSpring(useTransform(scrollYProgress, [0.1, 0.9], [0.98, 1.02]), {
    stiffness: 200,
    damping: 20
  });

  return (
    <div ref={targetRef} className="relative h-[520vh] bg-black overflow-clip">
      
      {/* GPU-accelerated sticky container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden" style={{
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}>
        
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

        {/* Title - Fixed position */}
        <div className="absolute top-12 left-6 md:left-24 z-20 pointer-events-none">
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500">Journey.</span>
          </h3>
          <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse mt-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            Scroll to explore timeline
          </div>
        </div>

        {/* MAIN SMOOTH TIMELINE */}
        <motion.div 
          style={{ 
            x: smoothX,
            scale: scale
          }} 
          className="flex gap-0 items-center pl-20 md:pl-[clamp(480px,48vw,680px)] relative z-10 origin-left"
        >
          
          {/* Animated timeline line */}
          <motion.div 
            className="absolute top-1/2 left-0 w-[160%] h-[2px] bg-gradient-to-r from-transparent via-green-500/80 to-transparent transform -translate-y-1/2 z-0"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {TIMELINE.map((item, index) => (
            <div key={item.id} className="relative w-[380px] md:w-[440px] flex-shrink-0 group px-8">
              
              {/* SMOOTH GLOWING NODE */}
              <motion.div 
                className={`absolute top-1/2 left-8 w-5 h-5 rounded-full bg-black/50 border-3 z-20 transform -translate-y-1/2 -translate-x-1/2 backdrop-blur-sm ${item.type === 'work' ? 'border-green-500/80 shadow-green-500/40' : 'border-blue-500/80 shadow-blue-500/40'}`}
                whileHover={{ 
                  scale: 1.8,
                  boxShadow: item.type === 'work' ? "0 0 40px rgba(34,197,94,0.9)" : "0 0 40px rgba(59,130,246,0.9)"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              />

              {/* SMOOTH VERTICAL CONNECTOR */}
              <motion.div 
                className={`absolute top-1/2 left-8 w-[3px] h-[45px] bg-gradient-to-b transform -translate-x-1/2 backdrop-blur-sm rounded-full ${item.type === 'work' ? 'from-green-500/70 via-green-400/90 to-transparent' : 'from-blue-500/70 via-blue-400/90 to-transparent'}`}
                whileHover={{ height: "85px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {/* GLASSMORPHISM CARD */}
              <motion.div 
                className={`mt-16 p-7 md:p-9 rounded-3xl bg-white/3 border border-white/12 backdrop-blur-2xl hover:bg-white/7 transition-all duration-700 hover:-translate-y-3 shadow-xl hover:shadow-2xl hover:shadow-green-500/25 ${item.border}`}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 35px 60px -15px rgba(0, 0, 0, 0.6)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-white leading-tight">{item.role}</h4>
                    <span className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold">{item.type}</span>
                  </div>
                  <motion.span 
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold border border-white/20 backdrop-blur-sm ${item.color}`}
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.date}
                  </motion.span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm mb-7">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.type === 'work' ? 
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <Briefcase size={16} className="text-emerald-400 drop-shadow-sm" />
                      </motion.div> 
                      : 
                      <motion.div whileHover={{ rotate: -15 }} transition={{ duration: 0.4 }}>
                        <GraduationCap size={16} className="text-sky-400 drop-shadow-sm" />
                      </motion.div>
                    } 
                    <span className="font-medium truncate">{item.company}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50 mx-3 flex-shrink-0"></span>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <p className="text-slate-200 text-sm md:text-base leading-relaxed border-l-3 border-white/20 pl-5 py-3 bg-white/1 rounded-xl backdrop-blur-md shadow-sm">
                  {item.desc}
                </p>
              </motion.div>
            </div>
          ))}

          {/* Perfect end spacer */}
          <div className="w-[350px] md:w-[400px] flex-shrink-0 h-1"></div>

        </motion.div>
      </div>
    </div>
  );
}

// --- 3. MAIN COMPONENT ---

export default function About() {
  return (
    <div className="bg-black w-full relative">
      
      {/* 1. INTRO & EXPERTISE */}
      <section className="w-full min-h-screen relative py-24 md:py-32 overflow-hidden">
        
        <AboutBackground3D />

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-32">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs md:text-sm font-mono tracking-wider uppercase backdrop-blur-md"
              >
                 <Zap size={14} /> Driven by Purpose
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-bold text-white leading-tight"
              >
                What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Do.</span>
              </motion.h2>

              <div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed">
                <ScrollRevealText className="text-white font-medium">
                  I create with passion and purpose. For me, design isn't just about making things look beautiful—it's about solving real problems that matter.
                </ScrollRevealText>
                <ScrollRevealText className="text-white">
                   With over 2 years of experience, I've learned that the most impactful solutions come from deeply understanding user needs.
                </ScrollRevealText>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative h-[450px] md:h-[650px] rounded-[30px] overflow-hidden border border-white/10 shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img 
                src={profileImg} 
                alt="Ariyan Samal" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
            </motion.div>
          </div>

          <div className="space-y-12 mb-20">
             <motion.h3
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-3xl md:text-4xl font-bold text-white"
             >
               Core Expertise
             </motion.h3>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {EXPERTISE.map((item, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   className={`p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2`}
                 >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                     {item.icon}
                   </div>
                   <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
                   <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                     {item.desc}
                   </p>
                 </motion.div>
               ))}
             </div>
          </div>

        </div>
      </section>

      <ExperienceTimeline />

    </div>
  );
}
