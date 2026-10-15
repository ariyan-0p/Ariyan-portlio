import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

let lenis = null;
let tick = null;

export function startScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: reduceMotion() ? 1 : 0.095, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

// iOS WebKit (iPhone / iPad, incl. in-app browsers) drops CSS `position: sticky` in some layouts,
// so the pinned scenes are pinned with ScrollTrigger there instead. `?ios=1` forces it for testing.
export const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    /[?&]ios=1/.test(window.location.search));

// Pins `stage` for the whole height of `wrap` (what `position: sticky; top: 0` does).
export function pinStage(wrap, stage) {
  if (!wrap || !stage) return () => {};
  const st = ScrollTrigger.create({ trigger: wrap, start: 'top top', end: 'bottom bottom', pin: stage, pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true });
  return () => st.kill();
}

// The stacking cards: each card sticks near the top until the stack ends.
export function pinCards(cards, stack) {
  // same offsets as the CSS: 8vh + 20px per card on desktop, 7vh + 14px per card on phones
  const offset = (i) => (window.innerWidth <= 900 ? window.innerHeight * 0.07 + i * 14 : window.innerHeight * 0.08 + i * 20);
  const sts = cards.map((card, i) => ScrollTrigger.create({
    trigger: card,
    start: () => `top ${Math.round(offset(i))}px`,
    endTrigger: stack,
    end: () => `bottom ${Math.round(offset(i) + card.offsetHeight)}px`,
    pin: card,
    pinSpacing: false,
    invalidateOnRefresh: true,
  }));
  return () => sts.forEach((s) => s.kill());
}
// Several layers can lock the page at once (boot sequence, command palette, project case).
// Each lock has its own key, and scrolling resumes only when the last one is released.
const locks = new Set();
export const lockScroll = (key = 'default') => { locks.add(key); if (lenis) lenis.stop(); };
export const unlockScroll = (key = 'default') => { locks.delete(key); if (!locks.size && lenis) lenis.start(); };

export function goTo(id) {
  const el = id === 'top' ? 0 : document.getElementById(id);
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  else el && el.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
