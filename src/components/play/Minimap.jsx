import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/index.js';

const H = 28;

/** Whole level at a glance: terrain copy, creature dots, viewport box. Tap or drag to move the camera. */
export default function Minimap({ sim, camera, renderer }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const [lw, lh] = sim.def.size;
  const w = Math.min(160, Math.round((lw / lh) * H));

  useEffect(() => {
    const c = ref.current;
    if (!c || !renderer) return undefined;
    const ctx = c.getContext('2d');
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, H);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(renderer.layer.canvas, 0, 0, w, H);
      ctx.fillStyle = '#ffb41f';
      for (const cr of sim.creatures) if (!cr.gone) ctx.fillRect((cr.x / lw) * w - 1, (cr.y / lh) * H - 1, 2, 2);
      ctx.strokeStyle = '#ece9e1';
      ctx.lineWidth = 1;
      ctx.strokeRect((camera.x / lw) * w + 0.5, 0.5, Math.min(w, (camera.viewW / lw) * w) - 1, H - 1);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sim, camera, renderer, lw, lh, w]);

  const go = (e) => {
    const r = ref.current.getBoundingClientRect();
    camera.centerOn(((e.clientX - r.left) / r.width) * lw);
  };

  return (
    <canvas ref={ref} width={w} height={H} aria-label={t('controls.map')} role="img"
      className="rounded border border-ridge bg-peat" style={{ width: w, height: H, touchAction: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); go(e); }}
      onPointerMove={(e) => { if (e.buttons) go(e); }} />
  );
}
