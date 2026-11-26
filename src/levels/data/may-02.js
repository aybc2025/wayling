import { rect, air, steel, lava } from '../dsl.js';

export default {
  id: 'may-02', rating: 'mayhem',
  name: { he: 'קרקע סדוקה', en: 'Cracked ground' },
  size: [640, 128], count: 20, need: 12, minRate: 10, time: 420,
  hatch: { x: 30, y: 10 }, door: { x: 560, y: 117 },
  stock: { digger: 1, builder: 2, floater: 20 },
  terrain: [
    rect(0, 20, 640, 108), steel(0, 56, 640, 8), rect(190, 56, 20, 8),
    air(60, 64, 520, 54), air(300, 118, 22, 10)
  ],
  hazards: [lava(300, 122, 22, 6)]
};
