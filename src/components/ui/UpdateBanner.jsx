import { useI18n } from '../../i18n/index.js';

export default function UpdateBanner({ onUpdate }) {
  const { t } = useI18n();
  return (
    <div className="toast-in fixed inset-x-3 top-3 z-50 flex items-center justify-between gap-3 rounded border border-marigold bg-loam px-4 py-2 shadow-overlay" role="status">
      <span className="text-body">{t('update.text')}</span>
      <button type="button" className="ctl border-marigold bg-marigold font-bold text-peat" onClick={onUpdate}>{t('update.action')}</button>
    </div>
  );
}
