import { useI18n } from '../../i18n/index.js';

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Cell({ label, value, warn }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="text-label text-dust">{label}</span>
      <span className={`font-digits text-title ${warn ? 'text-ember' : 'text-chalk'}`} dir="ltr">{value}</span>
    </div>
  );
}

export default function Hud({ snap }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-around gap-2 border-b border-strata bg-loam px-3 py-1.5" role="status">
      <Cell label={t('hud.out')} value={snap.out} />
      <Cell label={t('hud.saved')} value={`${snap.saved}/${snap.need}`} />
      <Cell label={t('hud.time')} value={fmt(snap.timeLeft)} warn={snap.timeLeft <= 30} />
    </div>
  );
}
