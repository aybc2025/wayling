import { SKILLS } from './constants.js';

export { SKILLS };
export const SKILL_KEYS = Object.fromEntries(SKILLS.map((s, i) => [String(i + 1), s]));
export const SKILL_COLOR = {
  climber: '#65bdff', floater: '#00d2e5', bomber: '#ff8e86', blocker: '#fe8dc5',
  builder: '#d6b529', basher: '#ff9b50', miner: '#ce9dff', digger: '#75d079'
};
