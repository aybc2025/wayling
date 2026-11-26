import { Sim } from './Sim.js';

/**
 * Runs a level headless with a condition-based solution script.
 * Each entry: { id, skill, at?: {x, op?, state?}, tick? }.
 * An entry fires once its creature exists and the condition holds; it
 * retries every tick until the sim accepts it.
 */
export function runScript(def, script, { maxTicks, rate } = {}) {
  const sim = new Sim(def);
  const pending = script.map((s) => ({ ...s, done: false }));
  const limit = maxTicks || def.time * 30 + 5;
  const trace = [];
  while (sim.status === 'run' && sim.t < limit) {
    for (const s of pending) {
      if (s.done) continue;
      if (s.tick !== undefined && sim.t < s.tick) continue;
      if (s.type === 'nuke') { sim.apply({ type: 'nuke' }); s.done = true; continue; }
      if (s.type === 'rate') { sim.apply({ type: 'rate', value: s.value }); s.done = true; continue; }
      const c = sim.creatures[s.id];
      if (!c || c.gone) continue;
      const a = s.at;
      if (a) {
        if (a.state && c.state !== a.state) continue;
        if (a.x !== undefined) {
          const op = a.op || 'ge';
          if (op === 'ge' && !(c.x >= a.x)) continue;
          if (op === 'le' && !(c.x <= a.x)) continue;
          if (op === 'eq' && c.x !== a.x) continue;
        }
        if (a.y !== undefined && !(c.y >= a.y)) continue;
      }
      if (sim.apply({ type: 'skill', id: s.id, skill: s.skill })) s.done = true;
    }
    sim.tick();
    if (trace.length < 2000 && sim.creatures[0]) trace.push([sim.t, sim.creatures[0].x, sim.creatures[0].y, sim.creatures[0].state]);
  }
  return { sim, status: sim.status, saved: sim.saved, trace, unfired: pending.filter((p) => !p.done) };
}
