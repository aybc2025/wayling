import { SKILL_COLOR } from '../../config/skills.js';
import Icon from '../ui/Icon.jsx';

export default function SkillButton({ skill, label, count, selected, disabled, hotkey, onSelect }) {
  const out = count <= 0;
  return (
    <button type="button" disabled={disabled || out} aria-pressed={selected} aria-label={`${label}: ${count}`}
      onClick={() => onSelect(skill)}
      className={`relative flex h-14 min-w-0 max-w-[44px] flex-1 flex-col items-center justify-between rounded border bg-loam pb-0.5 pt-1.5 transition-transform duration-100 ease-out active:scale-95 land:h-12
        ${selected ? '-translate-y-0.5 border-chalk shadow-selected' : 'border-ridge shadow-raised'} ${out ? 'opacity-40' : ''}`}>
      <span className="text-chalk"><Icon name={skill} className="h-5 w-5" /></span>
      <span className="font-digits text-label leading-none text-chalk" dir="ltr">{count}</span>
      <span className="absolute inset-x-1 top-0 h-0.5 rounded" style={{ background: SKILL_COLOR[skill] }} />
      {hotkey && <span className="pointer-events-none absolute -top-1 end-0 hidden font-digits text-label text-dust sm:block">{hotkey}</span>}
    </button>
  );
}
