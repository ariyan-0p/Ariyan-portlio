import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Briefcase, User, Mail } from "lucide-react";

export default function Dock() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "collaborations", label: "Collabs", icon: <Users size={20} /> },
    { id: "projects", label: "Work", icon: <Briefcase size={20} /> },
    { id: "about", label: "About", icon: <User size={20} /> },
    { id: "contact", label: "Contact", icon: <Mail size={20} /> },
  ];

  // Performance Optimization: Throttled Scroll Listener
  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        for (const item of navItems) {
          const section = document.getElementById(item.id);
          if (section) {
            const { offsetTop, offsetHeight } = section;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveTab(item.id);
            }
          }
        }
        timeoutId = null;
      }, 100); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        /* LIQUID GLASS CONTAINER */
        className="flex items-center gap-1 p-1.5 bg-white/[0.03] backdrop-blur-[40px] rounded-full border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.8)"
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-500 ${
                isActive ? "text-white" : "text-slate-500 hover:text-white"
              }`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="liquid-pill"
                    /* CLEAN LIQUID PILL: Removed glint line per request */
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0"
                    transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 28,   
                        mass: 0.6      
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.span 
                animate={{ scale: isActive ? 1.1 : 1 }}
                className="relative z-10"
              >
                {item.icon}
              </motion.span>
              
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    className="relative z-10 text-[11px] font-bold tracking-tight"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}