// Tiny helpers so level files read like a sketch.
export const rect = (x, y, w, h, mat = 'dirt') => ({ shape: 'rect', x, y, w, h, mat });
export const air = (x, y, w, h) => rect(x, y, w, h, 'air');
export const steel = (x, y, w, h) => rect(x, y, w, h, 'steel');
export const owr = (x, y, w, h) => rect(x, y, w, h, 'owr');
export const owl = (x, y, w, h) => rect(x, y, w, h, 'owl');
export const ellipse = (cx, cy, rx, ry, mat = 'dirt') => ({ shape: 'ellipse', cx, cy, rx, ry, mat });
export const poly = (pts, mat = 'dirt') => ({ shape: 'poly', pts, mat });
export const water = (x, y, w, h) => ({ kind: 'water', x, y, w, h });
export const lava = (x, y, w, h) => ({ kind: 'lava', x, y, w, h });
export const trap = (x, y, w, h) => ({ kind: 'trap', x, y, w, h });
