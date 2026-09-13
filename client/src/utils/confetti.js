import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.75 },
    colors: ['#fbbf24', '#a855f7', '#38bdf8', '#4ade80'],
    disableForReducedMotion: true,
  });
};

export const triggerLevelUpBurst = () => {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#fbbf24', '#eab308', '#a855f7', '#ec4899', '#38bdf8'];

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
