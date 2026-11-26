import { useCallback } from 'react';
import { KEYS } from '../config/storageKeys.js';
import { LEVELS } from '../levels/index.js';
import { useStored } from './useStored.js';

const DEFAULTS = { v: 1, levels: {} };
const valid = (r) => r.v === 1 && r.levels && typeof r.levels === 'object';

export function useProgress() {
  const [progress, setProgress] = useStored(KEYS.progress, DEFAULTS, valid);

  const isDone = (id) => !!progress.levels[id]?.done;
  const best = (id) => progress.levels[id]?.best ?? 0;
  const unlocked = (index) => index === 0 || isDone(LEVELS[index - 1].id);
  const doneCount = LEVELS.filter((l) => isDone(l.id)).length;

  const record = useCallback((id, percent, won) => {
    setProgress((p) => {
      const prev = p.levels[id] || { best: 0, done: false };
      return { ...p, levels: { ...p.levels, [id]: { best: Math.max(prev.best, percent), done: prev.done || won } } };
    });
  }, [setProgress]);

  return { progress, isDone, best, unlocked, doneCount, record };
}
