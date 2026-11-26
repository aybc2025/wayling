import { describe, it, expect } from 'vitest';
import { LEVELS } from '../src/levels/index.js';
import { SOLUTIONS } from '../src/levels/solutions/index.js';
import { runScript } from '../src/engine/script.js';

const snap = (sim) => JSON.stringify([sim.t, sim.saved, sim.dead, sim.creatures.map((c) => [c.x, c.y, c.state, c.fuse]), Array.from(sim.terrain.data.slice(0, 5000))]);

describe('determinism', () => {
  it('gives identical results for identical input', () => {
    for (const id of ['tax-02', 'may-04']) {
      const level = LEVELS.find((l) => l.id === id);
      const a = runScript(level, SOLUTIONS[id]);
      const b = runScript(level, SOLUTIONS[id]);
      expect(snap(a.sim)).toBe(snap(b.sim));
    }
  });
});
