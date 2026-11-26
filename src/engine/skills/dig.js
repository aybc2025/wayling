import { DIG_TICKS, MAT, ST } from '../../config/constants.js';
import { grounded, startFall } from '../motion.js';

/** Digs straight down, 7 wide. Stops at steel; falls on breaking through. */
export function digStep(c, T, emit) {
  if (!grounded(T, c)) { startFall(c); return; }
  c.t++;
  if (c.t < DIG_TICKS) return;
  c.t = 0;
  const row = c.y + 1;
  for (let x = c.x - 3; x <= c.x + 3; x++) {
    if (T.get(x, row) === MAT.STEEL) { emit('clink', c.x, c.y); c.state = ST.WALK; return; }
  }
  emit('bash', c.x, c.y + 1);
  T.carveBox(c.x - 3, row, c.x + 3, row);
  c.y += 1;
  if (!grounded(T, c)) startFall(c);
}
