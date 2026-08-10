/* ===================================
   Soft Dhaaga — Main App Controller
   =================================== */

window.SoftDhaaga = window.SoftDhaaga || {};

window.SoftDhaaga.App = (function () {
  /* ─────────────────────────────────
     MEMORY DATA — EDIT THIS SECTION!
     Replace images and captions below.
     ───────────────────────────────── */

  const memoriesData = [
    {
      image: 'images/memories/memory-1.jpeg',
      captionEn:
        "Before you, I was simply Aai and Baba’s son. Then I became your little brother — and with you came someone to look up to, learn from, and lean on. Thank you for helping me find my way and teaching me to stand on my own feet. A part of who I am today will always be because of you.",
      captionMr:
        "तुझ्याआधी मी फक्त आई-बाबांचा मुलगा होतो. तुझा भाऊ झालो आणि मला तुझ्यासारखं पाहून शिकणारं, तुझ्यावर विश्वास ठेवणारं एक सुंदर नातं मिळालं. माझ्या पायावर उभं राहायला शिकवलंस, माझ्यावर विश्वास ठेवला यासाठी मनापासून धन्यवाद. आज मी जो आहे, त्यात तुझा वाटा कायम राहील.",
      year: 'Where I learned to stand ✦',
    },

    {
      image: 'images/memories/memory-2.jpeg',
      captionEn:
        "Our childhood was never perfect, but it was beautifully ours. The little arguments, shared meals, stolen bites, endless laughter, and running to Aai whenever things got out of hand — those ordinary moments became some of my most precious memories. I would not change a thing.",
      captionMr:
        "आपलं बालपण अगदी परिपूर्ण नव्हतं, पण ते मनापासून आपलं होतं. छोट्या छोट्या भांडणांपासून एकमेकांच्या ताटातले घास चोरण्यापर्यंत, मनसोक्त हसण्यापासून काही झालं की आईकडे धाव घेण्यापर्यंत — या साध्याशा क्षणांनीच आपल्या आठवणींचं सुंदर जग तयार केलं. त्यातला एकही क्षण मला बदलायचा नाही.",
      year: 'Our beautiful little world ✦',
    },

    {
      image: 'images/memories/memory-3.jpeg',
      captionEn:
        "Every Raksha Bandhan came with the same little ritual — you would tie the rakhi with all the seriousness in the world and then wait for your gift. I would pretend to complain, as always. But somewhere in my heart, I knew how special that day was — because it reminded me that I had a sister to celebrate, protect, and cherish.",
      captionMr:
        "प्रत्येक रक्षाबंधनाची एक खास आठवण आहे — तू अगदी मन लावून राखी बांधायचीस आणि मग हक्काने भेट मागायचीस. मी नेहमीसारखं थोडं कुरकुरायचो, पण मनातून मात्र त्या दिवसाची आतुरतेने वाट पाहायचो. कारण त्या दिवशी पुन्हा एकदा जाणवायचं — माझ्या आयुष्यात तुझ्यासारखी बहीण आहे, हीच किती सुंदर गोष्ट आहे.",
      year: 'Our little Rakhi tradition ✦',
    },

    {
      image: 'images/memories/memory-4.jpeg',
      captionEn:
        "Baba — Ravindra — taught us the strength to stand on our own. Aai — Thakubai — taught us the warmth of standing together. Whatever good we carry within us today has, in some way, begun with them. We are a reflection of the love and values they gave us.",
      captionMr:
        "बाबा — रवींद्र — यांनी स्वतःच्या पायावर खंबीरपणे उभं राहायला शिकवलं. आई — ठकूबाई — यांनी मात्र एकमेकांच्या पाठीशी उभं राहण्याची ताकद दिली. आज आपल्यात जे काही चांगलं आहे, त्याची मुळं कुठेतरी त्यांच्याच संस्कारांत आहेत. त्यांनी दिलेलं प्रेम आणि शिकवण आपण आजही आपल्या आयुष्यात जपत आहोत.",
      year: 'Everything began with them ✦',
    },

    {
      image: 'images/memories/memory-5.jpeg',
      captionEn:
        "The day you got married was a beautiful beginning for you, and I was genuinely happy to see you begin a new chapter. Yet, somewhere within that happiness, there was a quiet feeling too. Not the fear of losing you, but the realization that our home would never sound quite the same without your voice, your presence, and all the little things that made it feel like home.",
      captionMr:
        "तुझ्या लग्नाचा दिवस तुझ्या आयुष्यातील एका सुंदर नव्या पर्वाची सुरुवात होती, आणि तुला नव्या आयुष्याकडे जाताना पाहून मनापासून आनंद झाला. पण त्या आनंदासोबत मनात एक शांतशी हुरहूरही होती. तुला गमावण्याची नाही — कारण आपलं नातं कधीच दूर होणार नाही. फक्त एवढंच जाणवत होतं की तुझ्या आवाजाशिवाय, तुझ्या उपस्थितीशिवाय आपलं घर पूर्वीसारखं राहणार नाही.",
      year: 'When home felt a little different ✦',
    },

    {
      image: 'images/memories/memory-6.jpeg',
      captionEn:
        "Sandeep Daji — you did more than become my sister’s husband. You became someone who gave her a new home while respecting the home she came from. That kind of understanding means more than words can say. You are not only a part of her life, but a part of our family — and, to me, a brother in every way that matters.",
      captionMr:
        "संदीप दाजी — तुम्ही फक्त माझ्या ताईचे जीवनसाथी झालात असं नाही, तर तिच्या माहेरच्या नात्यांनाही तितकंच जपून तिला एक सुंदर नवीन घर दिलंत. नात्यांना समजून घेणं आणि त्यांना मनापासून जपणं ही खूप मोठी गोष्ट आहे. तुम्ही आता फक्त ताईच्या आयुष्याचा भाग नाही, तर आमच्या कुटुंबाचा आणि माझ्या आयुष्यातील एका भावाच्या नात्याचा भाग आहात.",
      year: 'A brother by heart ✦',
    },

    {
      image: 'images/memories/memory-7.jpeg',
      captionEn:
        "And then Sarvadnya came into your life. Watching you with him made me understand something I had known all along — the depth of the love you have always carried in your heart. The same care, warmth, and tenderness you once gave me now live in the way you love him. Tai, motherhood looks beautiful on you.",
      captionMr:
        "आणि मग सर्वज्ञ तुझ्या आयुष्यात आला. त्याच्याकडे तुला पाहताना मला एका गोष्टीची नव्याने जाणीव झाली — तुझ्या मनातलं प्रेम किती खोल आहे. ज्या मायेने, काळजीने आणि आपुलकीने तू मला नेहमी जपलंस, त्याच प्रेमाचं एक सुंदर रूप आज सर्वज्ञसाठी पाहायला मिळतं. ताई, आई म्हणून तुला पाहणं हीसुद्धा माझ्यासाठी एक सुंदर आठवण आहे.",
      year: 'A beautiful new beginning ✦',
    },

    {
      image: 'images/memories/memory-8.jpeg',
      captionEn:
        "We may not speak every day anymore, and life may have taken us to different places. But some bonds do not depend on distance or daily conversations. They simply remain — quietly, deeply, and naturally. No matter how many years pass or how far life takes us, the bond between a brother and sister will always find its way home.",
      captionMr:
        "आता आपण रोज बोलत नाही, आयुष्याने आपल्याला वेगवेगळ्या वाटांवर नेलं आहे. पण काही नाती रोजच्या बोलण्यावर किंवा जवळ असण्यावर टिकत नाहीत. ती मनात कायमची असतात — शांत, घट्ट आणि तितकीच आपली. कितीही वर्षं जाऊ देत, आयुष्य आपल्याला कितीही दूर घेऊन जाऊ देत, भाऊ-बहिणीचं हे नातं नेहमी आपल्याला पुन्हा एकमेकांशी जोडत राहील.",
      year: 'A bond that distance cannot change ✦',
    },

    {
      isThankYouCard: true,
      year: 'Forever & Always 💖',
      titleEn: 'THANK YOU, DIDI!',
      titleMr: 'थँक्यू ताई! 🌸',
      captionEn:
        "Thank you for being my sister, my first friend, my guide, and someone I could always look up to. These 21 years have given me countless memories that I will carry with me forever. Wherever life takes us, one thing will never change — I will always be your little brother, and I will always be there for you. Happy Birthday and Happy Raksha Bandhan, Tai. ❤️",
      captionMr:
        "माझी ताई, माझी पहिली मैत्रीण, माझी मार्गदर्शक आणि प्रत्येक वेळी माझ्या पाठीशी उभी राहणारी व्यक्ती असल्याबद्दल तुझे मनापासून आभार. या २१ वर्षांनी मला असंख्य सुंदर आठवणी दिल्या, ज्या आयुष्यभर माझ्यासोबत राहतील. आयुष्य आपल्याला कुठेही घेऊन जाऊ दे, एक गोष्ट मात्र कायम तशीच राहील — मी नेहमी तुझा छोटा भाऊ असेन आणि नेहमी तुझ्या पाठीशी उभा राहीन. वाढदिवसाच्या आणि रक्षाबंधनाच्या मनापासून खूप खूप शुभेच्छा, ताई. ❤️",
    },
  ];



  /* Closing message for the finale page */
  const closingMessage = {
    en: 'Pratiksha ताई — if I had to write down everything you\'ve been to me, this page would never end. You were my first friend before I knew what friendship meant. You fought my battles when I was too small to fight my own. You believed in me on days I didn\'t believe in myself. Twenty-one years — and through every single one, the thread between us never frayed. Not once. Today, on Raksha Bandhan, I\'m not just tying a promise to protect you. I\'m thanking you — for protecting me first. For being my ताई in every sense of the word. For giving this family its heart.',
    mr: 'प्रतीक्षा ताई — तू माझ्यासाठी काय आहेस ते जर मला लिहायचं असतं, तर हे पान कधीच संपलं नसतं. मैत्री म्हणजे काय हे कळण्यापूर्वी तू माझी पहिली मैत्रीण होतीस. मी लढायला खूप लहान होतो तेव्हा तू माझ्यासाठी लढलीस. ज्या दिवशी माझा स्वतःवर विश्वास नव्हता त्या दिवशी तुझा माझ्यावर विश्वास होता. एकवीस वर्षं — आणि प्रत्येक वर्षात, आपल्यातला धागा कधी तुटला नाही. एकदाही नाही. आज, रक्षाबंधनाच्या दिवशी, मी फक्त तुझं रक्षण करण्याचं वचन देत नाही. मी तुला धन्यवाद देतो — आधी माझं रक्षण केल्याबद्दल. प्रत्येक अर्थाने माझी ताई असल्याबद्दल. या कुटुंबाला त्याचं हृदय दिल्याबद्दल.',
  };

  /* ── State ── */
  let currentScreen = 'landing';

  /* ── Initialization ── */
  function init() {
    SoftDhaaga.Audio.init();
    SoftDhaaga.Particles.init();
    SoftDhaaga.Stars.init();
    SoftDhaaga.Ribbon.init();
    if (SoftDhaaga.Rakhi3D) SoftDhaaga.Rakhi3D.init();
    SoftDhaaga.Petals.init();
    SoftDhaaga.Spiral.init(onSpiralComplete);

    // Bind landing
    var tapBtn = document.getElementById('tap-to-begin');
    if (tapBtn) {
      tapBtn.addEventListener('click', onTapToBegin);
    }

    // Bind finale spiral clicks -> return to landing page
    var spiralTap = document.getElementById('spiral-tap-target');
    if (spiralTap) {
      spiralTap.addEventListener('click', onHeartTap);
    }

    var spiralCanvas = document.getElementById('spiral-canvas');
    if (spiralCanvas) {
      spiralCanvas.addEventListener('click', goBackToMemories);
    }

    var backBtn = document.getElementById('back-to-memories');
    if (backBtn) {
      backBtn.addEventListener('click', goBackToMemories);
    }

    populateFinale();

    // Page visibility
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        SoftDhaaga.Particles.pause();
        SoftDhaaga.Stars.pause();
      } else {
        SoftDhaaga.Particles.resume();
        SoftDhaaga.Stars.resume();
      }
    });

    // Graceful image error handling
    document.addEventListener('error', function (e) {
      if (e.target.tagName === 'IMG' && e.target.classList.contains('memory-photo')) {
        var wrapper = e.target.parentElement;
        var placeholder = document.createElement('div');
        placeholder.className = 'memory-photo-placeholder';
        placeholder.textContent = '📷 Add your photo';
        e.target.replaceWith(placeholder);
      }
    }, true);
  }

  /* ── Navigation ── */
  function onTapToBegin() {
    SoftDhaaga.Haptics.tap();
    SoftDhaaga.Audio.startMusic();

    SoftDhaaga.Ribbon.unravel(function () {
      switchScreen('memories');
      setTimeout(function () {
        SoftDhaaga.Carousel.init(memoriesData);
      }, 100);
    });
  }

  function goToFinale() {
    switchScreen('finale');
    if (SoftDhaaga.Spiral) {
      SoftDhaaga.Spiral.start();
    }
  }

  function goBackToMemories() {
    var landingSec = document.getElementById('landing');
    if (landingSec) {
      landingSec.classList.remove('exiting');
      landingSec.style.opacity = '';
    }
    if (SoftDhaaga.Ribbon && SoftDhaaga.Ribbon.reset) {
      SoftDhaaga.Ribbon.reset();
    }
    switchScreen('landing');
    if (SoftDhaaga.Haptics) SoftDhaaga.Haptics.soft();
  }

  function switchScreen(target) {
    if (currentScreen === target) return;

    var targetEl = document.getElementById(target);
    var currentEl = document.getElementById(currentScreen);

    if (targetEl) {
      targetEl.classList.add('active');
    }
    if (currentEl) {
      currentEl.classList.remove('active');
    }
    currentScreen = target;
  }

  /* ── Finale ── */
  function populateFinale() {
    var closingEn = document.querySelector('.closing-text-en');
    var closingMr = document.querySelector('.closing-text-mr');
    if (closingEn) closingEn.textContent = closingMessage.en;
    if (closingMr) closingMr.textContent = closingMessage.mr;
  }

  function onSpiralComplete() {
    var finaleContent = document.querySelector('.finale-content');
    if (finaleContent) {
      setTimeout(function () {
        finaleContent.classList.add('visible');
      }, 500);
    }
  }

  function onHeartTap() {
    if (SoftDhaaga.Petals && !SoftDhaaga.Petals.hasBeenReleased()) {
      SoftDhaaga.Petals.release();
    }

    var tapTarget = document.getElementById('spiral-tap-target');
    if (tapTarget) {
      tapTarget.classList.remove('active');
      tapTarget.style.pointerEvents = 'none';
    }

    // Go back to main landing page
    setTimeout(function () {
      goBackToMemories();
    }, 1800);
  }

  return {
    init: init,
    goToFinale: goToFinale,
    goBackToMemories: goBackToMemories,
  };
})();

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', function () {
  SoftDhaaga.App.init();
});
