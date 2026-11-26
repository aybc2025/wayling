import { useI18n } from '../../i18n/index.js';
import Icon from '../ui/Icon.jsx';
import HoldButton from './HoldButton.jsx';

export default function ControlRow({ rate, minRate, paused, fast, nukeDisabled, nukeHeld,
  onRate, onPause, onFast, onNuke, onHome }) {
  const { t } = useI18n();
  return (
    <div dir="ltr" className="flex items-center justify-center gap-1.5 px-2 pb-2 land:pb-1">
      <button type="button" className="ctl" onClick={onHome} aria-label={t('controls.home')}><Icon name="grid" /></button>
      <button type="button" className="ctl" disabled={rate <= minRate} onClick={() => onRate(-10)} aria-label={t('controls.slower')}>
        <Icon name="minus" />
      </button>
      <span className="min-w-[44px] text-center font-digits text-body text-chalk" aria-label={t('controls.rate')}>{rate}</span>
      <button type="button" className="ctl" disabled={rate >= 99} onClick={() => onRate(10)} aria-label={t('controls.faster')}>
        <Icon name="plus" />
      </button>
      <button type="button" className={`ctl ${paused ? 'border-marigold text-marigold' : ''}`} aria-pressed={paused}
        onClick={onPause} aria-label={t('controls.pause')}><Icon name={paused ? 'play' : 'pause'} filled={paused} /></button>
      <button type="button" className={`ctl ${fast ? 'border-marigold text-marigold' : ''}`} aria-pressed={fast}
        onClick={onFast} aria-label={t('controls.fast')}><Icon name="ff" filled={fast} /></button>
      <HoldButton icon="nuke" label={t('controls.nuke')} hint={t('controls.nukeHold')} disabled={nukeDisabled}
        hotkeyHeld={nukeHeld} onConfirm={onNuke} />
    </div>
  );
}
