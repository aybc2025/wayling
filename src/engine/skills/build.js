import { BRICK_TICKS, STOW_TICKS, ST } from '../../config/constants.js';
import { clear, grounded, startFall } from '../motion.js';
import { MAT } from '../../config/constants.js';

/** One brick every BRICK_TICKS: lay, rise 1px, advance 2px. 12 bricks per assignment. */
export function buildStep(c, T, emit) {
  c.t++;
  const t = c.t;
  if (t === 4) {
    if (!clear(T, c.x + 2 * c.dir, c.y - 1)) { c.dir = -c.dir; c.state = ST.WALK; return; }
    const a = c.x + c.dir, b = c.x + 4 * c.dir;
    T.fillAir(Math.min(a, b), Math.max(a, b), c.y, MAT.DIRT);
    emit('brick', c.x, c.y);
  } else if (t === 6) {
    c.y -= 1;
  } else if (t === 8 || t === BRICK_TICKS) {
    c.x += c.dir;
  }
  if (t >= BRICK_TICKS) {
    c.t = 0;
    c.steps -= 1;
    if (c.steps <= 0) c.state = ST.STOW;
  }
}

/** Grace period after the last brick: the walker packs the bricks away, then walks on.
 *  Assigning the builder again during this window resumes building. */
export function stowStep(c, T) {
  if (!grounded(T, c)) { startFall(c); return; }
  c.t++;
  if (c.t >= STOW_TICKS) { c.t = 0; c.state = ST.WALK; }
}
