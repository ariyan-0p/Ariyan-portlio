import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Component Imports
import Background3D from './components/Background3D';
import Dock from './components/Dock';
import Home from './components/Home';
import Collaborations from './components/Collaborations';
import Projects from './components/Projects';
import About from './components/About'; // NEW IMPORT
import Contact from './components/Contact';
import Header from './components/Header';
import Loader from './components/Loader';
import Cursor from './components/Cursor';

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
            <Background3D />

            {/* MAIN CONTENT STACK */}
            <main className="relative z-10 w-full flex-grow flex flex-col">
              
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

              {/* 4. ABOUT (Profile) - NEW SECTION */}
              <div id="about" className="relative z-20 bg-black">
                 <About />
              </div>

              {/* 5. CONTACT (Action) */}
              <div id="contact" className="relative z-20 bg-black">
                 <Contact />
              </div>

            </main>

            {/* Navigation Dock */}
            <Dock />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}