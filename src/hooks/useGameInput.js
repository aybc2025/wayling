import { useEffect } from 'react';
import { pickCreature } from '../engine/pick.js';

const PAN_THRESHOLD = 8;

/**
 * Pointer input for the field: tap gives the armed skill to the nearest creature that can use it,
 * drag pans, mouse hover names the creature. Keys are handled by PlayScreen.
 */
export function useGameInput({ canvasRef, sim, camera, renderer, armedRef, controlRef, labelFor, onDeny, onApplied }) {
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !renderer) return undefined;
    let down = null;

    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
    };

    const onDown = (e) => {
      el.setPointerCapture?.(e.pointerId);
      const p = local(e);
      down = { x: p.x, y: p.y, px: p.x, py: p.y, pan: false };
    };

    const onMove = (e) => {
      const p = local(e);
      if (down) {
        if (!down.pan && Math.hypot(p.x - down.x, p.y - down.y) > PAN_THRESHOLD) down.pan = true;
        if (down.pan) { camera.panBy(p.x - down.px, p.y - down.py); down.px = p.x; down.py = p.y; }
        return;
      }
      if (e.pointerType === 'mouse') {
        const w = camera.toWorld(p.x, p.y);
        const c = pickCreature(sim.creatures, w.x, w.y, null, 12);
        renderer.hover = c;
        renderer.hoverLabel = c ? labelFor(c) : '';
        controlRef.current.pan = p.x < 28 ? -1 : p.x > p.w - 28 ? 1 : 0;
      }
    };

    const onUp = (e) => {
      const d = down;
      down = null;
      if (!d || d.pan || sim.status !== 'run' || controlRef.current.paused) return;
      const p = local(e);
      const w = camera.toWorld(p.x, p.y);
      const skill = armedRef.current;
      const radius = Math.max(9, 24 / camera.scale);
      const c = skill ? pickCreature(sim.creatures, w.x, w.y, skill, radius) : null;
      if (c && sim.apply({ type: 'skill', id: c.id, skill })) onApplied(skill); else onDeny();
    };

    const onLeave = () => { renderer.hover = null; controlRef.current.pan = 0; };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', () => { down = null; });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [canvasRef, sim, camera, renderer, armedRef, controlRef, labelFor, onDeny, onApplied]);
}
