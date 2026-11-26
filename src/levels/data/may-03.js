import { rect, air, trap } from '../dsl.js';

export default {
  id: 'may-03', rating: 'mayhem',
  name: { he: 'עוקפים מלכודת', en: 'Around the trap' },
  size: [640, 128], count: 20, need: 12, minRate: 50, time: 360,
  hatch: { x: 30, y: 10 }, door: { x: 600, y: 109 },
  stock: { miner: 1, blocker: 1 },
  terrain: [rect(0, 50, 640, 78), air(372, 90, 250, 20)],
  hazards: [trap(420, 40, 16, 10)]
};
