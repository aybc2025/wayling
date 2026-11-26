const q = (s, f) => s.tone(f, 0.08, { vol: 0.1 });

/** Sound for each sim event kind or UI cue. */
export const SFX = {
  hatch: (s) => { s.noise(0.25, { vol: 0.18, freq: 500 }); s.tone(110, 0.2, { type: 'triangle', vol: 0.2, slide: -40 }); },
  skill: (s) => { q(s, 660); s.tone(880, 0.1, { vol: 0.1, delay: 0.06 }); },
  deny: (s) => s.tone(160, 0.12, { type: 'sawtooth', vol: 0.1 }),
  tap: (s) => s.tone(520, 0.04, { vol: 0.06 }),
  brick: (s) => s.tone(300, 0.03, { type: 'square', vol: 0.05 }),
  bash: (s) => s.noise(0.05, { vol: 0.05, freq: 900 }),
  clink: (s) => { s.tone(1500, 0.06, { type: 'triangle', vol: 0.12 }); s.tone(2200, 0.05, { type: 'triangle', vol: 0.08, delay: 0.03 }); },
  explode: (s) => { s.noise(0.5, { vol: 0.35, freq: 2400, slide: -2000 }); s.tone(120, 0.4, { type: 'sawtooth', vol: 0.2, slide: -80 }); },
  splat: (s) => { s.noise(0.12, { vol: 0.2, freq: 700 }); s.tone(140, 0.12, { type: 'triangle', vol: 0.15, slide: -60 }); },
  drown: (s) => { s.noise(0.3, { vol: 0.2, freq: 1800, slide: -1200 }); },
  burn: (s) => { s.noise(0.3, { vol: 0.15, freq: 3000 }); s.tone(300, 0.25, { type: 'sawtooth', vol: 0.08, slide: 200 }); },
  trap: (s) => { s.tone(90, 0.2, { type: 'square', vol: 0.2, slide: -30 }); s.noise(0.1, { vol: 0.2, freq: 600 }); },
  exit: (s) => { s.tone(660, 0.08, { vol: 0.1 }); s.tone(990, 0.1, { vol: 0.1, delay: 0.07 }); },
  nuke: (s) => { for (let i = 0; i < 5; i++) s.tone(440 - i * 60, 0.1, { vol: 0.12, delay: i * 0.1 }); },
  won: (s) => { [523, 659, 784, 1047].forEach((f, i) => s.tone(f, 0.18, { vol: 0.14, delay: i * 0.12 })); },
  lost: (s) => { [330, 262, 196].forEach((f, i) => s.tone(f, 0.25, { type: 'triangle', vol: 0.16, delay: i * 0.18 })); }
};

export function playEvent(synth, kind) {
  const fn = SFX[kind];
  if (fn) fn(synth);
}
