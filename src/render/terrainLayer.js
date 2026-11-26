import { MAT } from '../config/constants.js';
import { COLORS as C } from './palette.js';

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) & 255;
}

/** Offscreen bitmap of the terrain. Only changed rectangles are repainted. */
export class TerrainLayer {
  constructor(terrain) {
    this.T = terrain;
    this.canvas = document.createElement('canvas');
    this.canvas.width = terrain.w;
    this.canvas.height = terrain.h;
    this.ctx = this.canvas.getContext('2d');
    this.img = this.ctx.createImageData(terrain.w, terrain.h);
    this.paint(0, 0, terrain.w, terrain.h);
  }

  put(i, rgb) {
    const d = this.img.data;
    d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255;
  }

  clearPx(i) {
    this.img.data[i + 3] = 0;
  }

  paint(x0, y0, w, h) {
    const T = this.T;
    const xa = Math.max(0, Math.floor(x0) - 1), ya = Math.max(0, Math.floor(y0) - 3);
    const xb = Math.min(T.w, Math.ceil(x0 + w) + 1), yb = Math.min(T.h, Math.ceil(y0 + h) + 1);
    for (let y = ya; y < yb; y++) {
      for (let x = xa; x < xb; x++) {
        const i = (y * T.w + x) * 4;
        const m = T.data[y * T.w + x];
        if (m === MAT.AIR) { this.clearPx(i); continue; }
        if (m === MAT.STEEL) { this.put(i, ((x + y) >> 2) & 1 ? C.steelA : C.steelB); continue; }
        const n = hash(x, y);
        let col = n < 40 ? C.dirtDark : n > 225 ? C.dirtLight : C.dirt;
        if (m === MAT.OWR && (x - y) % 7 === 0) col = C.arrow;
        if (m === MAT.OWL && (x + y) % 7 === 0) col = C.arrow;
        if (!T.solid(x, y - 1)) col = C.grass;
        else if (!T.solid(x, y - 2)) col = C.grassDark;
        this.put(i, col);
      }
    }
    this.ctx.putImageData(this.img, 0, 0, xa, ya, xb - xa, yb - ya);
  }

  flush() {
    const list = this.T.dirty;
    if (!list || list.length === 0) return;
    for (const r of list) this.paint(r.x, r.y, r.w, r.h);
    list.length = 0;
  }
}
