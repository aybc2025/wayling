import { useCallback, useEffect, useMemo } from 'react';
import { Synth } from '../audio/synth.js';
import { Music } from '../audio/music.js';
import { playEvent } from '../audio/sfx.js';

/** Sound and haptics. The AudioContext is created on the first tap, as browsers require. */
export function useAudio(settings, playing) {
  const synth = useMemo(() => new Synth(), []);
  const music = useMemo(() => new Music(synth), [synth]);

  useEffect(() => {
    const unlock = () => synth.unlock();
    window.addEventListener('pointerdown', unlock, { once: false });
    window.addEventListener('keydown', unlock, { once: false });
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  }, [synth]);

  useEffect(() => {
    synth.enabled = settings.sound;
    if (settings.sound && settings.music && playing) music.start(); else music.stop();
    return () => music.stop();
  }, [synth, music, settings.sound, settings.music, playing]);

  const play = useCallback((kind) => playEvent(synth, kind), [synth]);
  const buzz = useCallback((ms) => {
    if (settings.vibrate && navigator.vibrate) navigator.vibrate(ms);
  }, [settings.vibrate]);
  return { play, buzz };
}
