import { canAssign } from './Creature.js';

/**
 * Pick the creature nearest to a point that can take the skill.
 * Positions are logical pixels; the creature centre is 5px above its feet.
 */
export function pickCreature(creatures, x, y, skill, radius) {
  let best = null;
  let bestD = radius * radius;
  for (const c of creatures) {
    if (c.gone || (skill && !canAssign(c, skill))) continue;
    const dx = c.x - x, dy = c.y - 5 - y;
    const d = dx * dx + dy * dy;
    if (d <= bestD) { bestD = d; best = c; }
  }
  return best;
}
