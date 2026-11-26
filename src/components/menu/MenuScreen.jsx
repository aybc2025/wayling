import { useMemo, useState } from 'react';
import { LEVELS, indexOfLevel } from '../../levels/index.js';
import { useI18n } from '../../i18n/index.js';
import RatingTabs from './RatingTabs.jsx';
import LevelCard from './LevelCard.jsx';
import Icon from '../ui/Icon.jsx';

export default function MenuScreen({ progress, onPlay, onSettings }) {
  const { t } = useI18n();
  const firstOpen = LEVELS.findIndex((l, i) => progress.unlocked(i) && !progress.isDone(l.id));
  const [rating, setRating] = useState(() => LEVELS[Math.max(0, firstOpen)].rating);
  const list = useMemo(() => LEVELS.filter((l) => l.rating === rating), [rating]);

  return (
    <main className="mx-auto flex h-full w-full max-w-xl flex-col gap-4 overflow-y-auto p-4 pb-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-display text-chalk" dir="ltr">{t('appName')}</h1>
        <button type="button" className="ctl" onClick={onSettings} aria-label={t('menu.settings')}>
          <Icon name="gear" />
        </button>
      </header>
      <RatingTabs value={rating} onChange={setRating} />
      <ul className="flex flex-col gap-3">
        {list.map((level) => {
          const index = indexOfLevel(level.id);
          const locked = !progress.unlocked(index);
          return (
            <li key={level.id}>
              <LevelCard level={level} index={index} best={progress.best(level.id)} done={progress.isDone(level.id)}
                locked={locked} fresh={index === firstOpen} onPlay={onPlay} />
            </li>
          );
        })}
      </ul>
      <p className="mt-auto text-meta text-dust">{t('menu.progress', { n: progress.doneCount, total: LEVELS.length })}</p>
    </main>
  );
}
