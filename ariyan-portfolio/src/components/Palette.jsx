import { useEffect, useMemo, useRef, useState } from 'react';
import { goTo, lockScroll, unlockScroll } from '../lib/scroll';
import { PROFILE, PROJECTS } from '../data';

// Command palette — ⌘K / Ctrl+K / "/"
export default function Palette({ open, onClose, onOpenProject }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const [note, setNote] = useState('');
  const input = useRef(null);

  const cmds = useMemo(() => {
    const nav = [
      ['goto work', 'Jump to selected work', () => goTo('work')],
      ['goto capabilities', 'What I build with', () => goTo('capabilities')],
      ['goto process', 'How I work', () => goTo('process')],
      ['goto log', 'git log — experience', () => goTo('log')],
      ['goto contact', 'Start a project', () => goTo('contact')],
    ];
    const act = [
      ['open resume', 'Résumé (Google Drive)', () => window.open(PROFILE.resume, '_blank', 'noopener')],
      ['mail ariyan', PROFILE.email, () => { window.location.href = `mailto:${PROFILE.email}`; }],
      ['whatsapp', 'Chat on WhatsApp', () => window.open(PROFILE.whatsapp, '_blank', 'noopener')],
      ['open linkedin', 'LinkedIn profile', () => window.open(PROFILE.linkedin, '_blank', 'noopener')],
      ['toggle invert', 'Flip the colour scheme', () => document.documentElement.classList.toggle('invert')],
      ['sudo hire ariyan', 'Permission granted ✓', () => { setNote('[sudo] permission granted — opening contact…'); setTimeout(() => goTo('contact'), 500); }],
    ];
    const proj = PROJECTS.map((p) => [`open ${p.slug}`, `${p.title} — ${p.category}`, () => onOpenProject(p.slug)]);
    return [...nav, ...proj, ...act];
  }, [onOpenProject]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return cmds;
    return cmds.filter(([k, d]) => (k + ' ' + d).toLowerCase().includes(s));
  }, [q, cmds]);

  // reset when (re)opened — adjusting state during render is the sanctioned pattern here
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) { setQ(''); setI(0); setNote(''); }
  }

  useEffect(() => {
    if (open) {
      lockScroll();
      if (input.current) input.current.focus();
      const id = setTimeout(() => input.current && input.current.focus(), 60);
      return () => clearTimeout(id);
    }
    unlockScroll();
    return undefined;
  }, [open]);

  const run = (c) => {
    if (!c) return;
    c[2]();
    if (!c[0].startsWith('sudo') && !c[0].startsWith('toggle')) onClose();
    else setTimeout(onClose, 900);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, list.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
    else if (e.key === 'Enter') run(list[i]);
  };

  return (
    <div className={`pal ${open ? 'is-open' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()} aria-hidden={!open}>
      <div className="pal__box" role="dialog" aria-label="Command palette" onKeyDown={onKey}>
        <div className="pal__in">
          <span>ariyan@portfolio:~$</span>
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} placeholder="type a command…" spellCheck={false} />
          <kbd>esc</kbd>
        </div>
        <ul className="pal__list">
          {list.length === 0 && <li className="pal__empty">command not found: {q}</li>}
          {list.map((c, n) => (
            <li key={c[0]}>
              <button className={n === i ? 'is-on' : ''} onMouseMove={() => setI(n)} onClick={() => run(c)}>
                <b>{c[0]}</b><span>{c[1]}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="pal__foot">{note || '↑ ↓ navigate · ↵ run · esc close'}</div>
      </div>
    </div>
  );
}
