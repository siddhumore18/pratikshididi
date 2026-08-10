/* ===================================
   Soft Dhaaga — Year Spiral (Canvas)
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Spiral = (function () {
  let canvas = null;
  let ctx = null;
  let tapTarget = null;
  let counterEl = null;
  let counterNumEl = null;
  let isDrawing = false;
  let isComplete = false;
  let onComplete = null;

  const TOTAL_YEARS = 21;
  const DRAW_DURATION = 3500; // 3.5 seconds
  const SPIRAL_LOOPS = 4.5;
  const LINE_WIDTH = 2.0;

  // Colors
  const GOLD_COLOR = '#CBA35C';
  const GOLD_GLOW = 'rgba(203, 163, 92, 0.4)';
  const PLUM_COLOR = '#4A3540';

  function init(completionCallback) {
    canvas = document.getElementById('spiral-canvas');
    tapTarget = document.getElementById('spiral-tap-target');
    counterEl = document.querySelector('.year-counter');
    counterNumEl = document.querySelector('.year-counter-number');
    onComplete = completionCallback;

    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const size = Math.min(containerWidth * 0.85, 320);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix before scaling
    ctx.scale(dpr, dpr);
  }

  function start() {
    isDrawing = false;
    isComplete = false;

    resizeCanvas();

    if (!canvas || !ctx) return;
    isDrawing = true;

    // Show year counter
    if (counterEl) counterEl.classList.add('visible');

    const size = parseInt(canvas.style.width) || 300;
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.4;

    // Generate spiral points (outside-in)
    const points = [];
    const totalPoints = 500;

    for (let i = 0; i <= totalPoints; i++) {
      const progress = i / totalPoints;
      const angle = progress * SPIRAL_LOOPS * Math.PI * 2;
      const radius = maxRadius * (1 - progress * 0.85);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      points.push({ x: x, y: y, progress: progress, angle: angle });
    }

    // Add heart shape at the center end
    const heartPoints = generateHeartPoints(centerX, centerY, 16);
    const allPoints = points.concat(heartPoints);

    // Pre-calculate year marker positions
    const yearPositions = [];
    for (let year = 1; year <= TOTAL_YEARS; year++) {
      const yearProgress = year / TOTAL_YEARS;
      const idx = Math.floor(yearProgress * (totalPoints - 1));
      if (idx < points.length) {
        yearPositions.push({
          year: year,
          x: points[idx].x,
          y: points[idx].y,
          progress: yearProgress,
        });
      }
    }

    const startTime = performance.now();
    let lastYearShown = 0;

    function draw(timestamp) {
      if (!isDrawing) return;

      const elapsed = timestamp - startTime;
      const drawProgress = Math.min(elapsed / DRAW_DURATION, 1);
      const easedProgress = easeOutCubic(drawProgress);

      const renderSize = parseInt(canvas.style.width) || 300;

      // Clear frame
      ctx.clearRect(0, 0, renderSize, renderSize);

      // Draw completed portion of spiral
      const pointsToDraw = Math.floor(easedProgress * allPoints.length);

      if (pointsToDraw > 1) {
        // Gold glow outer layer
        ctx.beginPath();
        ctx.moveTo(allPoints[0].x, allPoints[0].y);
        for (let i = 1; i < pointsToDraw; i++) {
          ctx.lineTo(allPoints[i].x, allPoints[i].y);
        }
        ctx.strokeStyle = GOLD_GLOW;
        ctx.lineWidth = LINE_WIDTH + 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Main gold thread
        ctx.beginPath();
        ctx.moveTo(allPoints[0].x, allPoints[0].y);
        for (let i = 1; i < pointsToDraw; i++) {
          ctx.lineTo(allPoints[i].x, allPoints[i].y);
        }
        ctx.strokeStyle = GOLD_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Draw year markers
      const currentSpiralProgress = Math.min(easedProgress, totalPoints / allPoints.length);
      yearPositions.forEach(function (yp) {
        if (currentSpiralProgress >= yp.progress) {
          ctx.save();
          ctx.font = '500 11px Caveat, cursive';
          ctx.fillStyle = PLUM_COLOR;
          ctx.globalAlpha = 0.6;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const offsetAngle = yp.progress * SPIRAL_LOOPS * Math.PI * 2;
          const offsetX = Math.cos(offsetAngle) * 13;
          const offsetY = Math.sin(offsetAngle) * 13;

          ctx.fillText(yp.year.toString(), yp.x + offsetX, yp.y + offsetY);
          ctx.restore();

          if (yp.year > lastYearShown) {
            lastYearShown = yp.year;
            updateCounter(yp.year);
          }
        }
      });

      if (drawProgress < 1) {
        requestAnimationFrame(draw);
      } else {
        onDrawComplete();
      }
    }

    requestAnimationFrame(draw);
  }

  function generateHeartPoints(cx, cy, size) {
    const points = [];
    const steps = 50;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = cx + size * 0.8 * (16 * Math.pow(Math.sin(t), 3)) / 16;
      const y = cy - size * 0.8 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;

      points.push({ x: x, y: y, progress: 1 });
    }

    return points;
  }

  function updateCounter(year) {
    if (counterNumEl) {
      counterNumEl.textContent = year;
    }
  }

  function onDrawComplete() {
    isDrawing = false;
    isComplete = true;

    if (tapTarget) {
      tapTarget.classList.add('active');
    }

    if (SoftDhaaga.Haptics) {
      SoftDhaaga.Haptics.heartbeat();
    }

    if (onComplete) onComplete();
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function isFinished() {
    return isComplete;
  }

  function destroy() {
    isDrawing = false;
    isComplete = false;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    init: init,
    start: start,
    isFinished: isFinished,
    destroy: destroy,
  };
})();
