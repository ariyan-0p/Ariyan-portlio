import { useCallback, useEffect, useState } from 'react';
import { startScroll, stopScroll, ScrollTrigger } from './lib/scroll';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Palette from './components/Palette';
import Ruler from './components/Ruler';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Process from './components/Process';
import Manifesto from './components/Manifesto';
import Work from './components/Work';
import Log from './components/Log';
import Contact from './components/Contact';

export default function App() {
  const [ready, setReady] = useState(false);
  const [palette, setPalette] = useState(false);
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    startScroll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return stopScroll;
  }, []);

  useEffect(() => {
    const key = (e) => {
      const typing = /input|textarea/i.test(e.target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setPalette(true); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  const onDone = useCallback(() => {
    setReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);
  const openFromPalette = useCallback((slug) => setTimeout(() => setOpenSlug(slug), 120), []);

  return (
    <>
      <Loader onDone={onDone} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav onPalette={() => setPalette(true)} />
      <Ruler />
      <Palette open={palette} onClose={() => setPalette(false)} onOpenProject={openFromPalette} />

      <main>
        <Hero ready={ready} onPalette={() => setPalette(true)} />
        <Marquee />
        <Work openSlug={openSlug} setOpenSlug={setOpenSlug} />
        <Manifesto />
        <Process />
        <Log />
        <Contact />
      </main>
    </>
  );
}
