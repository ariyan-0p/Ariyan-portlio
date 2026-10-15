import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
export const lockScroll = () => lenis && lenis.stop();
export const unlockScroll = () => lenis && lenis.start();

export function goTo(id) {
  const el = id === 'top' ? 0 : document.getElementById(id);
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  else el && el.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
