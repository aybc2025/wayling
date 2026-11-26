import { CH, MAX_STEP, MAX_DROP, FATAL_FALL, FLOAT_AFTER, ST } from '../config/constants.js';

/** Could a creature stand with its feet at (x, y)? Feet cell and head cells must be air. */
export function clear(T, x, y) {
  for (let k = 0; k < CH; k++) if (T.solid(x, y - k)) return false;
  return true;
}

export function grounded(T, c) {
  return T.solid(c.x, c.y + 1);
}

export function startFall(c) {
  c.state = ST.FALL;
  c.fall = 0;
  c.t = 0;
}

/** Walkers turn around when they reach the arms of a blocker standing in their way. */
function hitsBlocker(c, nx, blockers) {
  for (const b of blockers) {
    if (b.id === c.id || Math.abs(b.y - c.y) > 8) continue;
    if ((b.x - c.x) * c.dir > 0 && Math.abs(nx - b.x) <= 3) return true;
  }
  return false;
}

export function walkStep(c, T, blockers) {
  if (!grounded(T, c)) { startFall(c); return; }
  const nx = c.x + c.dir;
  if (hitsBlocker(c, nx, blockers)) { c.dir = -c.dir; return; }
  let yy = null;
  for (let up = 0; up <= MAX_STEP; up++) {
    if (clear(T, nx, c.y - up)) { yy = c.y - up; break; }
  }
  if (yy === null) {
    if (c.climber && T.solid(nx, c.y - 5)) { c.state = ST.CLIMB; c.t = 0; return; }
    c.dir = -c.dir;
    return;
  }
  if (yy < c.y) { c.x = nx; c.y = yy; return; }
  for (let d = 0; d <= MAX_DROP; d++) {
    if (T.solid(nx, yy + d + 1)) { c.x = nx; c.y = yy + d; return; }
  }
  c.x = nx;
  startFall(c);
}

export function climbStep(c, T) {
  c.t++;
  if (c.t % 2) return;
  const nx = c.x + c.dir;
  if (!T.solid(nx, c.y - 5)) {
    for (let up = 0; up <= MAX_STEP; up++) {
      if (clear(T, nx, c.y - up) && T.solid(nx, c.y - up + 1)) { c.x = nx; c.y -= up; c.state = ST.WALK; return; }
    }
  }
  if (T.solid(c.x, c.y - CH)) { c.dir = -c.dir; startFall(c); return; }
  c.y -= 1;
}

/** Returns 'splat' when the creature hits the ground too hard, 'void' off the bottom. */
export function fallStep(c, T) {
  const floating = c.floater && c.fall >= FLOAT_AFTER;
  c.floating = floating;
  const px = floating ? 1 : 2;
  for (let i = 0; i < px; i++) {
    if (T.solid(c.x, c.y + 1)) {
      const hard = c.fall > FATAL_FALL && !c.floater;
      c.fall = 0;
      c.floating = false;
      if (hard) return 'splat';
      c.state = ST.WALK;
      return null;
    }
    c.y++;
    c.fall++;
    if (c.y >= T.h) return 'void';
  }
  return null;
}
