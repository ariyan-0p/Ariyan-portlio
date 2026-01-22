import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// --- 1. SCRAMBLE TEXT (Welcomes the user) ---
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
            if (index < iteration) {
              return targetText[index];
            }
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

// --- 2. THE 'AS' REACTOR LOGO ---
const ASReactor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48">
    <defs>
      <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00ffff" />
        <stop offset="100%" stopColor="#0077ff" />
      </linearGradient>
    </defs>

    {/* Spinning Outer Ring */}
    <motion.circle
      cx="100" cy="100" r="90"
      fill="none" stroke="url(#loader-grad)" strokeWidth="3"
      strokeDasharray="20 10 50 10"
      filter="url(#blue-glow)"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      style={{ originX: "100px", originY: "100px" }}
    />
    
    {/* Inner Hexagon Frame */}
    <motion.path 
       d="M100 20 L170 60 V140 L100 180 L30 140 V60 Z"
       fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.5"
       initial={{ pathLength: 0 }}
       animate={{ pathLength: 1 }}
       transition={{ duration: 1.5 }}
    />

    {/* --- THE 'AS' LOGO ANIMATION --- */}
    <g transform="translate(50, 50) scale(1)">
        {/* 'A' */}
        <motion.path
          d="M25 75 L40 30 L55 75 M32 60 H48"
          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#blue-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        />
        {/* 'S' */}
        <motion.path
          d="M80 35 H60 L60 52 H80 L80 75 H60"
          fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#blue-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />
    </g>
  </svg>
);

// --- 3. EXPORT LOADER ---
export default function Loader() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 1000);
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