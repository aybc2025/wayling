import {
  TICK_HZ, ST, SKILLS, FUSE_TICKS, EXIT_TICKS, HATCH_OPEN_TICKS, CRATER_R, DEATH_TICKS, spawnInterval, WALK_EVERY
} from '../config/constants.js';
import { buildTerrain } from '../levels/loader.js';
import { makeCreature, canAssign, applySkill, isDying } from './Creature.js';
import { walkStep, climbStep, fallStep, startFall, grounded } from './motion.js';
import { buildStep } from './skills/build.js';
import { bashStep } from './skills/bash.js';
import { mineStep } from './skills/mine.js';
import { digStep } from './skills/dig.js';
import { makeHazards, hazardFor, updateTraps } from './hazards.js';

/**
 * Deterministic game simulation. No DOM, no randomness, integer positions:
 * the same level and the same commands always give the same result.
 * Observers (renderer, audio, haptics) read `events` and dedupe on `n`.
 */
export class Sim {
  constructor(def, { trackDirty = false } = {}) {
    this.def = def;
    this.trackDirty = trackDirty;
    this.reset();
  }

  reset() {
    const d = this.def;
    this.terrain = buildTerrain(d);
    if (this.trackDirty) this.terrain.dirty = [];
    this.hazards = makeHazards(d.hazards || []);
    this.creatures = [];
    this.t = 0;
    this.spawned = 0;
    this.lastSpawn = 0;
    this.saved = 0;
    this.dead = 0;
    this.rate = d.minRate;
    this.stock = { ...Object.fromEntries(SKILLS.map((s) => [s, 0])), ...d.stock };
    this.nuked = false;
    this.status = 'run';
    this.timeTicks = d.time * TICK_HZ;
    this.events = [];
    this.eventSeq = 0;
    this.blockers = [];
    this.emit('start', d.hatch.x, d.hatch.y);
  }

  get count() { return this.def.count; }
  get need() { return this.def.need; }
  get out() { return this.creatures.filter((c) => !c.gone).length; }
  get timeLeft() { return Math.max(0, Math.ceil((this.timeTicks - this.t) / TICK_HZ)); }
  get percent() { return Math.round((this.saved / this.def.count) * 100); }

  emit(kind, x, y, extra) {
    this.eventSeq += 1;
    this.events.push({ n: this.eventSeq, kind, x, y, ...extra });
    if (this.events.length > 96) this.events.splice(0, this.events.length - 96);
  }

  /** Apply a player command. Returns true when it had an effect. */
  apply(cmd) {
    if (this.status !== 'run') return false;
    if (cmd.type === 'rate') {
      const v = Math.max(this.def.minRate, Math.min(99, cmd.value));
      if (v === this.rate) return false;
      this.rate = v;
      return true;
    }
    if (cmd.type === 'nuke') {
      if (this.nuked) return false;
      this.nuked = true;
      for (const c of this.creatures) if (!c.gone && c.fuse < 0) c.fuse = FUSE_TICKS;
      this.emit('nuke', 0, 0);
      return true;
    }
    if (cmd.type === 'skill') {
      const c = this.creatures[cmd.id];
      if (!c || this.stock[cmd.skill] <= 0 || !canAssign(c, cmd.skill)) return false;
      this.stock[cmd.skill] -= 1;
      applySkill(c, cmd.skill);
      this.emit('skill', c.x, c.y, { skill: cmd.skill, id: c.id });
      return true;
    }
    return false;
  }

  tick() {
    if (this.status !== 'run') return;
    this.t += 1;
    this.spawn();
    updateTraps(this.hazards, this.creatures, (k, x, y) => this.emit(k, x, y));
    this.blockers = this.creatures.filter((c) => !c.gone && c.state === ST.BLOCK);
    for (const c of this.creatures) if (!c.gone) this.act(c);
    this.checkEnd();
  }

  spawn() {
    if (this.nuked || this.spawned >= this.def.count || this.t < HATCH_OPEN_TICKS) return;
    if (this.t === HATCH_OPEN_TICKS) this.emit('hatch', this.def.hatch.x, this.def.hatch.y);
    if (this.spawned > 0 && this.t - this.lastSpawn < spawnInterval(this.rate)) return;
    this.creatures.push(makeCreature(this.spawned, this.def.hatch.x, this.def.hatch.y));
    this.spawned += 1;
    this.lastSpawn = this.t;
  }

  die(c, state) {
    c.state = state;
    c.t = 0;
    c.fuse = -1;
    const kind = { splat: 'splat', drown: 'drown', burn: 'burn', trapped: 'trap', bombed: 'explode' }[state];
    if (kind && kind !== 'trap') this.emit(kind, c.x, c.y);
  }

  remove(c, saved) {
    c.gone = true;
    if (saved) { this.saved += 1; this.emit('saved', c.x, c.y); } else this.dead += 1;
  }

  act(c) {
    const T = this.terrain;
    c.age += 1;
    if (isDying(c)) return this.actDying(c);
    if (c.fuse > 0) {
      c.fuse -= 1;
      if (c.fuse === 0) return this.explode(c);
    }
    const hz = hazardFor(c, this.hazards);
    if (hz) return this.die(c, hz);
    const emit = (k, x, y) => this.emit(k, x, y);
    switch (c.state) {
      case ST.FALL: {
        const r = fallStep(c, T);
        if (r === 'splat') this.die(c, ST.SPLAT);
        else if (r === 'void') { c.state = ST.SPLAT; this.remove(c, false); }
        break;
      }
      case ST.WALK:
        if (c.age % WALK_EVERY === 0) { walkStep(c, T, this.blockers); this.checkExit(c); }
        break;
      case ST.CLIMB: climbStep(c, T); break;
      case ST.BLOCK: if (!grounded(T, c)) startFall(c); break;
      case ST.BUILD: buildStep(c, T, emit); break;
      case ST.BASH: bashStep(c, T, emit); break;
      case ST.MINE: mineStep(c, T, emit); break;
      case ST.DIG: digStep(c, T, emit); break;
      default: break;
    }
  }

  checkExit(c) {
    const d = this.def.door;
    if (c.state === ST.WALK && Math.abs(c.x - d.x) <= 3 && c.y >= d.y - 6 && c.y <= d.y + 2) {
      c.state = ST.EXIT;
      c.t = 0;
      c.fuse = -1;
      this.emit('exit', c.x, c.y);
    }
  }

  actDying(c) {
    c.t += 1;
    const len = c.state === ST.EXIT ? EXIT_TICKS : DEATH_TICKS;
    if (c.t >= len) this.remove(c, c.state === ST.EXIT);
  }

  explode(c) {
    this.terrain.carveCircle(c.x, c.y - 5, CRATER_R);
    this.emit('explode', c.x, c.y - 5);
    c.state = ST.BOMBED;
    c.gone = true;
    this.dead += 1;
  }

  checkEnd() {
    const allIn = this.nuked || this.spawned >= this.def.count;
    const none = this.creatures.every((c) => c.gone);
    if ((allIn && none) || this.t >= this.timeTicks) {
      this.status = this.saved >= this.def.need ? 'won' : 'lost';
      this.emit(this.status, 0, 0);
    }
  }
}
