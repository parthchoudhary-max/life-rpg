/**
 * 8-Bit Chiptune Sound Synthesizer via HTML5 Web Audio API
 * Generates authentic retro square/triangle sound effects on-the-fly without external audio assets.
 */

class RetroSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.volume = 0.4;
  }

  // Lazy initialize AudioContext upon first user interaction
  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Create oscillator with gain envelope
  playTone(freq, type = 'square', duration = 0.1, delay = 0, gainLevel = 0.3) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const startTime = this.audioCtx.currentTime + delay;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const peakGain = gainLevel * this.volume;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  }

  // 1. Level-Up Victory Fanfare (Triumphant ascending 8-bit arpeggio)
  playLevelUp() {
    if (this.isMuted) return;
    const notes = [
      { freq: 261.63, dur: 0.12, delay: 0 },       // C4
      { freq: 329.63, dur: 0.12, delay: 0.1 },     // E4
      { freq: 392.00, dur: 0.12, delay: 0.2 },     // G4
      { freq: 523.25, dur: 0.16, delay: 0.3 },     // C5
      { freq: 392.00, dur: 0.10, delay: 0.45 },    // G4
      { freq: 523.25, dur: 0.35, delay: 0.55 },    // C5 (Hold)
      { freq: 659.25, dur: 0.45, delay: 0.70 },    // E5 (Triumph)
    ];

    notes.forEach((n) => {
      this.playTone(n.freq, 'square', n.dur, n.delay, 0.35);
    });
  }

  // 2. Quest Complete (Crisp reward chime)
  playQuestComplete() {
    if (this.isMuted) return;
    this.playTone(523.25, 'triangle', 0.12, 0, 0.4);      // C5
    this.playTone(659.25, 'triangle', 0.12, 0.08, 0.4);   // E5
    this.playTone(783.99, 'square', 0.25, 0.16, 0.35);    // G5
  }

  // 3. Coin Clink (High crystal ding)
  playCoinSound() {
    if (this.isMuted) return;
    this.playTone(987.77, 'square', 0.08, 0, 0.3);        // B5
    this.playTone(1318.51, 'square', 0.20, 0.06, 0.35);   // E6
  }

  // 4. Combat / Habit Negative Hit (Low pitch crash)
  playDamageSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const startTime = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.25);

      gain.gain.setValueAtTime(0.4 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    } catch (e) {
      console.warn('Damage sound notice:', e);
    }
  }

  // 5. Consuming Potion (Ascending liquid bubble)
  playPotionSound() {
    if (this.isMuted) return;
    const freqs = [350, 440, 520, 680, 800];
    freqs.forEach((f, idx) => {
      this.playTone(f, 'sine', 0.08, idx * 0.05, 0.35);
    });
  }

  // 6. Equip Weapon / Armor (Mechanical latch click)
  playEquipSound() {
    if (this.isMuted) return;
    this.playTone(400, 'square', 0.04, 0, 0.25);
    this.playTone(800, 'square', 0.08, 0.04, 0.3);
  }

  // 7. Beveled Button Click
  playButtonClick() {
    if (this.isMuted) return;
    this.playTone(600, 'square', 0.03, 0, 0.15);
  }
}

export const soundEngine = new RetroSoundEngine();
export default soundEngine;
