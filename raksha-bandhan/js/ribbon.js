/* ===================================
   Soft Dhaaga — 3D Ribbon Interaction
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Ribbon = (function () {
  let container = null;
  let segments = [];
  const SEGMENT_COUNT = 8;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let tiltX = 0;
  let tiltY = 0;

  // Spring physics
  const springStiffness = 0.08;
  const springDamping = 0.85;
  let velocities = [];
  let offsets = [];
  let animFrameId = null;

  function init() {
    container = document.getElementById('ribbon-container');
    if (!container) return;

    createRibbon();
    bindEvents();
    startPhysicsLoop();
  }

  function createRibbon() {
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const segment = document.createElement('div');
      segment.className = 'ribbon-segment';

      // Position each segment in 3D space
      const progress = i / (SEGMENT_COUNT - 1); // 0 to 1
      const yPos = 20 + (i * 22); // Vertical spacing
      const xOffset = Math.sin(progress * Math.PI * 1.5) * 40;
      const zOffset = Math.cos(progress * Math.PI) * 30;

      // Base rotations for the flowing shape
      const rx = Math.sin(progress * Math.PI) * 12;
      const ry = Math.cos(progress * Math.PI * 0.8) * 8 - 5;
      const rz = Math.sin(progress * Math.PI * 1.2) * 6;

      segment.style.cssText = `
        top: ${yPos}px;
        left: calc(50% - 50% + ${xOffset}px);
        width: calc(80% - ${Math.abs(xOffset) * 0.5}px);
        --rx: ${rx}deg;
        --ry: ${ry}deg;
        --rz: ${rz}deg;
        --tz: ${zOffset}px;
        --ribbon-duration: ${5 + Math.random() * 3}s;
        --ribbon-delay: ${i * 0.3}s;
        transform: rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translateZ(${zOffset}px);
      `;

      container.appendChild(segment);
      segments.push({
        el: segment,
        baseRx: rx,
        baseRy: ry,
        baseRz: rz,
        baseTz: zOffset,
        baseX: xOffset,
        baseY: yPos,
      });

      velocities.push({ rx: 0, ry: 0 });
      offsets.push({ rx: 0, ry: 0 });
    }
  }

  function bindEvents() {
    // Touch events
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // Mouse events (for desktop testing)
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseEnd);
    container.addEventListener('mouseleave', onMouseEnd);

    // Device orientation for tilt
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }
  }

  function onTouchStart(e) {
    isDragging = true;
    const touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    SoftDhaaga.Haptics.soft();

    // Pause CSS animation during interaction
    segments.forEach(function (s) {
      s.el.style.animationPlayState = 'paused';
    });
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = (touch.clientX - dragStartX) / container.offsetWidth;
    const dy = (touch.clientY - dragStartY) / container.offsetHeight;
    applyDragForce(dx, dy);
  }

  function onTouchEnd() {
    isDragging = false;
    // Resume CSS animation
    segments.forEach(function (s) {
      s.el.style.animationPlayState = 'running';
    });
  }

  function onMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    segments.forEach(function (s) {
      s.el.style.animationPlayState = 'paused';
    });
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = (e.clientX - dragStartX) / container.offsetWidth;
    const dy = (e.clientY - dragStartY) / container.offsetHeight;
    applyDragForce(dx, dy);
  }

  function onMouseEnd() {
    isDragging = false;
    segments.forEach(function (s) {
      s.el.style.animationPlayState = 'running';
    });
  }

  function onDeviceOrientation(e) {
    if (isDragging) return;
    if (e.gamma !== null) {
      tiltX = Math.max(-20, Math.min(20, e.gamma)) / 20;
      tiltY = Math.max(-20, Math.min(20, e.beta - 45)) / 20;
    }
  }

  function applyDragForce(dx, dy) {
    segments.forEach(function (s, i) {
      const influence = 1 - Math.abs(i - SEGMENT_COUNT / 2) / (SEGMENT_COUNT / 2);
      const forceMultiplier = 0.3 + influence * 0.7;

      velocities[i].rx += dy * 50 * forceMultiplier;
      velocities[i].ry += dx * 60 * forceMultiplier;
    });
  }

  function startPhysicsLoop() {
    function update() {
      segments.forEach(function (s, i) {
        // Spring back to center
        velocities[i].rx += -offsets[i].rx * springStiffness;
        velocities[i].ry += -offsets[i].ry * springStiffness;

        // Damping
        velocities[i].rx *= springDamping;
        velocities[i].ry *= springDamping;

        // Apply velocity
        offsets[i].rx += velocities[i].rx;
        offsets[i].ry += velocities[i].ry;

        // Tilt influence (when not dragging)
        if (!isDragging) {
          const tiltInfluence = (i / SEGMENT_COUNT) * 0.6 + 0.4;
          offsets[i].rx += (tiltY * 5 * tiltInfluence - offsets[i].rx) * 0.02;
          offsets[i].ry += (tiltX * 8 * tiltInfluence - offsets[i].ry) * 0.02;
        }

        // Apply transforms (only if significant change)
        if (Math.abs(offsets[i].rx) > 0.1 || Math.abs(offsets[i].ry) > 0.1 || isDragging) {
          const rx = s.baseRx + offsets[i].rx;
          const ry = s.baseRy + offsets[i].ry;
          s.el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${s.baseRz}deg) translateZ(${s.baseTz}px)`;
        }
      });

      animFrameId = requestAnimationFrame(update);
    }

    animFrameId = requestAnimationFrame(update);
  }

  function unravel(callback) {
    // Stop physics
    cancelAnimationFrame(animFrameId);

    container.classList.add('unraveling');

    // Stagger the unravel
    segments.forEach(function (s, i) {
      s.el.style.transitionDelay = (i * 0.08) + 's';
    });

    // Callback after animation completes
    setTimeout(function () {
      if (callback) callback();
    }, 1000 + SEGMENT_COUNT * 80);
  }

  function destroy() {
    cancelAnimationFrame(animFrameId);
    segments.forEach(function (s) { s.el.remove(); });
    segments = [];
  }

  function reset() {
    if (container) {
      container.classList.remove('unraveling');
    }
    segments.forEach(function (s) {
      s.el.style.transitionDelay = '0s';
      s.el.style.transform = '';
      s.el.style.opacity = '';
    });
  }

  return {
    init: init,
    unravel: unravel,
    reset: reset,
    destroy: destroy,
  };
})();
