import { BRICKS, FUSE_TICKS, ST, DYING } from '../config/constants.js';

export function makeCreature(id, x, y) {
  return {
    id, x, y, dir: 1, state: ST.FALL,
    climber: false, floater: false, floating: false,
    fuse: -1, fall: 0, t: 0, steps: 0, empty: 0, gone: false, age: 0
  };
}

export function isActive(c) {
  return !c.gone;
}

export function isDying(c) {
  return DYING.includes(c.state);
}

/** Can this creature accept the skill right now (ignoring stock)? */
export function canAssign(c, skill) {
  if (c.gone || isDying(c)) return false;
  switch (skill) {
    case 'climber': return !c.climber;
    case 'floater': return !c.floater;
    case 'bomber': return c.fuse < 0;
    default: return c.state === ST.WALK;
  }
}

const STATE_FOR = {
  blocker: ST.BLOCK, builder: ST.BUILD, basher: ST.BASH, miner: ST.MINE, digger: ST.DIG
};

export function applySkill(c, skill) {
  if (skill === 'climber') c.climber = true;
  else if (skill === 'floater') c.floater = true;
  else if (skill === 'bomber') c.fuse = FUSE_TICKS;
  else {
    c.state = STATE_FOR[skill];
    c.t = 0;
    c.empty = 0;
    if (skill === 'builder') c.steps = BRICKS;
  }
}
