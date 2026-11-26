import { COLORS as C } from './palette.js';

const N = 320;

/** Recycled particle pool plus camera shake and a reduced-motion flash. */
export class Effects {
  constructor() {
    this.x = new Float32Array(N); this.y = new Float32Array(N);
    this.vx = new Float32Array(N); this.vy = new Float32Array(N);
    this.life = new Int16Array(N); this.max = new Int16Array(N);
    this.col = new Array(N).fill(C.chalk);
    this.next = 0;
    this.shake = 0;
    this.flash = 0;
    this.reduced = false;
    this.seed = 12345;
  }

  rnd() {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  spawn(x, y, vx, vy, life, color) {
    const i = this.next;
    this.next = (this.next + 1) % N;
    this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy;
    this.life[i] = life; this.max[i] = life; this.col[i] = color;
  }

  burst(x, y, n, colors, speed = 1.6, life = 24, up = 0) {
    if (this.reduced) n = Math.ceil(n / 6);
    for (let k = 0; k < n; k++) {
      const a = this.rnd() * Math.PI * 2, s = (0.3 + this.rnd()) * speed;
      this.spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - up, life - (this.rnd() * 8) | 0, colors[k % colors.length]);
    }
  }

  /** Map one sim event to visuals. Never touches the sim. */
  onEvent(e) {
    const dirt = [`rgb(154,98,56)`, `rgb(127,79,44)`, C.chalk];
    switch (e.kind) {
      case 'explode': this.burst(e.x, e.y, 36, [C.ember, C.marigold, ...dirt], 2.4, 30); this.shake = this.reduced ? 0 : 6; this.flash = this.reduced ? 6 : 0; break;
      case 'splat': this.burst(e.x, e.y - 2, 8, [C.bone, C.chalk], 1.2, 16); break;
      case 'drown': this.burst(e.x, e.y - 2, 12, [C.tarn, C.chalk], 1.3, 22, 1.4); break;
      case 'burn': this.burst(e.x, e.y - 4, 10, [C.ember, C.marigold], 1.2, 22, 1.2); break;
      case 'clink': this.burst(e.x, e.y, 5, [C.chalk, C.marigold], 1.6, 10); break;
      case 'bash': this.burst(e.x, e.y, 2, dirt, 0.9, 14); break;
      case 'exit': this.burst(e.x, e.y - 8, 7, [C.marigold, C.chalk], 0.9, 24, 0.8); break;
      case 'hatch': this.burst(e.x, e.y - 8, 8, dirt, 0.8, 14); break;
      case 'trap': this.shake = this.reduced ? 0 : 3; break;
      default: break;
    }
  }

  update() {
    for (let i = 0; i < N; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i]--;
      this.x[i] += this.vx[i]; this.y[i] += this.vy[i];
      this.vy[i] += 0.08;
    }
    this.shake *= 0.82;
    if (this.shake < 0.2) this.shake = 0;
    if (this.flash > 0) this.flash--;
  }

  draw(ctx) {
    for (let i = 0; i < N; i++) {
      if (this.life[i] <= 0) continue;
      ctx.globalAlpha = Math.min(1, this.life[i] / (this.max[i] * 0.5));
      ctx.fillStyle = this.col[i];
      ctx.fillRect(Math.round(this.x[i]), Math.round(this.y[i]), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}
