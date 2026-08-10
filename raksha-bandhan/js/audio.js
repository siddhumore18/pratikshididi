/* ===================================
   Soft Dhaaga — Audio Controller
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Audio = (function () {
  let bgMusic = null;
  let pageTurnSfx = null;
  let isMuted = false;
  let isPlaying = false;
  let muteBtn = null;

  function init() {
    muteBtn = document.getElementById('mute-toggle');

    // Create audio elements
    bgMusic = new Audio('audio/bg-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0;
    bgMusic.preload = 'auto';

    pageTurnSfx = new Audio('audio/page-turn.mp3');
    pageTurnSfx.volume = 0.15;
    pageTurnSfx.preload = 'auto';

    // Mute toggle
    if (muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }
  }

  function startMusic() {
    if (isPlaying) return;

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        isPlaying = true;
        fadeIn(bgMusic, 0.3, 2000);
        if (muteBtn) muteBtn.classList.add('visible');
      }).catch(function (err) {
        // Autoplay blocked — will retry on next interaction
        console.log('Audio play deferred:', err.message);
      });
    }
  }

  function fadeIn(audio, targetVol, duration) {
    const steps = 30;
    const stepTime = duration / steps;
    const volumeStep = targetVol / steps;
    let currentStep = 0;

    const interval = setInterval(function () {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVol);
      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = targetVol;
      }
    }, stepTime);
  }

  function playPageTurn() {
    if (isMuted || !pageTurnSfx) return;

    // Clone for overlapping plays
    try {
      pageTurnSfx.currentTime = 0;
      pageTurnSfx.play().catch(function () { /* silent fail */ });
    } catch (e) {
      /* silent fail */
    }
  }

  function toggleMute() {
    isMuted = !isMuted;

    if (isMuted) {
      bgMusic.volume = 0;
      if (muteBtn) muteBtn.textContent = '🔇';
    } else {
      bgMusic.volume = 0.3;
      if (muteBtn) muteBtn.textContent = '🔊';
    }

    SoftDhaaga.Haptics.soft();
  }

  function stopMusic() {
    if (!bgMusic) return;
    const fadeOutInterval = setInterval(function () {
      if (bgMusic.volume > 0.02) {
        bgMusic.volume = Math.max(bgMusic.volume - 0.02, 0);
      } else {
        bgMusic.volume = 0;
        bgMusic.pause();
        isPlaying = false;
        clearInterval(fadeOutInterval);
      }
    }, 50);
  }

  return {
    init: init,
    startMusic: startMusic,
    playPageTurn: playPageTurn,
    toggleMute: toggleMute,
    stopMusic: stopMusic,
    isMuted: function () { return isMuted; },
  };
})();
