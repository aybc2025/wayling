import { HATCH_OPEN_TICKS } from '../config/constants.js';
import { COLORS as C } from './palette.js';
import { TerrainLayer } from './terrainLayer.js';
import { Effects } from './effects.js';
import { drawCreature, drawFuse } from './sprites.js';

/** Canvas 2D view of a Sim. Reads state only; never changes the simulation. */
export class Renderer {
  constructor(canvas, sim, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = camera;
    this.effects = new Effects();
    this.dpr = 1;
    this.hover = null;
    this.hoverLabel = '';
    this.setSim(sim);
  }

  setSim(sim) {
    this.sim = sim;
    sim.terrain.dirty = [];
    this.layer = new TerrainLayer(sim.terrain);
    this.lastEvent = sim.eventSeq;
    this.sky = null;
  }

  resize(cssW, cssH, dpr) {
    this.dpr = dpr;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.sky = null;
  }

  /** Feed new sim events to the effects layer and return them for audio and haptics. */
  drainEvents() {
    const out = [];
    for (const e of this.sim.events) {
      if (e.n > this.lastEvent) { out.push(e); this.effects.onEvent(e); }
    }
    if (out.length) this.lastEvent = out[out.length - 1].n;
    return out;
  }

  drawSky(ctx, w, h) {
    if (!this.sky) {
      this.sky = ctx.createLinearGradient(0, 0, 0, h);
      this.sky.addColorStop(0, C.skyTop);
      this.sky.addColorStop(1, C.skyBottom);
    }
    ctx.fillStyle = this.sky;
    ctx.fillRect(0, 0, w, h);
  }

  draw(now) {
    const { ctx, camera: cam, sim, dpr } = this;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.drawSky(ctx, W, H);
    this.layer.flush();
    this.effects.update();
    const s = cam.scale * dpr;
    const shx = this.effects.shake ? ((sim.t * 7) % 5 - 2) * this.effects.shake * 0.4 : 0;
    const shy = this.effects.shake ? ((sim.t * 11) % 5 - 2) * this.effects.shake * 0.4 : 0;
    const e = Math.round(-cam.x * s + shx * dpr);
    const f = Math.round(cam.offsetY * cam.scale * dpr - cam.y * s + shy * dpr);
    ctx.setTransform(s, 0, 0, s, e, f);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.layer.canvas, 0, 0);
    this.drawHazards(ctx, now);
    this.drawHatch(ctx);
    this.drawDoor(ctx);
    for (const c of sim.creatures) if (!c.gone) drawCreature(ctx, c, sim.t);
    for (const c of sim.creatures) if (!c.gone) drawFuse(ctx, c);
    this.drawHover(ctx);
    this.effects.draw(ctx);
    if (this.effects.flash > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = `rgba(236,233,225,${this.effects.flash / 12})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  drawHazards(ctx, now) {
    for (const h of this.sim.hazards) {
      if (h.kind === 'water' || h.kind === 'lava') {
        const water = h.kind === 'water';
        ctx.globalAlpha = water ? 0.82 : 0.95;
        ctx.fillStyle = water ? C.tarn : C.ember;
        ctx.fillRect(h.x, h.y, h.w, h.h);
        ctx.globalAlpha = 1;
        ctx.fillStyle = water ? C.chalk : C.marigold;
        const ph = now / (water ? 260 : 420);
        for (let x = 0; x < h.w; x += 2) ctx.fillRect(h.x + x, h.y + Math.round(Math.sin(ph + x * 0.5) * 0.6 + 0.5) - 1 + (water ? 0 : 1), 1, 1);
      } else if (h.kind === 'trap') {
        const crush = h.cool > 40 ? 1 : h.cool > 0 ? 0.3 : 0;
        ctx.fillStyle = C.ridge;
        ctx.fillRect(h.x, h.y - 6, h.w, 4);
        ctx.fillStyle = C.steelA;
        ctx.fillRect(h.x + 1, h.y - 3 + Math.round(crush * (h.h + 2)), h.w - 2, 5);
        ctx.fillStyle = C.ember;
        ctx.fillRect(h.x, h.y + h.h - 1, h.w, 1);
      }
    }
  }

  drawHatch(ctx) {
    const { x, y } = this.sim.def.hatch;
    const open = this.sim.t >= HATCH_OPEN_TICKS ? 1 : Math.min(1, this.sim.t / HATCH_OPEN_TICKS);
    ctx.fillStyle = C.strata;
    ctx.fillRect(x - 11, y - 14, 22, 8);
    ctx.fillStyle = C.ridge;
    ctx.fillRect(x - 11, y - 14, 22, 1);
    ctx.fillRect(x - 11, y - 7, 22, 1);
    ctx.fillStyle = C.peat;
    ctx.fillRect(x - 7 + Math.round(open * 3), y - 13, Math.round(14 - open * 6), 6);
  }

  drawDoor(ctx) {
    const { x, y } = this.sim.def.door;
    ctx.fillStyle = C.marigold;
    ctx.fillRect(x - 8, y - 17, 16, 18);
    ctx.fillRect(x - 6, y - 19, 12, 2);
    ctx.fillStyle = C.peat;
    ctx.fillRect(x - 6, y - 15, 12, 16);
    ctx.fillRect(x - 4, y - 17, 8, 2);
    ctx.fillStyle = C.marigold;
    ctx.fillRect(x - 1, y - 12, 2, 2);
  }

  drawHover(ctx) {
    const c = this.hover;
    if (!c || c.gone) return;
    ctx.strokeStyle = C.chalk;
    ctx.lineWidth = 1;
    ctx.strokeRect(c.x - 5.5, c.y - 12.5, 11, 14);
    if (this.hoverLabel) {
      ctx.font = '7px Assistant, sans-serif';
      ctx.textAlign = 'center';
      const w = ctx.measureText(this.hoverLabel).width + 6;
      ctx.fillStyle = C.chalk;
      ctx.fillRect(Math.round(c.x - w / 2), c.y - 24, Math.round(w), 9);
      ctx.fillStyle = C.peat;
      ctx.fillText(this.hoverLabel, c.x, c.y - 17);
    }
  }
}
