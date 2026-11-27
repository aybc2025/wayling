import { ST, EXIT_TICKS, DEATH_TICKS } from '../config/constants.js';
import { COLORS as C, SCARF, DEFAULT_SCARF } from './palette.js';

const r = (ctx, x, y, w, h) => ctx.fillRect(x, y, w, h);

const SKILL_FOR_STATE = {
  [ST.CLIMB]: 'climber', [ST.BLOCK]: 'blocker', [ST.BUILD]: 'builder', [ST.STOW]: 'builder',
  [ST.BASH]: 'basher', [ST.MINE]: 'miner', [ST.DIG]: 'digger'
};

export function scarfFor(c, tick) {
  if (c.fuse > 0 && (tick >> 2) & 1) return SCARF.bomber;
  const s = SKILL_FOR_STATE[c.state];
  if (s) return SCARF[s];
  if (c.fuse > 0) return SCARF.bomber;
  if (c.floater && c.climber) return SCARF.floater;
  if (c.floater) return SCARF.floater;
  if (c.climber) return SCARF.climber;
  return DEFAULT_SCARF;
}

function umbrella(ctx) {
  ctx.fillStyle = C.tarn;
  r(ctx, -5, -16, 11, 1); r(ctx, -4, -17, 9, 1); r(ctx, -3, -18, 7, 1);
  ctx.fillStyle = C.ridge;
  r(ctx, 0, -15, 1, 6);
}

/** Procedural critter, 6x10 px, feet at (c.x, c.y). One body, poses by state. */
export function drawCreature(ctx, c, tick) {
  ctx.save();
  ctx.translate(c.x, c.y);
  if (c.dir < 0) ctx.scale(-1, 1);
  const f = (c.age >> 2) & 1;
  const st = c.state;
  let oy = 0;
  if (st === ST.EXIT) ctx.globalAlpha = 1 - c.t / EXIT_TICKS;
  if (st === ST.DROWN) { ctx.globalAlpha = 1 - c.t / DEATH_TICKS; oy = c.t * 0.35; }
  if (st === ST.BURN) ctx.globalAlpha = 1 - c.t / DEATH_TICKS;
  if (st === ST.SPLAT || st === ST.TRAPPED) {
    ctx.globalAlpha = 1 - Math.max(0, c.t - 10) / (DEATH_TICKS - 10);
    ctx.fillStyle = C.bone; r(ctx, -4, -2, 9, 2);
    ctx.fillStyle = scarfFor(c, tick); r(ctx, -4, -3, 3, 1);
    ctx.restore();
    return;
  }
  ctx.translate(0, oy);
  if (c.floating) umbrella(ctx);
  // legs
  ctx.fillStyle = C.ridge;
  if (st === ST.FALL) { r(ctx, -1, -2, 3, 2); }
  else if (st === ST.WALK || st === ST.CLIMB) { r(ctx, -2 + f, -2, 2, 2); r(ctx, 1 - f, -2, 2, 2); }
  else { r(ctx, -2, -2, 2, 2); r(ctx, 1, -2, 2, 2); }
  // torso and head
  ctx.fillStyle = st === ST.BURN ? C.ember : C.bone;
  r(ctx, -2, -7, 5, 5);
  r(ctx, -2, -10, 5, 4);
  ctx.fillStyle = C.peat;
  r(ctx, 1, -9, 1, 1);
  // scarf
  ctx.fillStyle = scarfFor(c, tick);
  r(ctx, -3, -6, 7, 1);
  r(ctx, -3, -5, 2, 2);
  // arms and tools
  ctx.fillStyle = C.bone;
  switch (st) {
    case ST.FALL: r(ctx, -4, -9, 1, 3); r(ctx, 4, -9, 1, 3); break;
    case ST.CLIMB: r(ctx, 3, -11 + f, 2, 2); r(ctx, 3, -6 - f, 2, 1); break;
    case ST.BLOCK: r(ctx, -5, -5, 11, 1); break;
    case ST.BUILD: r(ctx, 3, -5, 2, 1); ctx.fillStyle = SCARF.builder; r(ctx, 3, -4, 3, 1); break;
    case ST.STOW: { const k = Math.min(2, c.t >> 2); r(ctx, 3 - k, -5 + k, 2, 1); ctx.fillStyle = SCARF.builder; r(ctx, 2 - k, -4 + k, 3 - k, 1); break; }
    case ST.BASH: r(ctx, 3, -6, 3 + f, 1); ctx.fillStyle = C.chalk; r(ctx, 6 + f, -7, 1, 3); break;
    case ST.MINE: r(ctx, 3, -5, 2, 1); ctx.fillStyle = C.chalk; r(ctx, 5, -6 + f, 1, 3); break;
    case ST.DIG: r(ctx, -3, -3, 1, 2); r(ctx, 3, -3, 1, 2); ctx.fillStyle = C.chalk; r(ctx, -1, 0, 3, 1); break;
    default: break;
  }
  ctx.restore();
}

export function drawFuse(ctx, c) {
  if (c.fuse <= 0) return;
  ctx.fillStyle = C.ember;
  ctx.font = '8px Silkscreen, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.ceil(c.fuse / 30)), c.x, c.y - 13);
}
