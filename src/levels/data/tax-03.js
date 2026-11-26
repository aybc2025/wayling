import { rect, air, owr, water } from '../dsl.js';

export default {
  id: 'tax-03', rating: 'taxing',
  name: { he: 'חץ אחד', en: 'One way' },
  size: [640, 128], count: 20, need: 12, minRate: 20, time: 300,
  hatch: { x: 40, y: 50 }, door: { x: 600, y: 99 },
  stock: { basher: 1, builder: 3 },
  terrain: [rect(0, 100, 640, 28), owr(150, 0, 30, 100), air(300, 100, 40, 28)],
  hazards: [water(300, 104, 40, 24)]
};
