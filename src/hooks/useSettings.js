import { useEffect } from 'react';
import { KEYS } from '../config/storageKeys.js';
import { DIR, defaultLang } from '../i18n/index.js';
import { useStored } from './useStored.js';

const DEFAULTS = { v: 1, lang: defaultLang(), sound: true, music: false, highContrast: false, reducedMotion: 'auto', vibrate: true };
const valid = (r) => r.v === 1 && (r.lang === 'he' || r.lang === 'en') && typeof r.sound === 'boolean';

export function reducedMotionOn(s) {
  if (s.reducedMotion === 'on') return true;
  if (s.reducedMotion === 'off') return false;
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useSettings() {
  const [settings, setSettings] = useStored(KEYS.settings, DEFAULTS, valid);
  useEffect(() => {
    const root = document.documentElement;
    root.lang = settings.lang;
    root.dir = DIR[settings.lang];
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    root.dataset.motion = reducedMotionOn(settings) ? 'reduced' : 'full';
  }, [settings]);
  return [settings, setSettings];
}
