// One recorded solution per level. Entries fire when their creature reaches the
// condition; see engine/script.js. CI runs every one and fails if a level is not won.
const give = (skill, n) => Array.from({ length: n }, (_, i) => ({ id: i, skill }));
const at = (id, skill, x, state = 'walk') => ({ id, skill, at: { x, state } });

export const SOLUTIONS = {
  'fun-01': give('climber', 20),
  'fun-02': [at(0, 'builder', 198)],
  'fun-03': [at(0, 'digger', 300)],
  'fun-04': give('floater', 16),
  'tri-01': [at(0, 'basher', 247)],
  'tri-02': give('climber', 12),
  'tri-03': [at(0, 'miner', 270)],
  'tri-04': [at(0, 'blocker', 388)],
  'tax-01': [...give('floater', 16), at(0, 'digger', 300)],
  'tax-02': [at(0, 'builder', 198), at(0, 'builder', 222, 'stow'), at(0, 'builder', 246, 'stow'), at(0, 'builder', 270, 'stow')],
  'tax-03': [at(0, 'basher', 147), at(0, 'builder', 298), at(0, 'builder', 322)],
  'tax-04': [...give('climber', 10), ...give('floater', 10)],
  'may-01': [...give('floater', 20), at(0, 'builder', 158), at(0, 'basher', 296)],
  'may-02': [...give('floater', 20), at(0, 'digger', 196), at(0, 'builder', 298)],
  'may-03': [at(0, 'miner', 330)],
  'may-04': [...give('floater', 24), at(0, 'builder', 218), at(0, 'builder', 242, 'stow'), at(0, 'builder', 266, 'stow'), at(0, 'basher', 336)]
};
