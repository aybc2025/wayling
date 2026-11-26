import { rect } from '../dsl.js';

export default {
  id: 'tax-04', rating: 'taxing',
  name: { he: 'טיפוס וצניחה', en: 'Climb and float' },
  size: [600, 128], count: 10, need: 6, minRate: 50, time: 300,
  hatch: { x: 30, y: 60 }, door: { x: 560, y: 117 },
  stock: { climber: 6, floater: 6 },
  terrain: [rect(0, 100, 160, 28), rect(160, 50, 40, 78), rect(200, 118, 400, 10)]
};
