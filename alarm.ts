/**
 * Emergency alarm audio, synthesized with the Web Audio API (no sound files).
 *
 * CRITICAL → loud two-tone klaxon interleaved with a rising siren whoop, repeating until silenced
 *            or every source returns to normal.
 * WARNING  → triple high-pitched caution beep, repeating every few seconds.
 *
 * Several sources can raise an alarm at once (Mission Control simulator, Health Monitor, …);
 * the loudest active level plays. Browsers only allow audio after a user gesture, so the context
 * is unlocked on the first click/tap/keypress anywhere on the site.
 */
export type AlarmLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

interface AlarmState {
  level: AlarmLevel;
  sounding: boolean;
  silenced: boolean;
  muted: boolean;
  volume: number;
  sources: Record<string, AlarmLevel>;
}

const RANK: Record<AlarmLevel, number> = { NORMAL: 0, WARNING: 1, CRITICAL: 2 };
const STORE_KEY = 'astra-alarm-prefs';

class AlarmSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private listeners = new Set<() => void>();
  private state: AlarmState;

  constructor() {
    let muted = false;
    let volume = 0.85;
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (typeof saved.muted === 'boolean') muted = saved.muted;
      if (typeof saved.volume === 'number') volume = saved.volume;
    } catch {
      /* storage unavailable */
    }
    this.state = { level: 'NORMAL', sounding: false, silenced: false, muted, volume, sources: {} };

    if (typeof window !== 'undefined') {
      const unlock = () => this.unlock();
      ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
    }
  }

  // ---- subscription -------------------------------------------------------
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getState = () => this.state;
  private emit() {
    this.state = { ...this.state };
    this.listeners.forEach((l) => l());
  }

  // ---- audio plumbing -----------------------------------------------------
  /** Creates/resumes the audio context. Call from any user gesture (also from inside embedded frames). */
  unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -10;
      comp.knee.value = 6;
      comp.ratio.value = 8;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.state.muted ? 0 : this.state.volume;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
    }
    // An alarm raised before the first gesture starts as soon as audio is allowed.
    const go = () => {
      if (this.state.level !== 'NORMAL' && !this.state.silenced && !this.timer) this.startLoop();
    };
    if (this.ctx.state === 'suspended') void this.ctx.resume().then(go);
    else go();
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType, peak: number, sweepTo?: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.015);
    g.gain.setValueAtTime(peak, start + dur - 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  /** One cycle of the critical klaxon: hi/lo two-tone ×3, then a siren whoop. ~3.2 s. */
  private playCritical() {
    if (!this.ctx) return 3200;
    const t = this.ctx.currentTime + 0.02;
    for (let i = 0; i < 3; i++) {
      const s = t + i * 0.7;
      this.tone(1046, s, 0.33, 'square', 0.32);
      this.tone(1052, s, 0.33, 'sawtooth', 0.18);
      this.tone(784, s + 0.35, 0.33, 'square', 0.32);
      this.tone(788, s + 0.35, 0.33, 'sawtooth', 0.18);
    }
    this.tone(620, t + 2.15, 0.95, 'sawtooth', 0.34, 1650);
    this.tone(625, t + 2.15, 0.95, 'square', 0.16, 1660);
    return 3200;
  }

  /** One cycle of the caution tone: three short high beeps. Repeats every ~3.5 s. */
  private playWarning() {
    if (!this.ctx) return 3500;
    const t = this.ctx.currentTime + 0.02;
    for (let i = 0; i < 3; i++) {
      this.tone(1880, t + i * 0.22, 0.13, 'square', 0.22);
      this.tone(2490, t + i * 0.22, 0.13, 'sine', 0.12);
    }
    return 3500;
  }

  private startLoop() {
    this.stopLoop();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const cycle = () => {
      if (this.state.silenced || this.state.level === 'NORMAL') {
        this.stopLoop();
        return;
      }
      const ms = this.state.level === 'CRITICAL' ? this.playCritical() : this.playWarning();
      this.timer = window.setTimeout(cycle, ms);
    };
    this.state.sounding = true;
    this.emit();
    cycle();
  }

  private stopLoop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.state.sounding) {
      this.state.sounding = false;
      this.emit();
    }
  }

  // ---- public control -----------------------------------------------------
  /** Report the current level for one source; the highest level across sources is what sounds. */
  report(source: string, level: AlarmLevel) {
    if (this.state.sources[source] === level) return;
    const sources = { ...this.state.sources, [source]: level };
    const next = (Object.values(sources) as AlarmLevel[]).reduce<AlarmLevel>((a, b) => (RANK[b] > RANK[a] ? b : a), 'NORMAL');
    const escalated = RANK[next] > RANK[this.state.level];
    this.state.sources = sources;
    this.state.level = next;
    if (next === 'NORMAL') this.state.silenced = false; // re-arm once everything is clear
    if (escalated) this.state.silenced = false; // a worse condition always sounds again
    this.emit();
    if (next === 'NORMAL' || this.state.silenced) this.stopLoop();
    else if (escalated || !this.timer) this.startLoop();
  }

  /** Acknowledge: stop the sound until the level escalates or clears and re-triggers. */
  silence() {
    this.state.silenced = true;
    this.stopLoop();
    this.emit();
  }

  setMuted(muted: boolean) {
    this.state.muted = muted;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : this.state.volume, this.ctx.currentTime, 0.02);
    this.save();
    this.emit();
  }

  setVolume(v: number) {
    this.state.volume = Math.min(1, Math.max(0, v));
    if (this.master && this.ctx && !this.state.muted) this.master.gain.setTargetAtTime(this.state.volume, this.ctx.currentTime, 0.02);
    this.save();
    this.emit();
  }

  /** Plays one cycle of the given alarm so people can check their speakers. */
  test(level: Exclude<AlarmLevel, 'NORMAL'> = 'CRITICAL') {
    this.unlock();
    if (level === 'CRITICAL') this.playCritical();
    else this.playWarning();
  }

  private save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ muted: this.state.muted, volume: this.state.volume }));
    } catch {
      /* storage unavailable */
    }
  }
}

export const alarm = new AlarmSystem();
