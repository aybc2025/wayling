import { rect } from '../dsl.js';

export default {
  id: 'tri-01', rating: 'tricky',
  name: { he: 'הדרך חסומה', en: 'Blocked road' },
  size: [560, 128], count: 20, need: 12, minRate: 50, time: 220,
  hatch: { x: 40, y: 50 }, door: { x: 500, y: 99 },
  stock: { basher: 2, blocker: 1 },
  terrain: [rect(0, 100, 560, 28), rect(250, 0, 36, 100)]
};
