// Moteur Audio & Haptique Procédural Ultra-Léger (Web Audio API & Vibration API)

let audioCtx = null;
let soundEnabled = true;
let hapticEnabled = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function isHapticEnabled() {
  return hapticEnabled;
}

export function toggleSound(enabled) {
  soundEnabled = enabled;
}

export function toggleHaptic(enabled) {
  hapticEnabled = enabled;
}

export function triggerHaptic(duration = 20) {
  if (!hapticEnabled) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignorer si vibration non autorisée
    }
  }
}

// 1. Clic tactile standard de bouton UI
export function playClickSound() {
  if (!soundEnabled) return;
  triggerHaptic(15);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Web Audio non supporté
  }
}

// 2. Interrupteur Toggle (ON / OFF)
export function playToggleSound(isOn = true) {
  if (!soundEnabled) return;
  triggerHaptic(20);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (isOn) {
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.06);
    } else {
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.06);
    }

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Web Audio non supporté
  }
}

// 3. Pose de tuile en bois (Tock)
export function playTileSound() {
  if (!soundEnabled) return;
  triggerHaptic(25);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {
    // Web Audio non supporté
  }
}

// 4. Carillon doré pour les couronnes 👑
export function playCrownSound() {
  if (!soundEnabled) return;
  triggerHaptic(35);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.03);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.03 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.03);
      osc.stop(ctx.currentTime + idx * 0.03 + 0.12);
    });
  } catch {
    // Web Audio non supporté
  }
}

// 5. Tirage de dé / Mélange de cartes 🎲
export function playDiceSound() {
  if (!soundEnabled) return;
  triggerHaptic(40);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const rattleTimes = [0, 0.05, 0.1, 0.16, 0.22];
    rattleTimes.forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const freq = 180 + (i * 35);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + t + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.04);
    });
  } catch {
    // Web Audio non supporté
  }
}

// 6. Fanfare royale de victoire pour le podium 🎺
export function playFanfareSound() {
  if (!soundEnabled) return;
  triggerHaptic([50, 50, 50, 50, 100]);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const melody = [
      { note: 523.25, duration: 0.12, time: 0 },       // C5
      { note: 659.25, duration: 0.12, time: 0.14 },    // E5
      { note: 783.99, duration: 0.14, time: 0.28 },    // G5
      { note: 1046.50, duration: 0.38, time: 0.44 }    // C6
    ];

    melody.forEach(({ note, duration, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch {
    // Web Audio non supporté
  }
}
