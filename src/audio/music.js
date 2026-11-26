const SCALE = [0, 3, 5, 7, 10, 12, 15];

/** Quiet generative loop: a slow pentatonic walk over a drone. Deterministic, no samples. */
export class Music {
  constructor(synth) {
    this.synth = synth;
    this.timer = null;
    this.step = 0;
    this.seed = 7;
  }

  rnd() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const s = this.synth;
      if (!s.ctx || !s.enabled) return;
      this.step += 1;
      if (this.step % 8 === 1) s.tone(55, 3.8, { type: 'triangle', vol: 0.05 });
      if (this.rnd() < 0.7) {
        const n = SCALE[Math.floor(this.rnd() * SCALE.length)];
        s.tone(220 * 2 ** (n / 12), 0.9, { type: 'triangle', vol: 0.035 });
      }
    }, 480);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
