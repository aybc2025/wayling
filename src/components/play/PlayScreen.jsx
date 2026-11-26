import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SKILLS } from '../../config/skills.js';
import { useI18n } from '../../i18n/index.js';
import { useSimulation } from '../../hooks/useSimulation.js';
import { useGameLoop } from '../../hooks/useGameLoop.js';
import { useWakeLock } from '../../hooks/useWakeLock.js';
import { reducedMotionOn } from '../../hooks/useSettings.js';
import { LEVELS } from '../../levels/index.js';
import Hud from './Hud.jsx';
import GameCanvas from './GameCanvas.jsx';
import Minimap from './Minimap.jsx';
import SkillBar from './SkillBar.jsx';
import ControlRow from './ControlRow.jsx';
import PauseDialog from '../dialogs/PauseDialog.jsx';
import ResultDialog from '../dialogs/ResultDialog.jsx';

const firstWithStock = (stock) => SKILLS.find((s) => (stock[s] || 0) > 0) || null;
const BUZZ = { explode: 30, splat: 12, won: [20, 40, 20] };

export default function PlayScreen({ level, runKey, settings, audio, progress, onRetry, onNext, onMenu, onSettings, settingsOpen }) {
  const { t, lang } = useI18n();
  const { sim, camera, store, snap } = useSimulation(level, runKey);
  const control = useMemo(() => ({ paused: false, speed: 1, pan: 0 }), [sim]);
  const controlRef = useRef(control);
  controlRef.current = control;

  const [renderer, setRenderer] = useState(null);
  const [armed, setArmed] = useState(() => firstWithStock(level.stock));
  const [paused, setPaused] = useState(false);
  const [fast, setFast] = useState(false);
  const [nukeHeld, setNukeHeld] = useState(false);
  const [prevBest, setPrevBest] = useState(0);
  const armedRef = useRef(armed);
  armedRef.current = armed;

  useEffect(() => { setArmed(firstWithStock(level.stock)); setPaused(false); setFast(false); setPrevBest(progress.best(level.id)); }, [sim]); // eslint-disable-line react-hooks/exhaustive-deps

  const inDialog = paused || settingsOpen;
  useEffect(() => { control.paused = inDialog; }, [control, inDialog]);
  useEffect(() => { control.speed = fast ? 3 : 1; }, [control, fast]);
  useWakeLock(snap.status === 'run');

  const onEvents = useCallback((events) => {
    for (const e of events) {
      audio.play(e.kind);
      if (BUZZ[e.kind]) audio.buzz(BUZZ[e.kind]);
    }
  }, [audio]);
  useGameLoop({ sim, renderer, camera, store, control, onEvents });

  // Record the outcome exactly once per run.
  const recorded = useRef(null);
  useEffect(() => {
    if (snap.status === 'run' || recorded.current === sim) return;
    recorded.current = sim;
    progress.record(level.id, snap.percent, snap.status === 'won');
  }, [snap.status, sim]); // eslint-disable-line react-hooks/exhaustive-deps

  const labelFor = useCallback((c) => {
    const base = t(`state.${c.state}`);
    return base === `state.${c.state}` ? '' : base;
  }, [t]);
  const onDeny = useCallback(() => audio.play('deny'), [audio]);
  const onApplied = useCallback((skill) => {
    if ((sim.stock[skill] || 0) <= 0) setArmed((a) => (a === skill ? firstWithStock(sim.stock) : a));
  }, [sim]);

  const arm = useCallback((s) => { setArmed(s); audio.play('tap'); }, [audio]);
  const rateBy = (d) => sim.apply({ type: 'rate', value: Math.max(sim.def.minRate, Math.min(99, sim.rate + d)) });
  const nuke = () => sim.apply({ type: 'nuke' });

  // Keyboard. No animation is tied to these.
  useEffect(() => {
    const down = (e) => {
      if (e.repeat && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const k = e.key;
      if (settingsOpen) return;
      if (k >= '1' && k <= '8') { const s = SKILLS[Number(k) - 1]; if ((sim.stock[s] || 0) > 0) arm(s); }
      else if (k === ' ' || k === 'Escape') { e.preventDefault(); setPaused((p) => !p); }
      else if (k === 'f' || k === 'F') setFast((f) => !f);
      else if (k === 'n' || k === 'N') setNukeHeld(true);
      else if (k === '+' || k === '=') rateBy(10);
      else if (k === '-') rateBy(-10);
      else if (k === 'ArrowLeft' || k === 'a' || k === 'A') control.pan = -1;
      else if (k === 'ArrowRight' || k === 'd' || k === 'D') control.pan = 1;
    };
    const up = (e) => {
      if (e.key === 'n' || e.key === 'N') setNukeHeld(false);
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) control.pan = 0;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [sim, control, arm, settingsOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const index = LEVELS.findIndex((l) => l.id === level.id);
  const hasNext = index < LEVELS.length - 1;
  const ended = snap.status !== 'run';

  return (
    <div className="flex h-full flex-col bg-peat" data-testid="play">
      <Hud snap={snap} />
      <GameCanvas sim={sim} camera={camera} renderer={renderer} setRenderer={setRenderer} armedRef={armedRef}
        controlRef={controlRef} labelFor={labelFor} onDeny={onDeny} onApplied={onApplied} reduced={reducedMotionOn(settings)} />
      <div className="border-t border-strata bg-loam">
        <div className="flex items-center justify-center pt-1.5" dir="ltr"><Minimap sim={sim} camera={camera} renderer={renderer} /></div>
        <SkillBar stock={snap.stock} armed={armed} onArm={arm} />
        <ControlRow rate={snap.rate} minRate={snap.minRate} paused={paused} fast={fast} nukeDisabled={ended || snap.nuked}
          nukeHeld={nukeHeld} onRate={rateBy} onPause={() => setPaused((p) => !p)} onFast={() => setFast((f) => !f)}
          onNuke={nuke} onHome={onMenu} />
      </div>
      <PauseDialog open={paused && !ended && !settingsOpen} onResume={() => setPaused(false)} onRestart={onRetry}
        onLevels={onMenu} onSettings={onSettings} />
      <ResultDialog open={ended} snap={snap} prevBest={prevBest} hasNext={hasNext} onNext={onNext} onRetry={onRetry} onLevels={onMenu} />
    </div>
  );
}
