// The preloader is a one-time show: once someone has watched it, return visits (within 12 hours)
// skip straight to the site. Add ?intro=1 to the URL to force it again.
const KEY = 'as_intro_at';
const WINDOW = 12 * 60 * 60 * 1000;

export function shouldSkipIntro() {
  try {
    if (/[?&]intro=1/.test(window.location.search)) return false;
    const t = Number(localStorage.getItem(KEY)) || Number(sessionStorage.getItem(KEY)) || 0;
    return t > 0 && Date.now() - t < WINDOW;
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  const v = String(Date.now());
  try { localStorage.setItem(KEY, v); } catch { /* private mode */ }
  try { sessionStorage.setItem(KEY, v); } catch { /* private mode */ }
}
