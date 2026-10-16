import { useEffect, useState } from 'react';
import { goTo } from '../lib/scroll';
import { useClock } from '../lib/useClock';
import { SECTIONS } from '../data';

export default function Nav({ onPalette }) {
  const time = useClock();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);

  const go = (id) => { setOpen(false); setTimeout(() => goTo(id), open ? 350 : 0); };

  return (
    <>
      <header className="nav">
        <button className="nav__brand" onClick={() => go('top')} data-cursor="TOP">
          <span className="nav__logo">AS</span>
          <span className="nav__name">Ariyan Samal<sup>©26</sup></span>
        </button>

        <nav className="nav__links" aria-label="Primary">
          {SECTIONS.slice(1).map((s) => (
            <button key={s.id} onClick={() => go(s.id)} className="nav__link">
              {s.label}
            </button>
          ))}
        </nav>

        <div className="nav__right">
          <span className="nav__clock"><i className="dot" />IST {time}</span>
          <button className="nav__kbd" onClick={onPalette} aria-label="Open command palette" data-cursor="CMD">
            <kbd>⌘</kbd><kbd>K</kbd>
          </button>
          <button className="nav__menu" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {SECTIONS.slice(1).map((s) => (
            <li key={s.id}>
              <button onClick={() => go(s.id)}>{s.label}</button>
            </li>
          ))}
        </ul>
        <div className="sheet__foot">
          <span>{PROFILE_LINE}</span>
          <button onClick={() => { setOpen(false); onPalette(); }}>Command palette ⌘K</button>
        </div>
      </div>
    </>
  );
}

const PROFILE_LINE = 'Hyderabad, India — available for new work';
