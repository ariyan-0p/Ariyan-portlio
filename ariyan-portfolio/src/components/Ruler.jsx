import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '../lib/scroll';
import { SECTIONS } from '../data';

// Right-edge scroll ruler: ticks + progress + current section label.
export default function Ruler() {
  const fill = useRef(null);
  const [cur, setCur] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        fill.current.style.transform = `scaleY(${self.progress})`;
        setPct(Math.round(self.progress * 100));
      },
    });
    const triggers = SECTIONS.map((s, i) => ScrollTrigger.create({
      trigger: s.id === 'top' ? '#top' : `#${s.id}`,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setCur(i),
    }));
    return () => { st.kill(); triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="ruler" aria-hidden="true">
      <div className="ruler__label"><b>{String(cur).padStart(2, '0')}</b> {SECTIONS[cur].label}</div>
      <div className="ruler__line">
        <i ref={fill} />
        {Array.from({ length: 21 }).map((_, i) => <u key={i} className={i % 5 === 0 ? 'is-major' : ''} />)}
      </div>
      <div className="ruler__pct">{String(pct).padStart(3, '0')}</div>
    </div>
  );
}
