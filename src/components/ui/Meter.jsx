import { useEffect, useState } from 'react';

/** Result meter with the required mark. Fill animates once with transform only. */
export default function Meter({ value, mark, bad = false }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <div dir="ltr" className="relative h-3 overflow-hidden rounded border border-ridge bg-peat" role="img" aria-label={`${value}%`}>
      <div className={`meter-fill absolute inset-y-0 left-0 w-full origin-left transition-transform duration-600 ease-out ${bad ? 'bg-ember' : 'bg-digger'}`}
        style={{ transform: `scaleX(${Math.max(0, Math.min(100, v)) / 100})` }} />
      <div className="absolute -inset-y-0.5 w-0.5 bg-chalk" style={{ left: `${mark}%` }} />
    </div>
  );
}
