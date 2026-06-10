export type SoundId =
  | 'boot.beep'
  | 'ui.click'
  | 'ui.navigate'
  | 'ui.confirm'
  | 'ui.back'
  | 'game.choices-appear'
  | 'game.choice-select'
  | 'game.continue'
  | 'game.chapter-start'
  | 'game.stat-increase'
  | 'game.stat-decrease'
  | 'game.save'
  | 'game.load'
  | 'game.warning'
  | 'game.ending';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxEnabled = true;
  private sfxVolume = 70;

  private init(): { ctx: AudioContext; out: GainNode } | null {
    if (!this.sfxEnabled) return null;
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.sfxVolume / 100;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.masterGain) return null;
      return { ctx: this.ctx, out: this.masterGain };
    } catch {
      return null;
    }
  }

  setSettings(sfxEnabled: boolean, sfxVolume: number) {
    this.sfxEnabled = sfxEnabled;
    this.sfxVolume = sfxVolume;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(sfxVolume / 100, this.ctx!.currentTime, 0.02);
    }
  }

  play(id: SoundId) {
    const audio = this.init();
    if (!audio) return;
    const { ctx, out } = audio;
    const t = ctx.currentTime;

    switch (id) {
      case 'boot.beep':
        this.tone(ctx, out, 880, 'sine', t, 0.08, 0.0, 0.02, 0.08);
        break;

      case 'ui.click':
        this.tone(ctx, out, 200, 'square', t, 0.06, 0.0, 0.01, 0.04);
        break;

      case 'ui.navigate':
        this.tone(ctx, out, 660, 'square', t, 0.05, 0.0, 0.01, 0.05);
        break;

      case 'ui.confirm':
        this.tone(ctx, out, 440, 'sine', t, 0.10, 0.0, 0.04, 0.08);
        this.tone(ctx, out, 660, 'sine', t + 0.09, 0.12, 0.0, 0.04, 0.12);
        break;

      case 'ui.back':
        this.tone(ctx, out, 440, 'sine', t, 0.08, 0.0, 0.02, 0.08);
        this.tone(ctx, out, 330, 'sine', t + 0.07, 0.06, 0.0, 0.02, 0.08);
        break;

      case 'game.choices-appear':
        this.noise(ctx, out, t, 0.07, 0.12, 0.25, 900);
        break;

      case 'game.choice-select':
        this.tone(ctx, out, 330, 'sine', t, 0.12, 0.0, 0.01, 0.07);
        this.tone(ctx, out, 880, 'sine', t + 0.01, 0.07, 0.0, 0.04, 0.14);
        break;

      case 'game.continue':
        this.tone(ctx, out, 440, 'sine', t, 0.08, 0.0, 0.02, 0.10);
        break;

      case 'game.chapter-start':
        this.tone(ctx, out, 55,  'sine', t,      0.30, 0.08, 0.50, 1.20);
        this.tone(ctx, out, 110, 'sine', t,      0.15, 0.04, 0.35, 0.80);
        this.tone(ctx, out, 220, 'sine', t + 0.1, 0.07, 0.0, 0.20, 0.50);
        break;

      case 'game.stat-increase':
        this.tone(ctx, out, 660, 'sine', t,       0.10, 0.0, 0.04, 0.12);
        this.tone(ctx, out, 880, 'sine', t + 0.08, 0.08, 0.0, 0.03, 0.10);
        break;

      case 'game.stat-decrease':
        this.tone(ctx, out, 440, 'sine', t,       0.10, 0.0, 0.04, 0.10);
        this.tone(ctx, out, 330, 'sine', t + 0.07, 0.07, 0.0, 0.03, 0.10);
        break;

      case 'game.save':
        this.tone(ctx, out, 440, 'sine', t,       0.10, 0.0, 0.03, 0.08);
        this.tone(ctx, out, 554, 'sine', t + 0.09, 0.10, 0.0, 0.03, 0.08);
        this.tone(ctx, out, 660, 'sine', t + 0.18, 0.12, 0.0, 0.03, 0.14);
        break;

      case 'game.load':
        this.tone(ctx, out, 660, 'sine', t,       0.10, 0.0, 0.03, 0.08);
        this.tone(ctx, out, 554, 'sine', t + 0.09, 0.10, 0.0, 0.03, 0.08);
        this.tone(ctx, out, 440, 'sine', t + 0.18, 0.12, 0.0, 0.03, 0.14);
        break;

      case 'game.warning':
        for (let i = 0; i < 3; i++) {
          this.tone(ctx, out, 880, 'square', t + i * 0.13, 0.08, 0.0, 0.01, 0.06);
          this.tone(ctx, out, 440, 'square', t + i * 0.13 + 0.065, 0.06, 0.0, 0.01, 0.05);
        }
        break;

      case 'game.ending':
        this.tone(ctx, out, 55,  'sine', t,      0.35, 0.12, 1.80, 3.00);
        this.tone(ctx, out, 82,  'sine', t + 0.2, 0.18, 0.08, 1.40, 2.50);
        this.tone(ctx, out, 110, 'sine', t + 0.5, 0.09, 0.0,  0.80, 2.00);
        break;
    }
  }

  private tone(
    ctx: AudioContext,
    out: GainNode,
    freq: number,
    type: OscillatorType,
    start: number,
    peak: number,
    attack: number,
    sustain: number,
    release: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    if (attack > 0) {
      gain.gain.linearRampToValueAtTime(peak, start + attack);
    } else {
      gain.gain.setValueAtTime(peak, start);
    }
    gain.gain.setValueAtTime(peak, start + attack + sustain);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + sustain + release);
    osc.connect(gain);
    gain.connect(out);
    osc.start(start);
    osc.stop(start + attack + sustain + release + 0.05);
  }

  private noise(
    ctx: AudioContext,
    out: GainNode,
    start: number,
    peak: number,
    attack: number,
    release: number,
    filterFreq: number
  ) {
    const duration = attack + release;
    const bufferSize = Math.ceil(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 1.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    source.start(start);
    source.stop(start + duration + 0.05);
  }
}

export const soundManager = new SoundManager();
