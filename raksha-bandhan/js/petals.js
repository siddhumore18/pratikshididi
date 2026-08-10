/* ===================================
   Soft Dhaaga — Petal Fall System
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Petals = (function () {
  let container = null;
  let hasReleased = false;

  const PETAL_COUNT = 15;

  // Petal color palette (blush / dusty rose variants)
  const COLORS = [
    ['#F7DCD4', '#e8c4b8'],   // blush
    ['#D98E8E', '#c67a7a'],   // dusty rose
    ['#f0c4b8', '#daa090'],   // warm pink
    ['#e8b8a8', '#d4a090'],   // soft peach
    ['#d4a0a0', '#c08888'],   // muted rose
  ];

  function init() {
    container = document.getElementById('petals-container');
  }

  function release() {
    if (hasReleased || !container) return;
    hasReleased = true;

    // Haptic feedback
    SoftDhaaga.Haptics.reveal();

    // Create petals
    for (let i = 0; i < PETAL_COUNT; i++) {
      createPetal(i);
    }

    // Reveal "Happy Raksha Bandhan" after a short delay
    setTimeout(function () {
      const happyRb = document.getElementById('happy-rb');
      if (happyRb) {
        happyRb.classList.add('revealed');
      }
    }, 1200);
  }

  function createPetal(index) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    // Randomized properties
    const colorSet = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 15 + Math.random() * 12;
    const startX = 10 + Math.random() * 80; // % from left
    const delay = Math.random() * 1.5; // stagger
    const duration = 3 + Math.random() * 3;
    const drift = -40 + Math.random() * 80;
    const startRot = Math.random() * 360;
    const endRot = 120 + Math.random() * 240;
    const fallDistance = 70 + Math.random() * 20; // vh

    // Slightly elongated ellipse shape
    const scaleX = 0.6 + Math.random() * 0.4;

    petal.style.cssText = `
      left: ${startX}%;
      width: ${size}px;
      height: ${size * 1.3}px;
      background: linear-gradient(135deg, ${colorSet[0]}, ${colorSet[1]});
      transform: scaleX(${scaleX});
      --petal-x: ${drift}px;
      --petal-drift: ${drift * 0.5}px;
      --petal-start-rot: ${startRot}deg;
      --petal-end-rot: ${endRot}deg;
      --petal-fall-distance: ${fallDistance}vh;
      --petal-duration: ${duration}s;
      --petal-delay: ${delay}s;
      box-shadow: 0 2px 8px rgba(217, 142, 142, 0.2);
    `;

    // Add subtle vein line
    const vein = document.createElement('div');
    vein.style.cssText = `
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%) rotate(${-10 + Math.random() * 20}deg);
      width: 1px;
      height: 40%;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 1px;
    `;
    petal.appendChild(vein);

    container.appendChild(petal);

    // Remove petal after animation
    setTimeout(function () {
      petal.remove();
    }, (delay + duration) * 1000 + 100);
  }

  function hasBeenReleased() {
    return hasReleased;
  }

  function reset() {
    hasReleased = false;
    if (container) container.innerHTML = '';
  }

  return {
    init: init,
    release: release,
    hasBeenReleased: hasBeenReleased,
    reset: reset,
  };
})();
