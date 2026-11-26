import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext, makeT } from './i18n/index.js';
import { useSettings } from './hooks/useSettings.js';
import { useProgress } from './hooks/useProgress.js';
import { useAudio } from './hooks/useAudio.js';
import { LEVELS, levelById } from './levels/index.js';
import { setupPwa } from './pwa.js';
import MenuScreen from './components/menu/MenuScreen.jsx';
import PlayScreen from './components/play/PlayScreen.jsx';
import SettingsDialog from './components/dialogs/SettingsDialog.jsx';
import UpdateBanner from './components/ui/UpdateBanner.jsx';

export default function App() {
  const [settings, setSettings] = useSettings();
  const progress = useProgress();
  const [levelId, setLevelId] = useState(null);
  const [runKey, setRunKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [updater, setUpdater] = useState(null);

  const i18n = useMemo(() => ({ lang: settings.lang, t: makeT(settings.lang) }), [settings.lang]);
  const audio = useAudio(settings, levelId !== null);

  useEffect(() => {
    const update = setupPwa(() => setUpdater(() => update));
  }, []);

  const play = useCallback((id) => { setLevelId(id); setRunKey((k) => k + 1); }, []);
  const next = useCallback(() => {
    const i = LEVELS.findIndex((l) => l.id === levelId);
    if (i >= 0 && i < LEVELS.length - 1) play(LEVELS[i + 1].id);
  }, [levelId, play]);

  const level = levelId ? levelById(levelId) : null;

  return (
    <I18nContext.Provider value={i18n}>
      <div className="h-full">
        {level ? (
          <PlayScreen key={`${level.id}:${runKey}`} level={level} runKey={runKey} settings={settings} audio={audio}
            progress={progress} onRetry={() => setRunKey((k) => k + 1)} onNext={next}
            onMenu={() => setLevelId(null)} onSettings={() => setSettingsOpen(true)} settingsOpen={settingsOpen} />
        ) : (
          <MenuScreen progress={progress} onPlay={play} onSettings={() => setSettingsOpen(true)} />
        )}
        <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} set={setSettings} />
        {updater && <UpdateBanner onUpdate={() => updater(true)} />}
      </div>
    </I18nContext.Provider>
  );
}
