import { useEffect, useRef } from 'react';
import { TICK_HZ } from '../config/constants.js';

const TICK_MS = 1000 / TICK_HZ;

/**
 * Fixed-step loop. Speed multiplies simulated time; pause skips ticks but keeps drawing.
 * Everything per-frame is mutated in place: no allocations in the hot path beyond event arrays.
 */
export function useGameLoop({ sim, renderer, camera, store, control, onEvents }) {
  const cb = useRef(onEvents);
  cb.current = onEvents;
  useEffect(() => {
    if (!renderer) return undefined;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const frame = (now) => {
      const dt = Math.min(100, now - last);
      last = now;
      if (!control.paused && sim.status === 'run') {
        acc += dt * control.speed;
        let n = 0;
        while (acc >= TICK_MS && n < 16 && sim.status === 'run') { sim.tick(); acc -= TICK_MS; n++; }
        if (n === 16) acc = 0;
      }
      if (control.pan) camera.panLogical(control.pan * dt * 0.12);
      const events = renderer.drainEvents();
      if (events.length) cb.current(events);
      renderer.draw(now);
      store.refresh(now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [sim, renderer, camera, store, control]);
}
