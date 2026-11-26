import { BASH_TICKS, MAT, ST } from '../../config/constants.js';
import { grounded, startFall } from '../motion.js';

function stopsBasher(m, dir) {
  return m === MAT.STEEL || (m === MAT.OWL && dir > 0) || (m === MAT.OWR && dir < 0);
}

/** Tunnels horizontally; stops at steel, at the wrong one-way direction, or when nothing is left to bash. */
export function bashStep(c, T, emit) {
  if (!grounded(T, c)) { startFall(c); return; }
  c.t++;
  if (c.t < BASH_TICKS) return;
  c.t = 0;
  const x0 = c.x + c.dir, x1 = c.x + 3 * c.dir;
  let solid = 0, blocked = false;
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
    for (let y = c.y - 9; y <= c.y; y++) {
      const m = T.get(x, y);
      if (m === MAT.AIR) continue;
      if (stopsBasher(m, c.dir)) blocked = true; else solid++;
    }
  }
  if (blocked) { emit('clink', c.x, c.y - 4); c.dir = -c.dir; c.state = ST.WALK; return; }
  if (solid === 0) {
    c.empty += 1;
    if (c.empty >= 2) { c.empty = 0; c.state = ST.WALK; return; }
  } else {
    c.empty = 0;
    emit('bash', c.x + c.dir * 2, c.y - 4);
  }
  T.carveBox(Math.min(x0, x1), c.y - 9, Math.max(x0, x1), c.y);
  c.x += c.dir;
}
