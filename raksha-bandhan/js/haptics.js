/* ===================================
   Soft Dhaaga — Haptics Module
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Haptics = (function () {
  const supported = 'vibrate' in navigator;

  const patterns = {
    tap: [10],
    turn: [15],
    reveal: [30, 50, 30],
    heartbeat: [20, 80, 20, 80, 40],
    soft: [8],
  };

  function vibrate(pattern) {
    if (!supported) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      /* silently fail on unsupported */
    }
  }

  return {
    tap: function () { vibrate(patterns.tap); },
    turn: function () { vibrate(patterns.turn); },
    reveal: function () { vibrate(patterns.reveal); },
    heartbeat: function () { vibrate(patterns.heartbeat); },
    soft: function () { vibrate(patterns.soft); },
    custom: function (ms) { vibrate(Array.isArray(ms) ? ms : [ms]); },
    isSupported: function () { return supported; },
  };
})();
