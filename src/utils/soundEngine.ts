// Real-time Web Audio API Sound Synthesizer for zero-latency tactile feedback

export type SoundEffectType =
  | 'squeak_hammer'
  | 'metal_pan'
  | 'wood_bat'
  | 'slap_swatter'
  | 'splat_wet'
  | 'shatter_glass'
  | 'shatter_ceramic'
  | 'shout_slam'
  | 'electric_zap'
  | 'water_splash'
  | 'tape_seal'
  | 'zipper_lock'
  | 'machine_gun'
  | 'shotgun_blast'
  | 'laser_zap'
  | 'freeze_blast'
  | 'ultimate_blast'
  | 'fire_ignite'
  | 'shredder_grind'
  | 'calm_chime';

class CatharsisSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeLoopStop: (() => void) | null = null;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.activeLoopStop) {
      this.activeLoopStop();
      this.activeLoopStop = null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public play(effect: SoundEffectType) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (effect) {
      case 'squeak_hammer': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1450, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
        break;
      }

      case 'metal_pan': {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(150, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.22);
        subGain.gain.setValueAtTime(0.5, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.25);

        const freqs = [540, 825, 1180, 1690];
        freqs.forEach((f, idx) => {
          const mOsc = ctx.createOscillator();
          const mGain = ctx.createGain();
          mOsc.type = idx % 2 === 0 ? 'square' : 'sawtooth';
          mOsc.frequency.setValueAtTime(f + (Math.random() * 25 - 12), now);
          mGain.gain.setValueAtTime(0.12 / (idx + 1), now);
          mGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.35);
          mOsc.connect(mGain);
          mGain.connect(ctx.destination);
          mOsc.start(now);
          mOsc.stop(now + 0.36);
        });
        break;
      }

      case 'wood_bat': {
        const punch = ctx.createOscillator();
        const punchGain = ctx.createGain();
        punch.type = 'sine';
        punch.frequency.setValueAtTime(190, now);
        punch.frequency.exponentialRampToValueAtTime(48, now + 0.16);
        punchGain.gain.setValueAtTime(0.55, now);
        punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        punch.connect(punchGain);
        punchGain.connect(ctx.destination);
        punch.start(now);
        punch.stop(now + 0.18);

        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(ctx, 0.12);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1250, now);
        filter.Q.setValueAtTime(2.5, now);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.45, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);
        break;
      }

      case 'slap_swatter': {
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(ctx, 0.09);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        break;
      }

      case 'splat_wet': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.18);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);
        filter.frequency.exponentialRampToValueAtTime(220, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);

        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(ctx, 0.16);
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(650, now);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.32, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);
        break;
      }

      case 'shatter_ceramic':
      case 'shatter_glass': {
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(ctx, 0.25);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(effect === 'shatter_glass' ? 2200 : 1400, now);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.42, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(now);

        const shardCount = 7;
        for (let i = 0; i < shardCount; i++) {
          const delay = i * 0.028 + Math.random() * 0.02;
          const sOsc = ctx.createOscillator();
          const sGain = ctx.createGain();
          sOsc.type = 'sine';
          const baseFreq = effect === 'shatter_glass' ? 2600 : 1700;
          sOsc.frequency.setValueAtTime(baseFreq + Math.random() * 2200, now + delay);
          sGain.gain.setValueAtTime(0.14 * (1 - i / shardCount), now + delay);
          sGain.gain.exponentialRampToValueAtTime(0.0005, now + delay + 0.12);
          sOsc.connect(sGain);
          sGain.connect(ctx.destination);
          sOsc.start(now + delay);
          sOsc.stop(now + delay + 0.13);
        }
        break;
      }

      case 'electric_zap': {
        // High-voltage crackling buzz + rapid frequency modulation
        for (let i = 0; i < 6; i++) {
          const offset = i * 0.055;
          const zapOsc = ctx.createOscillator();
          const zapGain = ctx.createGain();
          zapOsc.type = i % 2 === 0 ? 'sawtooth' : 'square';
          zapOsc.frequency.setValueAtTime(140 + Math.random() * 680, now + offset);
          zapOsc.frequency.linearRampToValueAtTime(90 + Math.random() * 1200, now + offset + 0.05);
          zapGain.gain.setValueAtTime(0.28, now + offset);
          zapGain.gain.exponentialRampToValueAtTime(0.005, now + offset + 0.055);
          zapOsc.connect(zapGain);
          zapGain.connect(ctx.destination);
          zapOsc.start(now + offset);
          zapOsc.stop(now + offset + 0.06);
        }

        // Electric arc noise burst
        const arcNoise = ctx.createBufferSource();
        arcNoise.buffer = this.createNoiseBuffer(ctx, 0.36);
        const arcFilter = ctx.createBiquadFilter();
        arcFilter.type = 'bandpass';
        arcFilter.frequency.setValueAtTime(2400, now);
        arcFilter.Q.setValueAtTime(1.8, now);
        const arcGain = ctx.createGain();
        arcGain.gain.setValueAtTime(0.38, now);
        arcGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        arcNoise.connect(arcFilter);
        arcFilter.connect(arcGain);
        arcGain.connect(ctx.destination);
        arcNoise.start(now);
        break;
      }

      case 'water_splash': {
        // Bubbling water splash sound
        const splashNoise = ctx.createBufferSource();
        splashNoise.buffer = this.createNoiseBuffer(ctx, 0.45);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(420, now);
        filter.frequency.exponentialRampToValueAtTime(1100, now + 0.4);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
        splashNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        splashNoise.start(now);

        // 5 bubble bloops
        for (let i = 0; i < 5; i++) {
          const bTime = now + i * 0.065;
          const bOsc = ctx.createOscillator();
          const bGain = ctx.createGain();
          bOsc.type = 'sine';
          const f = 320 + i * 95;
          bOsc.frequency.setValueAtTime(f, bTime);
          bOsc.frequency.exponentialRampToValueAtTime(f * 1.9, bTime + 0.055);
          bGain.gain.setValueAtTime(0.16, bTime);
          bGain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.06);
          bOsc.connect(bGain);
          bGain.connect(ctx.destination);
          bOsc.start(bTime);
          bOsc.stop(bTime + 0.065);
        }
        break;
      }

      case 'tape_seal': {
        // Duct tape rip + firm slap across mouth
        const ripNoise = ctx.createBufferSource();
        ripNoise.buffer = this.createNoiseBuffer(ctx, 0.22);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.linearRampToValueAtTime(3200, now + 0.14);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.42, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
        ripNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        ripNoise.start(now);
        break;
      }

      case 'zipper_lock': {
        // Rapid metallic zip teeth + lock click
        for (let i = 0; i < 8; i++) {
          const t = now + i * 0.022;
          const zOsc = ctx.createOscillator();
          const zGain = ctx.createGain();
          zOsc.type = 'triangle';
          zOsc.frequency.setValueAtTime(900 + i * 180, t);
          zGain.gain.setValueAtTime(0.18, t);
          zGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
          zOsc.connect(zGain);
          zGain.connect(ctx.destination);
          zOsc.start(t);
          zOsc.stop(t + 0.022);
        }
        break;
      }

      case 'machine_gun': {
        // Crisp punchy gunshot crack + brass shell ping
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(220, now);
        popOsc.frequency.exponentialRampToValueAtTime(45, now + 0.075);
        popGain.gain.setValueAtTime(0.45, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        popOsc.connect(popGain);
        popGain.connect(ctx.destination);
        popOsc.start(now);
        popOsc.stop(now + 0.085);

        const crackNoise = ctx.createBufferSource();
        crackNoise.buffer = this.createNoiseBuffer(ctx, 0.07);
        const crackFilter = ctx.createBiquadFilter();
        crackFilter.type = 'bandpass';
        crackFilter.frequency.setValueAtTime(1850, now);
        crackFilter.Q.setValueAtTime(1.4, now);
        const crackGain = ctx.createGain();
        crackGain.gain.setValueAtTime(0.48, now);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.068);
        crackNoise.connect(crackFilter);
        crackFilter.connect(crackGain);
        crackGain.connect(ctx.destination);
        crackNoise.start(now);
        break;
      }

      case 'shotgun_blast': {
        // Heavy boom + wide scatter noise
        const boomOsc = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(140, now);
        boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.28);
        boomGain.gain.setValueAtTime(0.65, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        boomOsc.connect(boomGain);
        boomGain.connect(ctx.destination);
        boomOsc.start(now);
        boomOsc.stop(now + 0.31);

        const blastNoise = ctx.createBufferSource();
        blastNoise.buffer = this.createNoiseBuffer(ctx, 0.26);
        const blastFilter = ctx.createBiquadFilter();
        blastFilter.type = 'lowpass';
        blastFilter.frequency.setValueAtTime(1600, now);
        blastFilter.frequency.exponentialRampToValueAtTime(240, now + 0.25);
        const blastGain = ctx.createGain();
        blastGain.gain.setValueAtTime(0.55, now);
        blastGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        blastNoise.connect(blastFilter);
        blastFilter.connect(blastGain);
        blastGain.connect(ctx.destination);
        blastNoise.start(now);
        break;
      }

      case 'laser_zap': {
        // High-energy sci-fi sniper beam sweep
        const beamOsc = ctx.createOscillator();
        const beamGain = ctx.createGain();
        beamOsc.type = 'sawtooth';
        beamOsc.frequency.setValueAtTime(1950, now);
        beamOsc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
        beamGain.gain.setValueAtTime(0.38, now);
        beamGain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
        beamOsc.connect(beamGain);
        beamGain.connect(ctx.destination);
        beamOsc.start(now);
        beamOsc.stop(now + 0.24);
        break;
      }

      case 'freeze_blast': {
        // Crystalline ice shatter + sub-zero wind whoosh
        const iceNoise = ctx.createBufferSource();
        iceNoise.buffer = this.createNoiseBuffer(ctx, 0.28);
        const iceFilter = ctx.createBiquadFilter();
        iceFilter.type = 'highpass';
        iceFilter.frequency.setValueAtTime(2400, now);
        const iceGain = ctx.createGain();
        iceGain.gain.setValueAtTime(0.35, now);
        iceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
        iceNoise.connect(iceFilter);
        iceFilter.connect(iceGain);
        iceGain.connect(ctx.destination);
        iceNoise.start(now);

        const chimes = [2400, 3100, 3850, 4400];
        chimes.forEach((f, idx) => {
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = 'sine';
          cOsc.frequency.setValueAtTime(f, now + idx * 0.03);
          cGain.gain.setValueAtTime(0.14, now + idx * 0.03);
          cGain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.03 + 0.14);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + idx * 0.03);
          cOsc.stop(now + idx * 0.03 + 0.15);
        });
        break;
      }

      case 'shout_slam': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.32);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'ultimate_blast': {
        for (let i = 0; i < 5; i++) {
          const offset = i * 0.14;
          const noise = ctx.createBufferSource();
          noise.buffer = this.createNoiseBuffer(ctx, 0.45);
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(850 - i * 80, now + offset);
          filter.frequency.exponentialRampToValueAtTime(80, now + offset + 0.42);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.5, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.44);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now + offset);
        }
        break;
      }

      case 'calm_chime': {
        const notes = [432, 540, 648];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.08 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.85);
        });
        break;
      }

      default:
        break;
    }
  }

  public playDestructionSound(mode: 'fire' | 'shredder', durationMs: number = 3200) {
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.activeLoopStop) {
      this.activeLoopStop();
      this.activeLoopStop = null;
    }

    const now = ctx.currentTime;
    const durationSec = durationMs / 1000;

    if (mode === 'fire') {
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(ctx, durationSec);

      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(340, now);

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      rumbleGain.gain.setValueAtTime(0.35, now + durationSec - 0.6);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      noise.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      noise.start(now);

      for (let i = 0; i < 28; i++) {
        const popTime = now + Math.random() * (durationSec - 0.3);
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(1200 + Math.random() * 2400, popTime);
        popGain.gain.setValueAtTime(0.12, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.035);
        popOsc.connect(popGain);
        popGain.connect(ctx.destination);
        popOsc.start(popTime);
        popOsc.stop(popTime + 0.04);
      }

      this.activeLoopStop = () => {
        try {
          noise.stop();
        } catch {
          // ignore
        }
      };
    } else {
      const motorOsc = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.setValueAtTime(92, now);
      motorOsc.frequency.setValueAtTime(84, now + 0.5);
      motorOsc.frequency.setValueAtTime(90, now + 1.5);
      motorOsc.frequency.setValueAtTime(82, now + 2.2);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = 'lowpass';
      motorFilter.frequency.setValueAtTime(260, now);

      motorGain.gain.setValueAtTime(0.01, now);
      motorGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
      motorGain.gain.setValueAtTime(0.22, now + durationSec - 0.4);
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      motorOsc.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(ctx.destination);
      motorOsc.start(now);
      motorOsc.stop(now + durationSec);

      const tearNoise = ctx.createBufferSource();
      tearNoise.buffer = this.createNoiseBuffer(ctx, durationSec);
      const tearFilter = ctx.createBiquadFilter();
      tearFilter.type = 'bandpass';
      tearFilter.frequency.setValueAtTime(1600, now);
      tearFilter.Q.setValueAtTime(1.2, now);

      const tearGain = ctx.createGain();
      tearGain.gain.setValueAtTime(0.26, now);
      tearGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      tearNoise.connect(tearFilter);
      tearFilter.connect(tearGain);
      tearGain.connect(ctx.destination);
      tearNoise.start(now);

      this.activeLoopStop = () => {
        try {
          motorOsc.stop();
          tearNoise.stop();
        } catch {
          // ignore
        }
      };
    }
  }
}

export const soundEngine = new CatharsisSoundEngine();
