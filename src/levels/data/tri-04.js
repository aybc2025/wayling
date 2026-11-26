import { rect } from '../dsl.js';
import { water } from '../dsl.js';

export default {
  id: 'tri-04', rating: 'tricky',
  name: { he: 'חוסם', en: 'Hold the line' },
  size: [520, 128], count: 20, need: 14, minRate: 50, time: 240,
  hatch: { x: 300, y: 20 }, door: { x: 60, y: 69 },
  stock: { blocker: 1 },
  terrain: [rect(40, 70, 380, 58)],
  hazards: [water(420, 90, 100, 38)]
};
