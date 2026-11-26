/**
 * Camera over the logical level. `scale` is CSS pixels per logical pixel and moves in
 * half steps so pixels stay crisp. When the level is shorter than the view it sits on
 * the bottom edge and the sky fills the rest.
 */
export class Camera {
  constructor() {
    this.x = 0; this.y = 0; this.scale = 2;
    this.vw = 360; this.vh = 300; this.lw = 480; this.lh = 128;
    this.shakeX = 0; this.shakeY = 0;
  }

  setLevel(w, h, startX = 0) {
    this.lw = w; this.lh = h;
    this.fit();
    this.x = startX - this.vw / this.scale / 2;
    this.y = 0;
    this.clamp();
  }

  resize(vw, vh) {
    this.vw = vw; this.vh = vh;
    this.fit();
    this.clamp();
  }

  fit() {
    // Height decides, but never zoom so far that less than ~130 logical px of width is visible.
    let s = Math.floor(Math.min(this.vh / this.lh, this.vw / 130) * 2) / 2;
    s = Math.max(1.5, Math.min(4, s));
    if (this.vw / s > this.lw) s = this.vw / this.lw;
    this.scale = s;
  }

  get viewW() { return this.vw / this.scale; }
  get viewH() { return this.vh / this.scale; }
  get offsetY() { return this.lh * this.scale < this.vh ? (this.vh - this.lh * this.scale) / this.scale : 0; }

  clamp() {
    this.x = Math.max(0, Math.min(this.lw - this.viewW, this.x));
    const maxY = Math.max(0, this.lh - this.viewH);
    this.y = Math.max(0, Math.min(maxY, this.y));
  }

  panBy(dxCss, dyCss) {
    this.x -= dxCss / this.scale;
    this.y -= dyCss / this.scale;
    this.clamp();
  }

  panLogical(dx, dy = 0) {
    this.x += dx; this.y += dy;
    this.clamp();
  }

  centerOn(lx) {
    this.x = lx - this.viewW / 2;
    this.clamp();
  }

  toWorld(px, py) {
    return { x: this.x + px / this.scale, y: this.y + py / this.scale - this.offsetY };
  }
}
