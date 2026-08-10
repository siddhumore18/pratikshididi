/* ===================================
   Soft Dhaaga — Memory Card Carousel
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.Carousel = (function () {
  let container = null;
  let cards = [];
  let dots = [];
  let currentIndex = 0;
  let totalCards = 0;
  let isTransitioning = false;
  let autoAdvanceTimer = null;
  let arrowLeft = null;
  let arrowRight = null;
  let counterEl = null;
  let swipeHint = null;

  // Touch tracking
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwiping = false;
  let touchDeltaX = 0;

  // Gyroscope parallax
  let tiltX = 0;
  let tiltY = 0;

  const SWIPE_THRESHOLD = 40; // reduced for better mobile sensitivity
  const VELOCITY_THRESHOLD = 0.2; // reduced for easier swipe
  const AUTO_ADVANCE_DELAY = 8000;

  function init(memoriesData) {
    container = document.querySelector('.carousel-container');
    arrowLeft = document.querySelector('.carousel-arrow--left');
    arrowRight = document.querySelector('.carousel-arrow--right');
    counterEl = document.querySelector('.memory-counter');

    if (!container) return;

    totalCards = memoriesData.length;
    buildCards(memoriesData);
    buildDots();
    addSwipeHint();
    bindEvents();
    showCard(0);
    updateArrows();
    startAutoAdvance();
    initGyroscope();
  }

  function buildCards(data) {
    data.forEach(function (memory, index) {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-index', index);

      if (memory.isThankYouCard) {
        card.className = 'memory-card memory-card-thankyou';
        card.innerHTML = `
          <div class="thank-you-card-box">
            <span class="memory-year font-handwritten">${memory.year || ''}</span>
            <h2 class="big-thankyou-title font-display">${memory.titleEn}</h2>
            <h3 class="big-thankyou-subtitle font-marathi">${memory.titleMr}</h3>

            <div class="gold-thread" style="margin: 0.8rem auto; width: 60%;"></div>

            <p class="memory-caption-en" style="font-size: clamp(0.88rem, 3.4vw, 1.05rem); line-height: 1.8;">${memory.captionEn}</p>
            <p class="memory-caption-mr font-marathi" style="font-size: clamp(0.82rem, 3vw, 0.95rem); margin-top: 0.8rem; line-height: 1.8;">${memory.captionMr}</p>

            <div class="thankyou-actions">
              <button class="btn-back-start font-handwritten" onclick="event.stopPropagation(); SoftDhaaga.Carousel.navigate(-${index})">
                ← Back to Beginning
              </button>
              <button class="btn-goto-finale font-handwritten" onclick="event.stopPropagation(); SoftDhaaga.App.goToFinale()">
                Spiral Finale ✦ →
              </button>
            </div>
          </div>
        `;
      } else {
        const hasImage = memory.image && memory.image.trim() !== '';
        card.innerHTML = `
          <span class="memory-year font-handwritten">${memory.year || ''}</span>
          <div class="memory-photo-wrapper">
            ${hasImage
              ? `<img class="memory-photo" src="${memory.image}" alt="Memory ${index + 1}" loading="lazy" onerror="if(this.dataset.fallback){return;} this.dataset.fallback=1; if(this.src.endsWith('.jpeg')){this.src=this.src.replace('.jpeg','.jpg');}else if(this.src.endsWith('.jpg')){this.src=this.src.replace('.jpg','.jpeg');}">`
              : `<div class="memory-photo-placeholder">📷 memory-${index + 1}.jpg</div>`
            }
          </div>
          <div class="memory-text">
            <p class="memory-caption-en">${memory.captionEn}</p>
            <div class="memory-divider"></div>
            <p class="memory-caption-mr font-marathi">${memory.captionMr}</p>
          </div>
        `;
      }

      container.appendChild(card);
      cards.push(card);
    });
  }

  function buildDots() {
    const dotsContainer = document.querySelector('.page-dots');
    if (!dotsContainer) return;

    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('div');
      dot.className = 'page-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function () {
        goToCard(i);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function addSwipeHint() {
    swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML = 'swipe to explore <span class="swipe-hint-arrow">→</span>';
    document.getElementById('memories').appendChild(swipeHint);

    // Remove after first swipe
    setTimeout(function () {
      if (swipeHint && swipeHint.parentNode) {
        swipeHint.remove();
      }
    }, 6000);
  }

  function bindEvents() {
    // Touch swipe — on the whole memories section for larger touch area
    const memoriesSection = document.getElementById('memories');
    memoriesSection.addEventListener('touchstart', onTouchStart, { passive: true });
    memoriesSection.addEventListener('touchmove', onTouchMove, { passive: false });
    memoriesSection.addEventListener('touchend', onTouchEnd, { passive: true });

    // Mouse swipe for desktop
    memoriesSection.addEventListener('mousedown', onMouseDown);
    memoriesSection.addEventListener('mousemove', onMouseMove);
    memoriesSection.addEventListener('mouseup', onMouseUp);

    // Arrows
    if (arrowLeft) {
      arrowLeft.addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(-1);
      });
    }
    if (arrowRight) {
      arrowRight.addEventListener('click', function (e) {
        e.stopPropagation();
        navigate(1);
      });
    }
  }

  /* ── Touch Handling ── */
  function onTouchStart(e) {
    if (isTransitioning) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    touchDeltaX = 0;
    isSwiping = false;
    resetAutoAdvance();
  }

  function onTouchMove(e) {
    if (isTransitioning) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isSwiping = true;
      // Remove swipe hint on first actual swipe
      if (swipeHint && swipeHint.parentNode) swipeHint.remove();
    }

    if (isSwiping) {
      e.preventDefault();
      touchDeltaX = dx;

      // Live drag feedback — shift current card slightly
      const activeCard = cards[currentIndex];
      if (activeCard) {
        const shift = Math.max(-60, Math.min(60, dx * 0.3));
        activeCard.style.transform = `translateX(${shift}px)`;
        activeCard.style.transition = 'none';
      }
    }
  }

  function onTouchEnd(e) {
    if (isTransitioning) return;

    // Reset live drag
    const activeCard = cards[currentIndex];
    if (activeCard) {
      activeCard.style.transform = '';
      activeCard.style.transition = '';
    }

    if (!isSwiping) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dt = Date.now() - touchStartTime;
    const velocity = Math.abs(dx) / dt;

    if (Math.abs(dx) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      if (dx < 0) {
        navigate(1);
      } else {
        navigate(-1);
      }
    }

    isSwiping = false;
    touchDeltaX = 0;
  }

  /* ── Mouse Handling (desktop) ── */
  let isMouseDown = false;
  function onMouseDown(e) {
    if (e.target.closest('.carousel-arrow') || e.target.closest('.page-dot')) return;
    isMouseDown = true;
    touchStartX = e.clientX;
    touchStartTime = Date.now();
  }

  function onMouseMove(e) {
    if (!isMouseDown || isTransitioning) return;
    const dx = e.clientX - touchStartX;
    if (Math.abs(dx) > 8) isSwiping = true;
  }

  function onMouseUp(e) {
    if (!isMouseDown) return;
    isMouseDown = false;

    if (!isSwiping) return;
    const dx = e.clientX - touchStartX;
    const dt = Date.now() - touchStartTime;
    const velocity = Math.abs(dx) / dt;

    if (Math.abs(dx) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      navigate(dx < 0 ? 1 : -1);
    }
    isSwiping = false;
  }

  /* ── Navigation ── */
  function navigate(direction) {
    const newIndex = currentIndex + direction;

    if (newIndex < 0) return;

    if (newIndex >= totalCards) {
      if (SoftDhaaga.App && SoftDhaaga.App.goToFinale) {
        SoftDhaaga.App.goToFinale();
      }
      return;
    }

    goToCard(newIndex, direction > 0 ? 'forward' : 'backward');
  }

  function goToCard(index, direction) {
    if (index === currentIndex || isTransitioning) return;
    isTransitioning = true;
    direction = direction || (index > currentIndex ? 'forward' : 'backward');

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];

    // Clear previous animation classes
    cards.forEach(function (c) {
      c.classList.remove('enter-from-right', 'exit-to-left', 'enter-from-left', 'exit-to-right', 'active', 'peeking');
      c.style.opacity = '';
    });

    currentCard.classList.add(direction === 'forward' ? 'exit-to-left' : 'exit-to-right');
    nextCard.classList.add('active', direction === 'forward' ? 'enter-from-right' : 'enter-from-left');

    SoftDhaaga.Audio.playPageTurn();
    SoftDhaaga.Haptics.turn();

    updateDots(index);
    updateCounter(index);

    setTimeout(function () {
      currentCard.classList.remove('exit-to-left', 'exit-to-right');
      nextCard.classList.remove('enter-from-right', 'enter-from-left');
      currentIndex = index;
      updateArrows();
      isTransitioning = false;
      startAutoAdvance();
    }, 500);
  }

  function showCard(index) {
    cards.forEach(function (c, i) {
      c.classList.remove('active', 'enter-from-right', 'exit-to-left', 'enter-from-left', 'exit-to-right');
      if (i === index) c.classList.add('active');
    });
    currentIndex = index;
    updateDots(index);
    updateCounter(index);
  }

  function updateArrows() {
    if (arrowLeft) {
      arrowLeft.classList.toggle('hidden', currentIndex === 0);
    }
    if (arrowRight) {
      // Always show right arrow (last swipe goes to finale)
      arrowRight.classList.remove('hidden');
    }
  }

  function updateDots(activeIndex) {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function updateCounter(index) {
    if (counterEl) {
      counterEl.textContent = (index + 1) + ' / ' + totalCards;
    }
  }

  function startAutoAdvance() {
    clearTimeout(autoAdvanceTimer);
    if (currentIndex < totalCards - 1) {
      autoAdvanceTimer = setTimeout(function () {
        const nextCard = cards[currentIndex + 1];
        if (nextCard) {
          nextCard.classList.add('active', 'peeking');
          nextCard.style.opacity = '0.3';
          setTimeout(function () {
            nextCard.classList.remove('active', 'peeking');
            nextCard.style.opacity = '';
          }, 1500);
        }
      }, AUTO_ADVANCE_DELAY);
    }
  }

  function resetAutoAdvance() {
    clearTimeout(autoAdvanceTimer);
  }

  function initGyroscope() {
    if (!window.DeviceOrientationEvent) return;
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma !== null) {
        tiltX = Math.max(-10, Math.min(10, e.gamma)) / 10;
        tiltY = Math.max(-10, Math.min(10, e.beta - 45)) / 10;
        applyParallax();
      }
    }, { passive: true });
  }

  function applyParallax() {
    const activeCard = cards[currentIndex];
    if (!activeCard) return;
    const photo = activeCard.querySelector('.memory-photo');
    if (photo) {
      const x = tiltX * 5;
      const y = tiltY * 3;
      photo.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    }
  }

  function getCurrentIndex() { return currentIndex; }

  function destroy() {
    clearTimeout(autoAdvanceTimer);
    cards = [];
    dots = [];
  }

  return {
    init: init,
    navigate: navigate,
    getCurrentIndex: getCurrentIndex,
    destroy: destroy,
  };
})();
