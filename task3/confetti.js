// confetti.js
function confetti() {
    const end = Date.now() + 1000;
  
    const colors = ['#bb0000', '#ffffff'];
  
    (function frame() {
      window.requestAnimationFrame(frame);
  
      const timeLeft = end - Date.now();
  
      if (timeLeft <= 0) return;
  
      const count = 200 * (timeLeft / 1000);
      confettiLib({
        particleCount: count,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: colors
      });
    })();
  }
  
  // Load canvas-confetti from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
  script.onload = () => window.confettiLib = window.confetti;
  document.head.appendChild(script);
  