import { DEATH_TICKS, ST } from '../config/constants.js';

const inside = (h, c) => c.x >= h.x && c.x < h.x + h.w && c.y >= h.y && c.y < h.y + h.h;

export function makeHazards(defs) {
  return defs.map((h) => ({ ...h, cool: 0 }));
}

/** Apply hazards to one creature. Returns the death state or null. */
export function hazardFor(c, hazards) {
  for (const h of hazards) {
    if (!inside(h, c)) continue;
    if (h.kind === 'water') return ST.DROWN;
    if (h.kind === 'lava') return ST.BURN;
    if (h.kind === 'trap' && h.cool > 40) return ST.TRAPPED;
  }
  return null;
}

/** Traps arm when a creature enters, crush for 20 ticks, then reset. */
export function updateTraps(hazards, creatures, emit) {
  for (const h of hazards) {
    if (h.kind !== 'trap') continue;
    if (h.cool > 0) { h.cool--; continue; }
    for (const c of creatures) {
      if (!c.gone && c.state !== ST.EXIT && inside(h, c)) { h.cool = 60; emit('trap', h.x + h.w / 2, h.y); break; }
    }
  }
}

export const DEATH_LENGTH = DEATH_TICKS;
