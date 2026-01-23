import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// --- 1. SCRAMBLE TEXT ---
const ScrambleText = () => {
  const targetText = "WELCOME";
  const [text, setText] = useState("INITIALIZING");
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText((prev) =>
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return targetText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.h1 
      initial={{ opacity: 0, letterSpacing: "0.5em" }}
      animate={{ opacity: 1, letterSpacing: "0.2em" }}
      className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 font-mono"
    >
      {text}
    </motion.h1>
  );
};

// --- 2. THE 'AS' REACTOR LOGO (Loading Ring Removed) ---
const ASReactor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48">
    <defs>
      <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* STATIC OUTER FRAME: Just a very faint guide ring */}
    <circle
      cx="100" cy="100" r="90"
      fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.05"
    />

    {/* ENERGY SEGMENTS: Static reactor details around the logo */}
    {[...Array(8)].map((_, i) => (
      <rect 
        key={i}
        x="99" y="5" width="2" height="10" 
        fill="#00ffff" 
        opacity="0.3"
        transform={`rotate(${i * 45} 100 100)`} 
      />
    ))}

    {/* CENTERED HEXAGON FRAME */}
    <motion.path 
       d="M100 35 L156.3 67.5 V132.5 L100 165 L43.7 132.5 V67.5 Z"
       fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.2"
       initial={{ pathLength: 0 }}
       animate={{ pathLength: 1 }}
       transition={{ duration: 1.5 }}
    />

    {/* CENTERED 'AS' LOGO */}
    <g transform="translate(100, 100)">
        {/* 'A' */}
        <motion.path
          d="M-30 25 L-15 -20 L0 25 M-23 10 H-7"
          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#blue-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        {/* 'S' */}
        <motion.path
          d="M35 -15 H15 L15 2 H35 L35 25 H15"
          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#blue-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />
    </g>
  </svg>
);

// --- 3. EXPORT LOADER ---
export default function Loader() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center space-y-10 z-10">
        <ASReactor />
        <div className="h-16">
            {showText && <ScrambleText />}
        </div>
      </div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none"></div>
    </motion.div>
  );
}