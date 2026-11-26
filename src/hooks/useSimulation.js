import { useMemo, useSyncExternalStore } from 'react';
import { Sim } from '../engine/Sim.js';
import { Camera } from '../render/camera.js';

/** Throttled snapshot of the sim for React. The sim itself never lives in React state. */
class SnapshotStore {
  constructor(sim) {
    this.sim = sim;
    this.listeners = new Set();
    this.snap = this.read();
    this.key = JSON.stringify(this.snap);
    this.last = 0;
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  read() {
    const s = this.sim;
    return {
      out: s.out, saved: s.saved, percent: s.percent, need: s.need, count: s.count, spawned: s.spawned,
      timeLeft: s.timeLeft, rate: s.rate, minRate: s.def.minRate, stock: { ...s.stock },
      status: s.status, nuked: s.nuked
    };
  }

  /** Called every frame; notifies at most every 100ms, or at once when the status changes. */
  refresh(now) {
    if (now - this.last < 100 && this.sim.status === this.snap.status) return;
    this.last = now;
    const next = this.read();
    const key = JSON.stringify(next);
    if (key === this.key) return;
    this.key = key;
    this.snap = next;
    this.listeners.forEach((l) => l());
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getSnapshot() {
    return this.snap;
  }
}

export function useSimulation(level, runKey) {
  const session = useMemo(() => {
    const sim = new Sim(level, { trackDirty: true });
    const camera = new Camera();
    camera.setLevel(level.size[0], level.size[1], level.hatch.x + 60);
    return { sim, camera, store: new SnapshotStore(sim) };
  }, [level, runKey]);
  const snap = useSyncExternalStore(session.store.subscribe, session.store.getSnapshot);
  return { ...session, snap };
}
