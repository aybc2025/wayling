import { useI18n } from '../../i18n/index.js';
import Sheet from './Sheet.jsx';

export default function PauseDialog({ open, onResume, onRestart, onLevels, onSettings }) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onResume(); }} title={t('pause.title')}>
      <button type="button" className="btn btn-primary" onClick={onResume}>{t('pause.resume')}</button>
      <button type="button" className="btn" onClick={onRestart}>{t('pause.restart')}</button>
      <button type="button" className="btn" onClick={onSettings}>{t('pause.settings')}</button>
      <button type="button" className="btn" onClick={onLevels}>{t('pause.levels')}</button>
    </Sheet>
  );
}
