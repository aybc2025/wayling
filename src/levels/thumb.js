import { buildTerrain } from './loader.js';
import { TerrainLayer } from '../render/terrainLayer.js';

const cache = new Map();

/** Small terrain picture for the level list, cached per level. */
export function thumbUrl(def, w = 192, h = 128) {
  if (cache.has(def.id)) return cache.get(def.id);
  const layer = new TerrainLayer(buildTerrain(def));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#1d2a38'); g.addColorStop(1, '#0f1620');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const s = w / def.size[0];
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(layer.canvas, 0, h - def.size[1] * s, w, def.size[1] * s);
  const url = c.toDataURL('image/png');
  cache.set(def.id, url);
  return url;
}
