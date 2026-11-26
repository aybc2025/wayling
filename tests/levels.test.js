import { describe, it, expect } from 'vitest';
import { LEVELS } from '../src/levels/index.js';
import { SOLUTIONS } from '../src/levels/solutions/index.js';
import { runScript } from '../src/engine/script.js';

describe('levels', () => {
  it('ships 16 levels, 4 per rating, each with a solution', () => {
    expect(LEVELS).toHaveLength(16);
    for (const r of ['fun', 'tricky', 'taxing', 'mayhem']) expect(LEVELS.filter((l) => l.rating === r)).toHaveLength(4);
    for (const l of LEVELS) expect(SOLUTIONS[l.id], l.id).toBeDefined();
  });

  it('has unique ids and Hebrew + English names', () => {
    expect(new Set(LEVELS.map((l) => l.id)).size).toBe(LEVELS.length);
    for (const l of LEVELS) { expect(l.name.he).toBeTruthy(); expect(l.name.en).toBeTruthy(); }
  });

  for (const level of LEVELS) {
    it(`${level.id} is solvable by its recorded solution`, () => {
      const r = runScript(level, SOLUTIONS[level.id]);
      expect(r.unfired.map((u) => u.id)).toEqual([]);
      expect(r.status).toBe('won');
      expect(r.saved).toBeGreaterThanOrEqual(level.need);
      // 100% must be reachable. tri-04 is the exception: its blocker has to stay behind.
      expect(r.saved).toBe(level.id === 'tri-04' ? level.count - 1 : level.count);
    });

    it(`${level.id} is not won by doing nothing`, () => {
      const r = runScript(level, []);
      expect(r.status).toBe('lost');
    });
  }
});
