import { rect } from '../dsl.js';

export default {
  id: 'fun-01', rating: 'fun',
  name: { he: 'הליכה קלה', en: 'Easy walk' },
  size: [480, 128], count: 20, need: 10, minRate: 50, time: 150,
  hatch: { x: 30, y: 50 }, door: { x: 440, y: 99 },
  stock: { climber: 14 },
  terrain: [rect(0, 100, 480, 28), rect(240, 72, 16, 28)]
};
