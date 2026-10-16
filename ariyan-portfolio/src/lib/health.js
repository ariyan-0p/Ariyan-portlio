// Crash-loop safety net.
// If the page dies silently (no goodbye event) before it has been alive for a while, several times in a row (typical when a phone
// browser kills a page for using too much memory and silently reloads it), the next load switches to a "lite"
// version: no preloader, no WebGL hero, no 3D gallery. It stays lite for two hours.
// ?lite=1 forces it, ?lite=0 clears it.
const KEY = 'as_health';
const STABLE_AFTER = 12000; // ms alive = "this load was fine"
const LOOP_WINDOW = 150000; // an unstable load this recently counts as part of a loop
const LITE_FOR = 2 * 60 * 60 * 1000;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode */ }
}

function boot() {
  const q = typeof window !== 'undefined' ? window.location.search : '';
  if (/[?&]lite=0/.test(q)) { write({}); return false; }
  if (/[?&]lite=1/.test(q)) return true;

  const now = Date.now();
  const prev = read();
  let crashes = 0;
  if (prev.bootAt && !prev.stable && !prev.clean && now - prev.bootAt < LOOP_WINDOW) crashes = (prev.crashes || 0) + 1;
  let liteUntil = prev.liteUntil || 0;
  if (crashes >= 2) liteUntil = now + LITE_FOR;
  write({ bootAt: now, stable: false, clean: false, crashes, liteUntil });

  // leaving normally (reload, navigation, switching tab/app) fires these; a killed page fires nothing
  const bye = () => write({ ...read(), clean: true });
  window.addEventListener('pagehide', bye);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') bye(); });

  // once this load has survived a while, the loop (if any) is broken
  setTimeout(() => write({ ...read(), bootAt: now, stable: true, clean: false, crashes: 0 }), STABLE_AFTER);
  return liteUntil > now;
}

const LITE = boot();
export const isLite = () => LITE;
