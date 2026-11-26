import { rect } from '../dsl.js';

export default {
  id: 'fun-04', rating: 'fun',
  name: { he: 'מצנחים', en: 'Parachutes' },
  size: [480, 128], count: 16, need: 10, minRate: 50, time: 200,
  hatch: { x: 30, y: 10 }, door: { x: 440, y: 117 },
  stock: { floater: 12 },
  terrain: [rect(0, 30, 200, 98), rect(200, 118, 280, 10)]
};
