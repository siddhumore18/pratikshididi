/* ===================================
   Soft Dhaaga — Floating Particles
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Particles = (function () {
  let container = null;
  let particles = [];
  let animFrameId = null;
  let isActive = false;
  let tiltX = 0;
  let tiltY = 0;

  const PARTICLE_COUNT = 25;

  function init() {
    container = document.getElementById('particles-container');
    if (!container) return;

    createParticles();
    startTiltListener();
    isActive = true;
  }

  function createParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';

      const size = 2 + Math.random() * 3;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const opacity = 0.2 + Math.random() * 0.3;
      const drift = -30 + Math.random() * 60;
      const duration = 12 + Math.random() * 18;
      const delay = Math.random() * duration;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        top: ${startY}%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(203, 163, 92, ${opacity + 0.1}), rgba(203, 163, 92, ${opacity * 0.5}));
        box-shadow: 0 0 ${size + 2}px rgba(203, 163, 92, ${opacity * 0.4});
        pointer-events: none;
        will-change: transform, opacity;
        --p-opacity: ${opacity};
        --p-drift: ${drift}px;
        animation: particleFloat ${duration}s linear ${delay}s infinite, particleGlow ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite;
        z-index: 0;
      `;

      container.appendChild(particle);
      particles.push({
        el: particle,
        baseX: startX,
        baseY: startY,
      });
    }
  }

  function startTiltListener() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma !== null && e.beta !== null) {
          // Clamp values
          tiltX = Math.max(-15, Math.min(15, e.gamma)) / 15; // -1 to 1
          tiltY = Math.max(-15, Math.min(15, e.beta - 45)) / 15; // -1 to 1 (45° is neutral hold angle)
          applyTilt();
        }
      }, { passive: true });
    }
  }

  function applyTilt() {
    if (!isActive) return;

    particles.forEach(function (p, i) {
      const offsetX = tiltX * (3 + (i % 5));
      const offsetY = tiltY * (2 + (i % 4));
      p.el.style.marginLeft = offsetX + 'px';
      p.el.style.marginTop = offsetY + 'px';
    });
  }

  function pause() {
    isActive = false;
    if (container) container.style.opacity = '0.3';
  }

  function resume() {
    isActive = true;
    if (container) container.style.opacity = '1';
  }

  function destroy() {
    isActive = false;
    particles.forEach(function (p) { p.el.remove(); });
    particles = [];
  }

  return {
    init: init,
    pause: pause,
    resume: resume,
    destroy: destroy,
  };
})();
