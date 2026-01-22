import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Users, Briefcase, User, Mail } from "lucide-react";

export default function Dock() {
  const [activeTab, setActiveTab] = useState("home");

  // Navigation Items with "About" added
  const navItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "collaborations", label: "Collabs", icon: <Users size={20} /> },
    { id: "projects", label: "Work", icon: <Briefcase size={20} /> },
    { id: "about", label: "About", icon: <User size={20} /> }, // NEW ITEM
    { id: "contact", label: "Contact", icon: <Mail size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
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
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="flex items-center gap-1 p-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative z-10 text-sm font-bold whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}