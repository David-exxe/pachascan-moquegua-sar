// Synthesizes a tactical SAR radar wildfire warning chime using Web Audio API
// Zero external MP3 dependencies so live demos never fail offline.

let audioCtx = null;

export function playRadarAlarm() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const pulses = [
      { start: 0.0, freq: 880, duration: 0.14 },
      { start: 0.18, freq: 1174.66, duration: 0.14 },
      { start: 0.36, freq: 880, duration: 0.14 },
      { start: 0.56, freq: 1318.51, duration: 0.28 }
    ];

    pulses.forEach((pulse) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pulse.freq, now + pulse.start);

      gain.gain.setValueAtTime(0.001, now + pulse.start);
      gain.gain.exponentialRampToValueAtTime(0.18, now + pulse.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + pulse.start + pulse.duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + pulse.start);
      osc.stop(now + pulse.start + pulse.duration + 0.02);
    });
  } catch (err) {
    console.warn('Web Audio API alert blocked until user interaction:', err);
  }
}
