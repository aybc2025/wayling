import { MAT } from '../config/constants.js';

/** Per-pixel material map. Left/right edges act as steel walls, the bottom is a void. */
export class Terrain {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w * h);
    this.version = 0;
    this.dirty = null; // set to [] by the renderer to collect changed rectangles
  }

  get(x, y) {
    if (x < 0 || x >= this.w) return MAT.STEEL;
    if (y < 0 || y >= this.h) return MAT.AIR;
    return this.data[y * this.w + x];
  }

  solid(x, y) {
    return this.get(x, y) !== MAT.AIR;
  }

  set(x, y, m) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    this.data[y * this.w + x] = m;
  }

  touch(x, y, w, h) {
    this.version++;
    if (this.dirty) this.dirty.push({ x, y, w, h });
  }

  rect(x, y, w, h, m) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, m);
    this.touch(x, y, w, h);
  }

  ellipse(cx, cy, rx, ry, m) {
    for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++) {
      for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++) {
        const dx = (i - cx) / rx, dy = (j - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(i, j, m);
      }
    }
    this.touch(cx - rx, cy - ry, rx * 2 + 1, ry * 2 + 1);
  }

  /** Scanline polygon fill, points as [[x, y], ...]. */
  poly(pts, m) {
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= y + 0.5 && b[1] > y + 0.5) || (b[1] <= y + 0.5 && a[1] > y + 0.5)) {
          xs.push(a[0] + ((y + 0.5 - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
        }
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, m);
      }
    }
    this.touch(0, Math.floor(minY), this.w, Math.ceil(maxY - minY) + 1);
  }

  /** Remove every non-steel pixel inside the circle. */
  carveCircle(cx, cy, r) {
    for (let j = cy - r; j <= cy + r; j++) {
      for (let i = cx - r; i <= cx + r; i++) {
        if ((i - cx) * (i - cx) + (j - cy) * (j - cy) <= r * r && this.get(i, j) !== MAT.STEEL) this.set(i, j, MAT.AIR);
      }
    }
    this.touch(cx - r, cy - r, r * 2 + 1, r * 2 + 1);
  }

  /** Clear the cells of a box, skipping steel. Returns nothing; callers check blockers first. */
  carveBox(x0, y0, x1, y1) {
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) if (this.get(i, j) !== MAT.STEEL) this.set(i, j, MAT.AIR);
    this.touch(x0, y0, x1 - x0 + 1, y1 - y0 + 1);
  }

  /** Place dirt only where there is air (builder bricks). */
  fillAir(x0, x1, y, m) {
    for (let i = x0; i <= x1; i++) if (this.get(i, y) === MAT.AIR) this.set(i, y, m);
    this.touch(x0, y, x1 - x0 + 1, 1);
  }
}
