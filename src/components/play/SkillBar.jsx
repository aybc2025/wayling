import { SKILLS } from '../../config/skills.js';
import { useI18n } from '../../i18n/index.js';
import SkillButton from './SkillButton.jsx';

/** Fixed classic order, LTR island so skills stay in the same place in both languages. */
export default function SkillBar({ stock, armed, onArm }) {
  const { t } = useI18n();
  return (
    <div dir="ltr" role="toolbar" aria-label={t('controls.skills')} className="flex justify-center gap-1 px-1 pb-1 pt-1">
      {SKILLS.map((s, i) => (
        <SkillButton key={s} skill={s} label={t(`skill.${s}`)} count={stock[s] || 0} hotkey={String(i + 1)}
          selected={armed === s} onSelect={onArm} />
      ))}
    </div>
  );
}
