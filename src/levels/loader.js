import { Terrain } from '../engine/Terrain.js';
import { MAT_BY_NAME } from '../config/constants.js';

/** Build the terrain bitmap from a level's primitive list. */
export function buildTerrain(def) {
  const [w, h] = def.size;
  const T = new Terrain(w, h);
  for (const p of def.terrain) {
    const m = MAT_BY_NAME[p.mat ?? 'dirt'];
    if (p.shape === 'rect') T.rect(p.x, p.y, p.w, p.h, m);
    else if (p.shape === 'ellipse') T.ellipse(p.cx, p.cy, p.rx, p.ry, m);
    else if (p.shape === 'poly') T.poly(p.pts, m);
    else throw new Error(`unknown terrain shape ${p.shape}`);
  }
  return T;
}
