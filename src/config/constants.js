// Simulation constants. Changing any of these changes level balance and
// invalidates the recorded level solutions (npm test will tell you).
export const TICK_HZ = 30;

export const CH = 10;            // creature height in pixels (head clearance rows)
export const MAX_STEP = 5;       // tallest step a walker climbs
export const MAX_DROP = 6;       // drop a walker walks down without falling
export const FATAL_FALL = 60;    // fall distance that kills a non-floater
export const FLOAT_AFTER = 8;    // fall distance after which a floater opens up

export const FUSE_TICKS = 5 * TICK_HZ;
export const EXIT_TICKS = 14;
export const HATCH_OPEN_TICKS = 45;
export const BRICK_TICKS = 10;
export const BRICKS = 12;
export const BASH_TICKS = 3;
export const MINE_TICKS = 8;
export const DIG_TICKS = 6;
export const CRATER_R = 12;
export const DEATH_TICKS = 22;

export const MAT = { AIR: 0, DIRT: 1, STEEL: 2, OWL: 3, OWR: 4 };
export const MAT_BY_NAME = { air: 0, dirt: 1, steel: 2, owl: 3, owr: 4 };

export const SKILLS = ['climber', 'floater', 'bomber', 'blocker', 'builder', 'basher', 'miner', 'digger'];

export const ST = {
  FALL: 'fall', WALK: 'walk', CLIMB: 'climb', BLOCK: 'block', BUILD: 'build',
  BASH: 'bash', MINE: 'mine', DIG: 'dig', EXIT: 'exit',
  SPLAT: 'splat', DROWN: 'drown', BURN: 'burn', TRAPPED: 'trapped', BOMBED: 'bombed'
};

export const DYING = [ST.SPLAT, ST.DROWN, ST.BURN, ST.TRAPPED, ST.BOMBED, ST.EXIT];

export function spawnInterval(rate) {
  return 8 + Math.round((99 - rate) * 1.5);
}
