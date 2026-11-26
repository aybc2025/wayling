import { rect } from '../dsl.js';

export default {
  id: 'tri-02', rating: 'tricky',
  name: { he: 'טיפוס', en: 'Climb' },
  size: [560, 128], count: 12, need: 6, minRate: 50, time: 220,
  hatch: { x: 40, y: 50 }, door: { x: 520, y: 99 },
  stock: { climber: 12 },
  terrain: [rect(0, 100, 560, 28), rect(250, 44, 30, 56)]
};
