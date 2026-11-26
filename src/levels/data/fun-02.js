import { rect } from '../dsl.js';

export default {
  id: 'fun-02', rating: 'fun',
  name: { he: 'צריך גשר', en: 'Needs a bridge' },
  size: [480, 128], count: 20, need: 12, minRate: 50, time: 180,
  hatch: { x: 30, y: 20 }, door: { x: 440, y: 69 },
  stock: { builder: 2 },
  terrain: [rect(0, 70, 200, 58), rect(224, 70, 256, 58)]
};
