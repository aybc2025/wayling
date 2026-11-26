import { useEffect } from 'react';

/** Keeps the screen awake while a level is running. Silently does nothing where unsupported. */
export function useWakeLock(active) {
  useEffect(() => {
    if (!active || !navigator.wakeLock) return undefined;
    let lock = null;
    let dead = false;
    const get = () => navigator.wakeLock.request('screen').then((l) => { if (dead) l.release(); else lock = l; }).catch(() => {});
    get();
    const onVis = () => { if (document.visibilityState === 'visible') get(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { dead = true; document.removeEventListener('visibilitychange', onVis); if (lock) lock.release().catch(() => {}); };
  }, [active]);
}
