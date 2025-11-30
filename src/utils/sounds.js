// Sound effects for the Telugu Tutor app
// Using Web Audio API for cross-browser compatibility

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Generate a pleasant success sound (with variations)
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Random variation for success sounds
    const variation = Math.random();
    let frequencies;
    let types;
    
    if (variation < 0.4) {
      // C Major chord (original)
      frequencies = [523.25, 659.25, 783.99];
      types = ['sine', 'sine', 'sine'];
    } else if (variation < 0.7) {
      // G Major chord
      frequencies = [392.00, 493.88, 587.33];
      types = ['triangle', 'sine', 'sine'];
    } else {
      // F Major chord
      frequencies = [349.23, 440.00, 523.25];
      types = ['sine', 'triangle', 'sine'];
    }
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = types[index];
      oscillator.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + index * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + index * 0.08 + 0.35);
      
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + index * 0.08 + 0.45);
    });
  }

  // Generate an error/wrong sound (with variations)
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Random variation for error sounds
    const variation = Math.random();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = variation < 0.5 ? 'sine' : 'sawtooth';
    
    if (variation < 0.5) {
      // Lower pitch buzz
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.linearRampToValueAtTime(150, now + 0.15);
    } else {
      // Mid pitch buzz
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.linearRampToValueAtTime(200, now + 0.15);
    }
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }

  // Generate a star collection sound (with variations)
  playStar() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Random variation
    const variation = Math.random();
    const baseFreq = 800 + Math.random() * 200; // 800-1000Hz base
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = variation < 0.6 ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(baseFreq, now);
    oscillator.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.12);
    
    oscillator.start(now);
    oscillator.stop(now + 0.12);
  }

  // Generate a celebration fanfare (with variations)
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Fanfare notes with variation
    const variation = Math.random();
    let notes;
    
    if (variation < 0.33) {
      // C Major ascending (original)
      notes = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.15 },
        { freq: 783.99, time: 0.3 },
        { freq: 1046.50, time: 0.45 }
      ];
    } else if (variation < 0.66) {
      // G Major ascending
      notes = [
        { freq: 392.00, time: 0 },
        { freq: 493.88, time: 0.15 },
        { freq: 587.33, time: 0.3 },
        { freq: 784.00, time: 0.45 }
      ];
    } else {
      // F Major ascending
      notes = [
        { freq: 349.23, time: 0 },
        { freq: 440.00, time: 0.15 },
        { freq: 523.25, time: 0.3 },
        { freq: 698.46, time: 0.45 }
      ];
    }
    
    notes.forEach(({ freq, time }, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = index % 2 === 0 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(freq, now + time);
      
      gainNode.gain.setValueAtTime(0, now + time);
      gainNode.gain.linearRampToValueAtTime(0.12, now + time + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.08, now + time + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + time + 0.4);
      
      oscillator.start(now + time);
      oscillator.stop(now + time + 0.5);
    });
  }

  // Click/tap sound (with variations)
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Random variation for subtle differences
    const variation = Math.random();
    const freq = 500 + variation * 200; // 500-700Hz

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now);
    
    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.04);
    
    oscillator.start(now);
    oscillator.stop(now + 0.04);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
