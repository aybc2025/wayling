import { rect } from '../dsl.js';

export default {
  id: 'may-01', rating: 'mayhem',
  name: { he: 'שלוש תחנות', en: 'Three stops' },
  size: [640, 128], count: 20, need: 10, minRate: 1, time: 360,
  hatch: { x: 30, y: 10 }, door: { x: 600, y: 117 },
  stock: { builder: 2, basher: 1, floater: 12 },
  terrain: [rect(0, 40, 160, 88), rect(184, 40, 200, 88), rect(300, 0, 30, 40), rect(384, 118, 256, 10)]
};
