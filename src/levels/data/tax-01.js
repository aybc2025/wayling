import { rect, air } from '../dsl.js';

export default {
  id: 'tax-01', rating: 'taxing',
  name: { he: 'בור עמוק', en: 'Deep shaft' },
  size: [560, 128], count: 16, need: 10, minRate: 50, time: 240,
  hatch: { x: 30, y: 10 }, door: { x: 500, y: 117 },
  stock: { digger: 1, floater: 12 },
  terrain: [rect(0, 30, 560, 98), air(260, 36, 270, 82)]
};
