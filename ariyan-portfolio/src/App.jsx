import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Critical UI Components
import Header from './components/Header';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Dock from './components/Dock';

// Heavy Components (Lazy Loaded)
const Background3D = lazy(() => import('./components/Background3D'));
const Home = lazy(() => import('./components/Home'));
const Collaborations = lazy(() => import('./components/Collaborations'));
const Projects = lazy(() => import('./components/Projects'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

// NEW: A professional fallback component
const PageFallback = () => (
  <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Subtle Liquid Glow Bar */}
      <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          animate={{ x: [-200, 200] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      <span className="text-[10px] font-mono text-cyan-500/50 tracking-[0.3em] uppercase animate-pulse">
        Finalizing System
      </span>
    </motion.div>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Timer matches your Loader's 3-second animation + 0.5s buffer
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen relative font-sans text-white bg-black cursor-none md:cursor-default selection:bg-cyan-500/30 flex flex-col">
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <>
            <Cursor />
            <Header />
            
            <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
              <Background3D />
            </Suspense>

            <main className="relative z-10 w-full flex-grow flex flex-col">
              {/* UPDATED FALLBACK: Replaces the black screen/text */}
              <Suspense fallback={<PageFallback />}>
                
                <div id="home"><Home /></div>

                <div id="collaborations" className="relative z-20 bg-black/40 backdrop-blur-sm border-t border-white/5">
                   <Collaborations />
                </div>

                <div id="projects" className="relative z-20 bg-black/20 backdrop-blur-sm">
                   <Projects />
                </div>

                <div id="about" className="relative z-20 bg-black">
                   <About />
                </div>

                <div id="contact" className="relative z-20 bg-black">
                   <Contact />
                </div>

              </Suspense>
            </main>

            <Dock />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}