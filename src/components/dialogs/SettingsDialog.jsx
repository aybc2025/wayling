import { useI18n } from '../../i18n/index.js';
import Sheet from './Sheet.jsx';

function Row({ label, children }) {
  return <div className="flex min-h-[44px] items-center justify-between gap-3"><span className="text-body">{label}</span>{children}</div>;
}

function Switch({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-7 w-12 rounded-full border transition-colors duration-160 ease-out ${on ? 'border-marigold bg-marigold' : 'border-ridge bg-peat'}`}>
      <span className={`absolute start-0 top-0.5 h-5 w-5 rounded-full bg-chalk transition-transform duration-160 ease-out ${on ? 'translate-x-[22px] rtl:-translate-x-[22px]' : 'translate-x-0.5 rtl:-translate-x-0.5'}`}
        />
    </button>
  );
}

function Seg({ value, options, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup">
      {options.map(([v, label]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
          className={`min-h-[40px] rounded border px-3 text-meta transition-transform duration-100 ease-out active:scale-95 ${value === v ? 'border-marigold bg-marigold font-bold text-peat' : 'border-ridge bg-peat text-chalk'}`}>{label}</button>
      ))}
    </div>
  );
}

export default function SettingsDialog({ open, onClose, settings, set }) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }} title={t('settings.title')}>
      <Row label={t('settings.language')}>
        <Seg value={settings.lang} onChange={(lang) => set({ lang })} options={[['he', 'עברית'], ['en', 'English']]} />
      </Row>
      <Row label={t('settings.sound')}><Switch on={settings.sound} onChange={(sound) => set({ sound })} label={t('settings.sound')} /></Row>
      <Row label={t('settings.music')}><Switch on={settings.music} onChange={(music) => set({ music })} label={t('settings.music')} /></Row>
      <Row label={t('settings.vibrate')}><Switch on={settings.vibrate} onChange={(vibrate) => set({ vibrate })} label={t('settings.vibrate')} /></Row>
      <Row label={t('settings.contrast')}><Switch on={settings.highContrast} onChange={(highContrast) => set({ highContrast })} label={t('settings.contrast')} /></Row>
      <Row label={t('settings.motion')}>
        <Seg value={settings.reducedMotion} onChange={(reducedMotion) => set({ reducedMotion })}
          options={[['auto', t('settings.auto')], ['on', t('settings.on')], ['off', t('settings.off')]]} />
      </Row>
      <button type="button" className="btn btn-primary" onClick={onClose}>{t('settings.close')}</button>
    </Sheet>
  );
}
