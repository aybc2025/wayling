import { rect, air } from '../dsl.js';

export default {
  id: 'fun-03', rating: 'fun',
  name: { he: 'חופרים למטה', en: 'Dig down' },
  size: [480, 128], count: 20, need: 10, minRate: 50, time: 200,
  hatch: { x: 30, y: 20 }, door: { x: 440, y: 107 },
  stock: { digger: 1 },
  terrain: [rect(0, 50, 480, 78), air(240, 72, 230, 36)]
};
