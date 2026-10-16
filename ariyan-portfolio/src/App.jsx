import { useCallback, useEffect, useRef, useState } from 'react';
import { startScroll, stopScroll, lockScroll, unlockScroll, gsap, ScrollTrigger, reduceMotion } from './lib/scroll';
import Loader from './components/Loader';
import { shouldSkipIntro } from './lib/intro';
import { isLite } from './lib/health';
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
  const [warm, setWarm] = useState(() => !isLite() && shouldSkipIntro()); // returning visitors: build the cloud straight away
  useEffect(() => { if (isLite()) document.documentElement.classList.add('lite'); }, []);
  const cloud = useRef(false);
  const [skipIntro] = useState(() => isLite() || shouldSkipIntro()); // returning visitors don't get the preloader again
  const [palette, setPalette] = useState(false);
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    startScroll();
    lockScroll('boot');
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

  const onWarm = useCallback(() => setWarm(true), []);
  const onCloud = useCallback(() => { cloud.current = true; }, []);
  const cloudReady = useCallback(() => cloud.current, []);
  const onReveal = useCallback(() => {
    setReady(true);
    unlockScroll('boot');
    if (reduceMotion()) return;
    // everything else slides in as the tiles open
    gsap.from('.nav > *', { y: -34, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', delay: 0.75 });
    gsap.from('.ruler', { x: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 1.1 });
  }, []);
  const onDone = useCallback(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);
  // skipping the preloader: build the particle cloud straight away and reveal as soon as it exists
  useEffect(() => {
    if (!skipIntro) return undefined;
    let done = false;
    const go = () => { if (done) return; done = true; onReveal(); onDone(); };
    // lite mode has no cloud to wait for; otherwise reveal as soon as the cloud exists (or after a failsafe)
    const poll = setInterval(() => { if (isLite() || cloud.current) { clearInterval(poll); go(); } }, 60);
    const failsafe = setTimeout(() => { clearInterval(poll); go(); }, 5000);
    return () => { clearInterval(poll); clearTimeout(failsafe); };
  }, [skipIntro, onReveal, onDone]);

  const openFromPalette = useCallback((slug) => setTimeout(() => setOpenSlug(slug), 120), []);

  return (
    <>
      {!skipIntro && <Loader onWarm={onWarm} cloudReady={cloudReady} onReveal={onReveal} onDone={onDone} />}
      <div className="grain" aria-hidden="true" />
      <Nav onPalette={() => setPalette(true)} />
      <Ruler />
      <Palette open={palette} onClose={() => setPalette(false)} onOpenProject={openFromPalette} />

      <main>
        <Hero quick={skipIntro} warm={warm} ready={ready} onCloud={onCloud} onPalette={() => setPalette(true)} />
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
