import { RATINGS } from '../../levels/index.js';
import { useI18n } from '../../i18n/index.js';

export default function RatingTabs({ value, onChange }) {
  const { t } = useI18n();
  return (
    <div role="tablist" aria-label={t('menu.ratings')} className="grid grid-cols-4 gap-1">
      {RATINGS.map((r) => (
        <button key={r} type="button" role="tab" aria-selected={value === r} onClick={() => onChange(r)}
          className={`min-h-[44px] rounded border text-meta transition-transform duration-100 ease-out active:scale-95 ${value === r ? 'border-marigold bg-marigold font-bold text-peat' : 'border-ridge bg-peat text-chalk'}`}>
          {t(`rating.${r}`)}
        </button>
      ))}
    </div>
  );
}
