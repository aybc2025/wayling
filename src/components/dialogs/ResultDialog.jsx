import { useI18n } from '../../i18n/index.js';
import Meter from '../ui/Meter.jsx';
import Sheet from './Sheet.jsx';

export default function ResultDialog({ open, snap, prevBest, hasNext, onNext, onRetry, onLevels }) {
  const { t } = useI18n();
  const won = snap.status === 'won';
  const needPct = Math.round((snap.need / snap.count) * 100);
  return (
    <Sheet open={open} dismissible={false} title={won ? t('result.won') : t('result.lost')}
      description={won ? undefined : t('result.short', { saved: snap.saved, count: snap.count, need: snap.need })}>
      <div className="flex items-end justify-between" dir="ltr">
        <span className="font-digits text-display text-marigold">{snap.percent}%</span>
        <span className="text-meta text-dust">{t('result.need')} {needPct}%{prevBest > 0 ? ` · ${t('result.best')} ${prevBest}%` : ''}</span>
      </div>
      <Meter value={snap.percent} mark={needPct} bad={!won} />
      {won && hasNext
        ? <button type="button" className="btn btn-primary" onClick={onNext}>{t('result.next')}</button>
        : won ? <p className="text-center text-body text-marigold">{t('result.all')}</p> : null}
      <button type="button" className={won ? 'btn' : 'btn btn-primary'} onClick={onRetry}>{won ? t('result.again') : t('result.retry')}</button>
      <button type="button" className="btn" onClick={onLevels}>{t('result.levels')}</button>
    </Sheet>
  );
}
