import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon.jsx';

const HOLD_MS = 2000;

/** Hold-to-confirm. Fills slowly and linearly, releases instantly. */
export default function HoldButton({ icon, label, hint, disabled, onConfirm, hotkeyHeld }) {
  const [on, setOn] = useState(false);
  const timer = useRef(0);
  const start = () => {
    if (disabled) return;
    setOn(true);
    timer.current = window.setTimeout(() => { setOn(false); onConfirm(); }, HOLD_MS);
  };
  const stop = () => { window.clearTimeout(timer.current); setOn(false); };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (hotkeyHeld) start(); else stop(); }, [hotkeyHeld]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button type="button" disabled={disabled} aria-label={`${label}. ${hint}`}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="ctl relative overflow-hidden">
      <span className={`hold-fill absolute inset-0 origin-left bg-ember/60 ${on ? 'transition-transform duration-[2000ms] ease-linear' : 'transition-transform duration-200 ease-out'}`}
        style={{ transform: `scaleX(${on ? 1 : 0})` }} />
      <span className="relative flex items-center gap-1.5"><Icon name={icon} />{on && <span className="text-label">{hint}</span>}</span>
    </button>
  );
}
