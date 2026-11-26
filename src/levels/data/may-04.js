import { rect, owr, lava } from '../dsl.js';

export default {
  id: 'may-04', rating: 'mayhem',
  name: { he: 'המעבר האחרון', en: 'The last crossing' },
  size: [720, 128], count: 24, need: 14, minRate: 1, time: 600,
  hatch: { x: 30, y: 10 }, door: { x: 680, y: 117 },
  stock: { floater: 24, basher: 1, builder: 3 },
  terrain: [
    rect(0, 30, 160, 98), rect(160, 118, 60, 10), rect(280, 118, 440, 10), owr(340, 0, 30, 118)
  ],
  hazards: [lava(220, 122, 60, 6)]
};
