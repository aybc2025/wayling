import { describe, it, expect } from 'vitest';
import { Sim } from '../src/engine/Sim.js';
import { rect, steel, owl, owr } from '../src/levels/dsl.js';
import { MAT } from '../src/config/constants.js';

const mk = (over = {}) => ({
  id: 't', rating: 'fun', name: { he: 'ט', en: 't' },
  size: [300, 128], count: 5, need: 1, minRate: 50, time: 120,
  hatch: { x: 20, y: 90 }, door: { x: 280, y: 99 }, stock: {},
  terrain: [rect(0, 100, 300, 28)], ...over
});

function spawnOne(def, skills = {}) {
  const sim = new Sim({ ...def, stock: { climber: 9, floater: 9, bomber: 9, blocker: 9, builder: 9, basher: 9, miner: 9, digger: 9, ...skills } });
  while (sim.creatures.length === 0) sim.tick();
  return sim;
}
const run = (sim, n) => { for (let i = 0; i < n; i++) sim.tick(); };

describe('creature rules', () => {
  it('walks right and turns at a wall', () => {
    const sim = spawnOne(mk({ terrain: [rect(0, 100, 300, 28), rect(100, 0, 10, 100)] }));
    run(sim, 110);
    const c = sim.creatures[0];
    expect(c.dir).toBe(-1);
    expect(c.x).toBeLessThan(100);
  });

  it('steps up 5px but not 6px', () => {
    const a = spawnOne(mk({ terrain: [rect(0, 100, 300, 28), rect(100, 95, 200, 5)], hatch: { x: 20, y: 99 }, door: { x: 290, y: 94 } }));
    run(a, 150);
    expect(a.creatures[0].x).toBeGreaterThan(105);
    const b = spawnOne(mk({ terrain: [rect(0, 100, 300, 28), rect(100, 94, 200, 6)], hatch: { x: 20, y: 99 } }));
    run(b, 150);
    expect(b.creatures[0].x).toBeLessThan(100);
  });

  it('dies from a long fall, survives with a floater', () => {
    const def = mk({ terrain: [rect(0, 110, 300, 18)], hatch: { x: 20, y: 5 } });
    const a = spawnOne(def);
    run(a, 120);
    expect(a.creatures[0].gone).toBe(true);
    expect(a.creatures[0].state).toBe('splat');
    const b = spawnOne(def);
    b.apply({ type: 'skill', id: 0, skill: 'floater' });
    run(b, 200);
    expect(b.creatures[0].state).toBe('walk');
  });

  it('digger breaks through and stops at steel', () => {
    const def = mk({ terrain: [rect(0, 100, 300, 28), steel(0, 115, 300, 4)] });
    const sim = spawnOne(def);
    run(sim, 60);
    sim.apply({ type: 'skill', id: 0, skill: 'digger' });
    run(sim, 200);
    expect(sim.creatures[0].state).not.toBe('dig');
    expect(sim.terrain.get(sim.creatures[0].x, 115)).toBe(MAT.STEEL);
  });

  it('basher stops at a wrong-way one-way wall and passes the right way', () => {
    const wall = (m) => mk({ terrain: [rect(0, 100, 300, 28), m(120, 0, 20, 100)] });
    for (const [m, passes] of [[owr, true], [owl, false]]) {
      const sim = spawnOne(wall(m));
      while (sim.creatures[0].x < 116) sim.tick();
      sim.apply({ type: 'skill', id: 0, skill: 'basher' });
      run(sim, 160);
      expect(sim.terrain.get(130, 95) === MAT.AIR).toBe(passes);
    }
  });

  it('blocker turns others around', () => {
    const sim = new Sim({ ...mk(), stock: { blocker: 1 } });
    while (sim.creatures.length === 0) sim.tick();
    while (sim.creatures[0].x < 150) sim.tick();
    sim.apply({ type: 'skill', id: 0, skill: 'blocker' });
    while (sim.creatures.length < 2) sim.tick();
    run(sim, 400);
    expect(sim.creatures[1].dir).toBe(-1);
  });

  it('bomber explodes after 5 seconds and leaves steel alone', () => {
    const sim = spawnOne(mk({ terrain: [rect(0, 100, 300, 28), steel(0, 120, 300, 8)] }));
    run(sim, 60);
    sim.apply({ type: 'skill', id: 0, skill: 'bomber' });
    run(sim, 151);
    expect(sim.dead).toBe(1);
    const ev = sim.events.filter((e) => e.kind === 'explode').pop();
    expect(sim.terrain.get(ev.x, 102)).toBe(MAT.AIR);
    expect(sim.terrain.get(ev.x, 125)).toBe(MAT.STEEL);
  });

  it('refuses skills with no stock and repeated permanent skills', () => {
    const sim = new Sim({ ...mk(), stock: { climber: 1 } });
    while (sim.creatures.length === 0) sim.tick();
    expect(sim.apply({ type: 'skill', id: 0, skill: 'digger' })).toBe(false);
    expect(sim.apply({ type: 'skill', id: 0, skill: 'climber' })).toBe(true);
    expect(sim.apply({ type: 'skill', id: 0, skill: 'climber' })).toBe(false);
  });

  it('release rate respects the level minimum and the cap', () => {
    const sim = new Sim(mk({ minRate: 30 }));
    sim.apply({ type: 'rate', value: 5 });
    expect(sim.rate).toBe(30);
    sim.apply({ type: 'rate', value: 500 });
    expect(sim.rate).toBe(99);
  });

  it('nuke blows everyone up and ends the level', () => {
    const sim = spawnOne(mk());
    sim.apply({ type: 'nuke' });
    run(sim, 200);
    expect(sim.status).toBe('lost');
  });
});
