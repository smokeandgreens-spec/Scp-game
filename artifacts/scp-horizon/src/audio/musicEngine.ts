class MusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscNodes: OscillatorNode[] = [];
  private lfoNode: OscillatorNode | null = null;
  private isPlaying = false;
  private musicEnabled = true;
  private musicVolume = 40;

  /**
   * Set when suspendForTab() causes the context suspension.
   * Prevents resumeFromTab() from un-suspending a context that was
   * already suspended for a different reason (e.g. never started).
   */
  private suspendedByTab = false;

  private static readonly BASE_SCALE = 0.25;

  private init(): AudioContext | null {
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  setSettings(musicEnabled: boolean, musicVolume: number) {
    const wasEnabled = this.musicEnabled;
    this.musicEnabled = musicEnabled;
    this.musicVolume = musicVolume;

    if (this.masterGain && this.ctx) {
      const targetGain = musicEnabled ? (musicVolume / 100) * MusicEngine.BASE_SCALE : 0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
    }

    if (!wasEnabled && musicEnabled && !this.isPlaying) {
      this.start();
    } else if (wasEnabled && !musicEnabled && this.isPlaying) {
      this.fadeOut(false);
    }
  }

  start() {
    if (this.isPlaying) return;
    const ctx = this.init();
    if (!ctx) return;

    this.isPlaying = true;
    this.oscNodes = [];

    const targetGain = (this.musicVolume / 100) * MusicEngine.BASE_SCALE;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    filter.Q.value = 0.4;
    filter.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);

    this.addDroneLayer(ctx, filter, 41.2,  'sine', 0.55);
    this.addDroneLayer(ctx, filter, 82.4,  'sine', 0.40);
    this.addDroneLayer(ctx, filter, 123.5, 'sine', 0.10);
    this.addDroneLayer(ctx, filter, 218.0, 'sine', 0.18);
    this.addDroneLayer(ctx, filter, 222.0, 'sine', 0.18);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.035;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = targetGain * 0.20;
    lfo.connect(lfoGain);
    lfoGain.connect(this.masterGain.gain);
    lfo.start();
    this.lfoNode = lfo;

    if (this.musicEnabled) {
      this.masterGain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 4.0);
    }
  }

  stop() {
    this.fadeOut(true);
  }

  /** Instantly freeze the audio graph when the browser tab becomes hidden. */
  suspendForTab() {
    if (this.ctx && this.ctx.state === 'running') {
      this.suspendedByTab = true;
      this.ctx.suspend();
    }
  }

  /**
   * Resume the audio graph when the tab becomes visible again.
   * Only acts if suspendForTab() was the cause of the suspension.
   */
  resumeFromTab() {
    if (this.suspendedByTab && this.ctx) {
      this.suspendedByTab = false;
      this.ctx.resume();
    }
  }

  private fadeOut(cleanup: boolean) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const masterGain = this.masterGain;

    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);

    if (cleanup) {
      setTimeout(() => this.cleanup(), 2700);
    }
  }

  private cleanup() {
    this.oscNodes.forEach(osc => {
      try { osc.stop(); } catch { /* already stopped */ }
      try { osc.disconnect(); } catch { /* already disconnected */ }
    });
    if (this.lfoNode) {
      try { this.lfoNode.stop(); } catch { /* already stopped */ }
      try { this.lfoNode.disconnect(); } catch { /* already disconnected */ }
      this.lfoNode = null;
    }
    this.oscNodes = [];
    this.isPlaying = false;
  }

  private addDroneLayer(
    ctx: AudioContext,
    target: AudioNode,
    freq: number,
    type: OscillatorType,
    gainValue: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(target);
    osc.start();
    this.oscNodes.push(osc);
  }
}

export const musicEngine = new MusicEngine();
