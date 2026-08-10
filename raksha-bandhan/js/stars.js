/* ===================================
   Soft Dhaaga — Continuous Diagonal Falling Pink Petals (Virat-Anushka Style)
   Flowing continuously from Left Top to Right Down
   + Tap-to-Spread Golden Star Burst
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Stars = (function () {
  let canvas = null;
  let ctx = null;
  let tapContainer = null;
  let particles = [];
  let animFrameId = null;
  let isActive = false;

  const NUM_PETALS = 60;
  const TAP_STAR_COUNT = 14;

  // Pink / Vintage Rose / Dusty Rose & Gold Palette (exact match to user screenshot)
  const PETAL_COLORS = [
    '#d98e8e',  // Dusty rose
    '#b85a5d',  // Vintage rose
    '#e8a5a5',  // Soft pink
    '#c67a7a',  // Warm rose
    '#f7dcd4',  // Blush pink
  ];

  const SPARKLE_COLORS = ['#CBA35C', '#e5b842', '#d4a94f'];

  function init() {
    canvas = document.getElementById('leaf-canvas');
    tapContainer = document.getElementById('stars-tap-container');

    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    createParticles();
    bindTapEvents();
    isActive = true;

    animate();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /* ── Particle Class (Continuous Left-Top to Right-Bottom Diagonal Flow) ── */
  function Particle() {
    this.reset(true);
  }

  Particle.prototype.reset = function (initialPopulate) {
    this.type = Math.random() > 0.2 ? 'petal' : 'sparkle'; // 80% pink petals, 20% gold sparkles

    this.w = 14 + Math.random() * 14;
    this.h = 10 + Math.random() * 10;
    this.opacity = 0.55 + Math.random() * 0.35; // Vivid opacity

    // Slow, gentle diagonal movement vectors (Top-Left -> Bottom-Right)
    this.xSpeed = 0.35 + Math.random() * 0.5;  // Gentle Left to Right
    this.ySpeed = 0.45 + Math.random() * 0.6;  // Soft Top to Bottom

    this.flip = Math.random() * Math.PI;
    this.flipSpeed = 0.005 + Math.random() * 0.01;

    if (initialPopulate) {
      this.x = Math.random() * (canvas.width + 300) - 300;
      this.y = Math.random() * (canvas.height + 300) - 300;
    } else {
      // Re-spawn either above the top edge or to the left of the screen
      if (Math.random() > 0.5) {
        this.x = Math.random() * canvas.width - 150;
        this.y = -40;
      } else {
        this.x = -40;
        this.y = Math.random() * canvas.height - 150;
      }
    }

    if (this.type === 'petal') {
      this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    } else {
      this.color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.opacity;

    if (this.type === 'petal') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.flip * Math.PI);

      // Pink Sakura / Rose Petal Bezier Shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.w / 2, -this.h / 2, this.w, 0, this.w / 2, this.h / 2);
      ctx.bezierCurveTo(0, this.h, -this.w / 2, 0, 0, 0);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      // Gold Sparkle Dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.5 + Math.random() * 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#CBA35C';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore();
  };

  Particle.prototype.update = function () {
    // Flow diagonally from left-top towards right-bottom
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.flip += this.flipSpeed;

    // Reset when exiting right or bottom bounds
    if (this.y > canvas.height + 40 || this.x > canvas.width + 40) {
      this.reset(false);
    }

    this.draw();
  };

  function createParticles() {
    particles = [];
    for (let i = 0; i < NUM_PETALS; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (isActive && ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
    }
    animFrameId = requestAnimationFrame(animate);
  }

  /* ── Tap-to-Spread Golden Star Burst ── */
  function bindTapEvents() {
    document.addEventListener('touchstart', onTap, { passive: true });
    document.addEventListener('click', onTap);
  }

  function onTap(e) {
    if (!isActive) return;
    if (e.target.closest('button') || e.target.closest('#spiral-tap-target')) return;

    let x, y;
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    spreadStars(x, y);
  }

  function spreadStars(originX, originY) {
    if (!tapContainer) return;

    for (let i = 0; i < TAP_STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'tap-star';

      const size = 4 + Math.random() * 6;
      const angle = (Math.PI * 2 / TAP_STAR_COUNT) * i + (Math.random() * 0.4);
      const distance = 40 + Math.random() * 90;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const duration = 0.6 + Math.random() * 0.6;
      const rotation = Math.random() * 360;
      const isFourPoint = Math.random() > 0.4;

      star.style.cssText = `
        position: fixed;
        left: ${originX}px;
        top: ${originY}px;
        width: ${size}px;
        height: ${size}px;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        background: radial-gradient(circle, #CBA35C, #d4a94f);
        border-radius: ${isFourPoint ? '2px' : '50%'};
        transform: rotate(${rotation}deg);
        box-shadow: 0 0 ${size}px rgba(203, 163, 92, 0.8), 0 0 ${size * 2}px rgba(203, 163, 92, 0.4);
        pointer-events: none;
        z-index: 9999;
        --end-x: ${endX}px;
        --end-y: ${endY}px;
        animation: tapStarBurst ${duration}s cubic-bezier(0, 0.5, 0.5, 1) forwards;
        ${isFourPoint ? 'clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);' : ''}
      `;

      tapContainer.appendChild(star);

      setTimeout(function () {
        star.remove();
      }, duration * 1000 + 50);
    }

    if (SoftDhaaga.Haptics) {
      SoftDhaaga.Haptics.soft();
    }
  }

  function pause() { isActive = false; }
  function resume() { isActive = true; }

  return {
    init: init,
    pause: pause,
    resume: resume,
  };
})();
