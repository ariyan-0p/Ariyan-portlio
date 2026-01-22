import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  // 1. Track mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Create smooth "Spring" physics (This makes it lag slightly behind the mouse)
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      // Subtract half the width (16px) to center the circle on the mouse
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      {/* THE GLOWING RING */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-cyan-400 rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_15px_rgba(34,211,238,0.5)]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      
      {/* OPTIONAL: A TINY DOT IN THE CENTER (Follows instantly) */}
      <motion.div 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{
            x: cursorX, // No spring, follows instantly
            y: cursorY,
            translateX: 12, // Offset to center inside the 32px ring
            translateY: 12
        }}
      />
    </>
  );
}