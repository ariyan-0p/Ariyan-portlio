import { motion } from 'framer-motion';

// The "AS" Monogram Logo
const ASLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
    <defs>
      <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
      </linearGradient>
    </defs>
    
    {/* Hexagon Container */}
    <motion.path 
       d="M50 5 L93.3 25 V75 L50 95 L6.7 75 V25 Z"
       fill="none"
       stroke="url(#header-grad)"
       strokeWidth="1.5"
       initial={{ pathLength: 0, opacity: 0 }}
       animate={{ pathLength: 1, opacity: 1 }}
       transition={{ duration: 1 }}
    />
    
    {/* Letter 'A' */}
    <motion.path
      d="M25 75 L40 30 L55 75 M32 60 H48"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />

    {/* Letter 'S' */}
    <motion.path
      d="M80 35 H60 L60 52 H80 L80 75 H60"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    />
  </svg>
);

export default function Header() {
  return (
    <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-6 pointer-events-none flex justify-between items-center"
    >
        {/* Logo Container - With '-mt-1' to move it up slightly */}
        <div className="pointer-events-auto w-fit bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/5 hover:border-purple-500/30 transition-colors cursor-pointer -mt-1">
            <ASLogo />
        </div>

    </motion.div>
  );
}