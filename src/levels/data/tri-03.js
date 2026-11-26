import { rect, air, steel } from '../dsl.js';

export default {
  id: 'tri-03', rating: 'tricky',
  name: { he: 'כרייה', en: 'Mine it' },
  size: [560, 128], count: 20, need: 12, minRate: 50, time: 240,
  hatch: { x: 40, y: 10 }, door: { x: 480, y: 109 },
  stock: { miner: 1 },
  terrain: [rect(0, 40, 560, 88), steel(330, 0, 12, 40), air(330, 60, 200, 50)]
};
