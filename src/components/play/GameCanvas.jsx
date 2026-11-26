import { useEffect, useRef } from 'react';
import { Renderer } from '../../render/Renderer.js';
import { useGameInput } from '../../hooks/useGameInput.js';

/** Owns the <canvas>, its DPR-aware size, and pointer input. Reports the renderer upward. */
export default function GameCanvas({ sim, camera, renderer, setRenderer, armedRef, controlRef, labelFor, onDeny, onApplied, reduced }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const r = new Renderer(canvas.current, sim, camera);
    r.effects.reduced = reduced;
    setRenderer(r);
    return () => setRenderer(null);
  }, [sim, camera]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (renderer) renderer.effects.reduced = reduced; }, [renderer, reduced]);

  useEffect(() => {
    if (!renderer) return undefined;
    const fit = () => {
      const r = wrap.current.getBoundingClientRect();
      camera.resize(r.width, r.height);
      renderer.resize(r.width, r.height, Math.min(3, window.devicePixelRatio || 1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [renderer, camera]);

  useGameInput({ canvasRef: canvas, sim, camera, renderer, armedRef, controlRef, labelFor, onDeny, onApplied });

  return (
    <div ref={wrap} className="relative min-h-0 flex-1 overflow-hidden" dir="ltr">
      <canvas ref={canvas} className="field-canvas absolute inset-0 h-full w-full" />
    </div>
  );
}
