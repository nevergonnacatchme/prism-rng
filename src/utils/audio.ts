import { RarityTier } from '../types/rng';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext error safeguard
    }
  }

  public playRollShimmer() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(840, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  public playDrop(rarity: RarityTier) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    try {
      switch (rarity) {
        case 'Common': {
          // Soft woody pop
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.13);
          break;
        }

        case 'Uncommon': {
          // Bright two-tone chime
          [523.25, 659.25].forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.07);

            gain.gain.setValueAtTime(0.14, t + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(t + idx * 0.07);
            osc.stop(t + idx * 0.07 + 0.22);
          });
          break;
        }

        case 'Rare': {
          // Major triad chime (C - E - G)
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.08);

            gain.gain.setValueAtTime(0.18, t + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(t + idx * 0.08);
            osc.stop(t + idx * 0.08 + 0.38);
          });
          break;
        }

        case 'Epic': {
          // Rich purple chord with sparkle
          [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.06);

            gain.gain.setValueAtTime(0.18, t + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(t + idx * 0.06);
            osc.stop(t + idx * 0.06 + 0.55);
          });
          break;
        }

        case 'Legendary': {
          // Heroic brass-like fanfare
          const notes = [392, 523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.09);

            gain.gain.setValueAtTime(0.22, t + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.7);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(t + idx * 0.09);
            osc.stop(t + idx * 0.09 + 0.75);
          });
          break;
        }

        case 'Mythic':
        case 'Celestial':
        case 'Transcendent': {
          // Cosmic harmonic choir with arpeggio and low sub-bass pulse
          // Sub bass pulse
          const sub = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(65.41, t); // C2
          sub.frequency.exponentialRampToValueAtTime(130.81, t + 0.4);
          subGain.gain.setValueAtTime(0.3, t);
          subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
          sub.connect(subGain);
          subGain.connect(this.ctx.destination);
          sub.start(t);
          sub.stop(t + 0.95);

          // Celestial ascending arpeggio
          const harmonics = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98];
          harmonics.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.08);

            gain.gain.setValueAtTime(0.2, t + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.9);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(t + idx * 0.08);
            osc.stop(t + idx * 0.08 + 0.95);
          });
          break;
        }
      }
    } catch {}
  }

  public playEquip() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  public playCoin() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // --- Combat Battle Sounds ---
  public playDing(comboStep: number = 1) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const harmonic = this.ctx.createOscillator();
      const harmonicGain = this.ctx.createGain();

      // Escalating pitch based on 4-hit combo step
      const baseFreqs = [1760, 1975.5, 2217.4, 2637];
      const selectedFreq = baseFreqs[Math.min(3, Math.max(0, comboStep - 1))];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedFreq, now);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (comboStep === 4 ? 0.5 : 0.28));

      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(selectedFreq * 2, now);
      harmonicGain.gain.setValueAtTime(0.09, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(this.ctx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + (comboStep === 4 ? 0.52 : 0.3));
      harmonic.stop(now + 0.22);

      // Heavy 4th hit finisher sub-bass impact
      if (comboStep === 4) {
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'triangle';
        sub.frequency.setValueAtTime(140, now);
        sub.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        subGain.gain.setValueAtTime(0.3, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        sub.connect(subGain);
        subGain.connect(this.ctx.destination);
        sub.start(now);
        sub.stop(now + 0.26);
      }
    } catch {}
  }

  public playDash() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playRareAlert() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.42);
      });
    } catch {}
  }

  public playPotionDrink() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  public playHit() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  public playCrit() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  public playAbility() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [440, 660, 880, 1320].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.15, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.28);
      });
    } catch {}
  }

  public playBossUltimate() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(60, t + 0.6);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.7);
    } catch {}
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);
        gain.gain.setValueAtTime(0.2, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + 0.55);
      });
    } catch {}
  }

  public playDefeat() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [330, 293.66, 261.63, 220].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.14);
        gain.gain.setValueAtTime(0.16, t + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.14 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.14);
        osc.stop(t + idx * 0.14 + 0.45);
      });
    } catch {}
  }

  // Cinematic Cutscene Sounds
  public playCutsceneDarkness() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Deep sub-bass heartbeat/drone
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, t);
      sub.frequency.exponentialRampToValueAtTime(32, t + 2.5);

      subGain.gain.setValueAtTime(0.35, t);
      subGain.gain.exponentialRampToValueAtTime(0.01, t + 2.5);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(t);
      sub.stop(t + 2.6);
    } catch {}
  }

  public playWhiteoutFlash() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Whiteout blast: chord of celestial harmonic frequencies
      const frequencies = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 1.2);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 1.85);
      });
    } catch {}
  }

  public playTemporalFreeze() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 1.5);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.55);
    } catch {}
  }

  public playAnimeSlashCut() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // 1. High-frequency slicing noise burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.25);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);

      // 2. Metallic blade ringing ping
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1864.66, t + 0.04); // A#6
      pingGain.gain.setValueAtTime(0.25, t + 0.04);
      pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(t + 0.04);
      ping.stop(t + 0.85);
    } catch {}
  }

  public playDivineTrumpets() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Majestic chord: C5 - E5 - G5 - C6 with brass warmth
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.2, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 1.45);
      });
    } catch {}
  }

  public playSupernovaBlast() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      [80, 160, 320, 640, 1280].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 2, t + 0.8);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 1.65);
      });
    } catch {}
  }

  // --- Amour Plastique Music Player ---
  private musicAudio: HTMLAudioElement | null = null;
  private activeMusicOscillators: OscillatorNode[] = [];
  private masterMusicGain: GainNode | null = null;
  private stopMusicTimeout: number | null = null;
  private synthLoopTimeout: number | null = null;

  public isMusicPlaying(): boolean {
    if (this.musicAudio && !this.musicAudio.paused) return true;
    return this.activeMusicOscillators.length > 0;
  }

  public stopMusic() {
    if (this.stopMusicTimeout) {
      clearTimeout(this.stopMusicTimeout);
      this.stopMusicTimeout = null;
    }
    if (this.synthLoopTimeout) {
      clearTimeout(this.synthLoopTimeout);
      this.synthLoopTimeout = null;
    }

    // 1. Fade out and stop HTML5 audio
    if (this.musicAudio) {
      const a = this.musicAudio;
      this.musicAudio = null;
      try {
        let vol = a.volume;
        const interval = setInterval(() => {
          vol -= 0.15;
          if (vol <= 0.05) {
            clearInterval(interval);
            try {
              a.pause();
              a.currentTime = 0;
            } catch {}
          } else {
            try {
              a.volume = Math.max(0, vol);
            } catch {}
          }
        }, 40);
      } catch {}
    }

    // 2. Stop Web Audio synth
    if (this.ctx && this.masterMusicGain) {
      const oldGain = this.masterMusicGain;
      const oldOscs = [...this.activeMusicOscillators];
      this.masterMusicGain = null;
      this.activeMusicOscillators = [];

      try {
        oldGain.gain.setValueAtTime(oldGain.gain.value, this.ctx.currentTime);
        oldGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {}

      this.stopMusicTimeout = window.setTimeout(() => {
        oldOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
      }, 350);
    }
  }

  public playAmourPlastique() {
    if (!this.enabled) return;
    this.stopMusic();

    // 1. Try HTML5 Audio element with real MP3 track
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio('/amour_plastique.mp3');
        audio.loop = true;
        audio.volume = 0.85;
        this.musicAudio = audio;

        const p = audio.play();
        if (p !== undefined) {
          p.then(() => {
            // HTML5 audio started playing successfully!
          }).catch((err) => {
            console.warn('HTML5 Audio autoplay restricted or failed, falling back to Web Audio synth:', err);
            this.playAmourPlastiqueSynth();
          });
          return;
        }
      } catch (err) {
        console.warn('Audio tag failed:', err);
      }
    }

    // 2. Web Audio synthesizer fallback
    this.playAmourPlastiqueSynth();
  }

  private playAmourPlastiqueSynth() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime + 0.05;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.28, t);
      master.connect(this.ctx.destination);
      this.masterMusicGain = master;

      const N: Record<string, number> = {
        D3: 146.83,
        E3: 164.81,
        Fsharp3: 185.0,
        G3: 196.0,
        A3: 220.0,
        B3: 246.94,
        Csharp4: 277.18,
        D4: 293.66,
        E4: 329.63,
        Fsharp4: 369.99,
        G4: 392.0,
        A4: 440.0,
        B4: 493.88,
        Csharp5: 554.37,
        D5: 587.33,
        E5: 659.25,
        Fsharp5: 739.99,
        G5: 783.99,
        A5: 880.0,
        B5: 987.77,
      };

      const playNote = (
        freq: number,
        startOffset: number,
        duration: number,
        vol = 0.25,
        type: OscillatorType = 'sawtooth'
      ) => {
        if (!this.ctx || !this.masterMusicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t + startOffset);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, t + startOffset);
        filter.frequency.linearRampToValueAtTime(1000, t + startOffset + duration);

        gain.gain.setValueAtTime(0.001, t + startOffset);
        gain.gain.linearRampToValueAtTime(vol, t + startOffset + 0.04);
        gain.gain.setValueAtTime(vol * 0.85, t + startOffset + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + startOffset + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        osc.start(t + startOffset);
        osc.stop(t + startOffset + duration + 0.05);

        this.activeMusicOscillators.push(osc);
      };

      const playBass = (freq: number, startOffset: number, duration: number) => {
        if (!this.ctx || !this.masterMusicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + startOffset);
        gain.gain.setValueAtTime(0.3, t + startOffset);
        gain.gain.linearRampToValueAtTime(0.001, t + startOffset + duration);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t + startOffset);
        osc.stop(t + startOffset + duration + 0.05);
        this.activeMusicOscillators.push(osc);
      };

      // Synth Bass Progression (Bm -> G -> D -> A)
      const bassProg = [
        { freq: 123.47, start: 0.0, dur: 3.2 },
        { freq: 98.0, start: 3.2, dur: 3.2 },
        { freq: 146.83, start: 6.4, dur: 3.2 },
        { freq: 110.0, start: 9.6, dur: 3.2 },
      ];
      bassProg.forEach((b) => playBass(b.freq, b.start, b.dur));

      // Iconic Amour Plastique Lead Melody
      const melody = [
        { f: N.Fsharp4, s: 0.0, d: 0.28 },
        { f: N.A4, s: 0.32, d: 0.28 },
        { f: N.B4, s: 0.64, d: 0.4 },
        { f: N.D5, s: 1.08, d: 0.36 },
        { f: N.Csharp5, s: 1.48, d: 0.36 },
        { f: N.B4, s: 1.88, d: 1.1 },

        { f: N.A4, s: 3.2, d: 0.35 },
        { f: N.Fsharp4, s: 3.6, d: 0.45 },
        { f: N.E4, s: 4.1, d: 0.45 },
        { f: N.Fsharp4, s: 4.6, d: 1.2 },

        { f: N.Fsharp4, s: 6.4, d: 0.28 },
        { f: N.A4, s: 6.72, d: 0.28 },
        { f: N.B4, s: 7.04, d: 0.4 },
        { f: N.D5, s: 7.48, d: 0.36 },
        { f: N.Csharp5, s: 7.88, d: 0.36 },
        { f: N.B4, s: 8.28, d: 1.1 },

        { f: N.A4, s: 9.6, d: 0.35 },
        { f: N.B4, s: 10.0, d: 0.45 },
        { f: N.Csharp5, s: 10.5, d: 0.45 },
        { f: N.B4, s: 11.0, d: 1.4 },
      ];

      melody.forEach((m) => {
        playNote(m.f, m.s, m.d, 0.26, 'sawtooth');
        playNote(m.f * 1.003, m.s, m.d, 0.16, 'square');
      });

      // Loop synthesizer playback after 14 seconds
      this.synthLoopTimeout = window.setTimeout(() => {
        if (this.masterMusicGain) {
          this.playAmourPlastiqueSynth();
        }
      }, 13500);
    } catch {}
  }
}

export const sound = new SoundEngine();
