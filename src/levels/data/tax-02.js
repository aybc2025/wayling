import { rect, lava } from '../dsl.js';

export default {
  id: 'tax-02', rating: 'taxing',
  name: { he: 'נהר לבה', en: 'Lava river' },
  size: [600, 128], count: 20, need: 10, minRate: 1, time: 360,
  hatch: { x: 30, y: 20 }, door: { x: 560, y: 69 },
  stock: { builder: 5 },
  terrain: [rect(0, 70, 200, 58), rect(290, 70, 310, 58)],
  hazards: [lava(200, 104, 90, 24)]
};
