import { MAT, MINE_TICKS, ST } from '../../config/constants.js';
import { grounded, startFall } from '../motion.js';

/** Tunnels diagonally down at 45 degrees. Stops at steel or on breaking into open air. */
export function mineStep(c, T, emit) {
  if (!grounded(T, c)) { startFall(c); return; }
  c.t++;
  if (c.t < MINE_TICKS) return;
  c.t = 0;
  const x0 = c.x + c.dir, x1 = c.x + 3 * c.dir;
  let solid = 0, blocked = false;
  for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
    for (let y = c.y - 9; y <= c.y + 1; y++) {
      const m = T.get(x, y);
      if (m === MAT.AIR) continue;
      if (m === MAT.STEEL) blocked = true; else solid++;
    }
  }
  if (blocked) { emit('clink', c.x, c.y); c.dir = -c.dir; c.state = ST.WALK; return; }
  if (solid === 0) { c.state = ST.WALK; return; }
  emit('bash', c.x + c.dir * 2, c.y);
  T.carveBox(Math.min(x0, x1), c.y - 9, Math.max(x0, x1), c.y + 1);
  c.x += c.dir;
  c.y += 1;
}
