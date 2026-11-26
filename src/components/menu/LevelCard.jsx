import { useI18n } from '../../i18n/index.js';
import { thumbUrl } from '../../levels/thumb.js';
import Icon from '../ui/Icon.jsx';

export default function LevelCard({ level, index, best, done, locked, fresh, onPlay }) {
  const { t, lang } = useI18n();
  const tag = locked ? t('menu.locked') : done ? t('menu.done') : fresh ? t('menu.fresh') : '';
  return (
    <button type="button" disabled={locked} onClick={() => onPlay(level.id)}
      className={`panel grid min-h-[84px] w-full grid-cols-[96px_1fr] items-center gap-3 p-2.5 text-start transition-transform duration-100 ease-out active:translate-y-0.5 ${locked ? 'opacity-60' : ''}`}>
      <span className="relative block h-16 overflow-hidden rounded border border-strata bg-peat" dir="ltr">
        <img src={thumbUrl(level)} alt="" className="h-full w-full object-cover" style={{ imageRendering: 'pixelated' }} />
        {locked && <span className="absolute inset-0 flex items-center justify-center bg-peat/50 text-dust"><Icon name="lock" className="h-6 w-6" /></span>}
      </span>
      <span className="block min-w-0">
        <span className="block font-display text-title text-chalk">{index + 1} · {level.name[lang]}</span>
        <span className="block text-meta text-dust">{t('menu.levelInfo', { count: level.count, need: level.need })}</span>
        <span className="mt-1 flex items-center justify-between text-meta">
          <span className={fresh && !locked ? 'font-bold text-marigold' : 'text-dust'}>{tag}</span>
          <span className="font-digits text-body text-marigold" dir="ltr">{done || best ? `${best}%` : ''}</span>
        </span>
      </span>
    </button>
  );
}
