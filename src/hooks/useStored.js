import { useCallback, useState } from 'react';

/** localStorage-backed state. Reads are try/catch + validated; bad data falls back to defaults. */
export function useStored(key, defaults, validate) {
  const [value, setValue] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return raw && validate(raw) ? { ...defaults, ...raw } : defaults;
    } catch {
      return defaults;
    }
  });
  const update = useCallback((patch) => {
    setValue((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, [key]);
  return [value, update];
}
