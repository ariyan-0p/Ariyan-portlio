import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';

// Critical UI Components (Loaded Immediately)
import Header from './components/Header';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Dock from './components/Dock';

// Heavy Components (Lazy Loaded for Performance)
const Background3D = lazy(() => import('./components/Background3D'));
const Home = lazy(() => import('./components/Home'));
const Collaborations = lazy(() => import('./components/Collaborations'));
const Projects = lazy(() => import('./components/Projects'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading sequence
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
            
            {/* Optimization: Wrap 3D Background in Suspense */}
            <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
              <Background3D />
            </Suspense>

            {/* MAIN CONTENT STACK */}
            {/* Suspense here handles the loading state of all sub-sections */}
            <main className="relative z-10 w-full flex-grow flex flex-col">
              <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center">Loading...</div>}>
                
                {/* 1. HOME (Hero) */}
                <div id="home">
                   <Home />
                </div>

                {/* 2. COLLABORATIONS (Trust) */}
                <div id="collaborations" className="relative z-20 bg-black/40 backdrop-blur-sm border-t border-white/5">
                   <Collaborations />
                </div>

                {/* 3. WORK (Projects) */}
                <div id="projects" className="relative z-20 bg-black/20 backdrop-blur-sm">
                   <Projects />
                </div>

                {/* 4. ABOUT (Profile) */}
                <div id="about" className="relative z-20 bg-black">
                   <About />
                </div>

                {/* 5. CONTACT (Action) */}
                <div id="contact" className="relative z-20 bg-black">
                   <Contact />
                </div>

              </Suspense>
            </main>

            {/* Navigation Dock */}
            <Dock />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}