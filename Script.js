/* ============================================================
   RishtaBand — Matrimonial Website JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Trigger hero animations after preloader
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
    document.querySelectorAll('.hero .fade-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 400 + i * 150);
    });
  }, 1600);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Laggy outline for smooth feel
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on hover
  document.querySelectorAll('a, button, select, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width  = '56px';
      cursorOutline.style.height = '56px';
      cursorOutline.style.borderColor = 'var(--rose)';
      cursorDot.style.background = 'var(--rose)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width  = '36px';
      cursorOutline.style.height = '36px';
      cursorOutline.style.borderColor = 'var(--gold)';
      cursorDot.style.background = 'var(--gold)';
    });
  });
}

/* ============================================================
   NAVBAR — Scroll & Mobile Toggle
   ============================================================ */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const navLinks    = document.querySelectorAll('.nav-link');
const mobLinks    = document.querySelectorAll('.mob-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = ['home','how-it-works','profiles','testimonials','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) current = id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ============================================================
   REVEAL ON SCROLL (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger children within parent
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger children within parent
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

// Add stagger delays to siblings
function addStaggerToGroup(selector, delayStep = 120) {
  const groups = {};
  document.querySelectorAll(selector).forEach(el => {
    const parent = el.parentElement;
    if (!groups[parent]) groups[parent] = [];
    groups[parent].push(el);
  });
  Object.values(groups).forEach(children => {
    children.forEach((el, i) => el.dataset.delay = i * delayStep);
  });
}

addStaggerToGroup('.step-card', 150);
addStaggerToGroup('.profile-tile', 100);
addStaggerToGroup('.plan-card', 120);
addStaggerToGroup('.feature-item', 80);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   ANIMATED COUNTER (hero stats)
   ============================================================ */
function animateCounter(el, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();

  function format(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M+';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n + (target === 98 ? '' : '');
  }

  function update(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = format(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = format(target);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const els = entry.target.querySelectorAll('.stat-num[data-target]');
      els.forEach(el => animateCounter(el, parseInt(el.dataset.target)));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

/* ============================================================
   FALLING PETALS ANIMATION
   ============================================================ */
const petalContainer = document.getElementById('petalContainer');
const petalColors = [
  'rgba(201,147,90,0.6)',
  'rgba(232,200,122,0.5)',
  'rgba(181,100,122,0.5)',
  'rgba(245,236,216,0.8)',
  'rgba(232,160,178,0.6)',
];

function createPetal() {
  if (!petalContainer) return;
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.top = '-20px';
  petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
  petal.style.width = (6 + Math.random() * 8) + 'px';
  petal.style.height = (10 + Math.random() * 10) + 'px';
  petal.style.animationDuration = (6 + Math.random() * 8) + 's';
  petal.style.animationDelay = (Math.random() * 2) + 's';
  petalContainer.appendChild(petal);
  setTimeout(() => petal.remove(), 16000);
}

// Spawn petals periodically
let petalInterval = setInterval(createPetal, 600);

// Pause petals when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(petalInterval);
  } else {
    petalInterval = setInterval(createPetal, 600);
  }
});

/* ============================================================
   PROFILE FILTER
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const profileTiles = document.querySelectorAll('.profile-tile');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    profileTiles.forEach(tile => {
      const type = tile.dataset.type || '';
      const show = filter === 'all' || type.includes(filter);

      if (show) {
        tile.classList.remove('hidden');
        tile.style.animation = 'none';
        tile.offsetHeight; // reflow
        tile.style.animation = 'fadeInTile 0.4s ease forwards';
      } else {
        tile.classList.add('hidden');
      }
    });
  });
});

// Inject tile animation
const tileStyle = document.createElement('style');
tileStyle.textContent = `
  @keyframes fadeInTile {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(tileStyle);

/* ============================================================
   LIKE BUTTON TOGGLE
   ============================================================ */
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('liked');
    const svg = btn.querySelector('svg path');
    if (btn.classList.contains('liked')) {
      svg.setAttribute('fill', 'currentColor');
      showToast('❤️ Added to your favourites!');
    } else {
      svg.setAttribute('fill', 'none');
    }

    // Heart burst effect
    const burst = document.createElement('div');
    burst.innerHTML = '♥';
    burst.style.cssText = `
      position:absolute; pointer-events:none; z-index:100;
      font-size:1.5rem; color:#b5647a;
      animation: heartBurst 0.6s ease forwards;
      left: 50%; top: 50%; transform: translate(-50%,-50%);
    `;
    btn.style.position = 'relative';
    btn.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  });
});

const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes heartBurst {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
    60%  { transform: translate(-50%,-120%) scale(1.4); opacity: 1; }
    100% { transform: translate(-50%,-180%) scale(1); opacity: 0; }
  }
`;
document.head.appendChild(burstStyle);

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const testiTrack = document.getElementById('testiTrack');
const testiPrev  = document.getElementById('testiPrev');
const testiNext  = document.getElementById('testiNext');
const testiDots  = document.getElementById('testiDots');

let currentSlide   = 0;
let autoSlideTimer = null;

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function getTotalSlides() {
  const cards = testiTrack ? testiTrack.querySelectorAll('.testi-card') : [];
  return Math.max(0, cards.length - getVisibleCount() + 1);
}

function renderDots() {
  if (!testiDots) return;
  testiDots.innerHTML = '';
  const total = getTotalSlides();
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('testi-dot');
    if (i === currentSlide) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    testiDots.appendChild(dot);
  }
}

function goToSlide(index) {
  if (!testiTrack) return;
  const cards = testiTrack.querySelectorAll('.testi-card');
  const total  = getTotalSlides();
  currentSlide = Math.max(0, Math.min(index, total - 1));

  const cardWidth = cards[0].offsetWidth + 28; // gap = 28px
  testiTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

  // Update dots
  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  const total = getTotalSlides();
  goToSlide(currentSlide + 1 < total ? currentSlide + 1 : 0);
}

function prevSlide() {
  const total = getTotalSlides();
  goToSlide(currentSlide - 1 >= 0 ? currentSlide - 1 : total - 1);
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(nextSlide, 4500);
}

function stopAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
}

if (testiNext) testiNext.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
if (testiPrev) testiPrev.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

// Touch support
if (testiTrack) {
  let touchStartX = 0;
  testiTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  testiTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
  });
  testiTrack.addEventListener('mouseenter', stopAutoSlide);
  testiTrack.addEventListener('mouseleave', startAutoSlide);
}

renderDots();
startAutoSlide();

window.addEventListener('resize', () => {
  renderDots();
  goToSlide(0);
});

/* ============================================================
   MODAL — Register / Login
   ============================================================ */
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const loginBtn      = document.getElementById('loginBtn');
const registerBtn   = document.getElementById('registerBtn');
const modalTitle    = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const switchToLogin = document.getElementById('switchToLogin');
const modalSubmitBtn= document.getElementById('modalSubmitBtn');

function openModal(mode = 'register') {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (mode === 'login') {
    modalTitle.textContent    = 'Welcome Back';
    modalSubtitle.textContent = 'Sign in to continue your journey';
    modalSubmitBtn.textContent= 'Sign In';
    if (switchToLogin) switchToLogin.closest('p').innerHTML = `New here? <a href="#" id="switchToRegister">Create an account</a>`;
    const switchReg = document.getElementById('switchToRegister');
    if (switchReg) switchReg.addEventListener('click', (e) => { e.preventDefault(); openModal('register'); });
  } else {
    modalTitle.textContent    = 'Create Your Free Account';
    modalSubtitle.textContent = 'Begin your journey to finding your perfect match';
    modalSubmitBtn.textContent= 'Create Account';
    if (switchToLogin) switchToLogin.closest('p').innerHTML = `Already a member? <a href="#" id="switchToLogin">Sign In</a>`;
    const stl = document.getElementById('switchToLogin');
    if (stl) stl.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (loginBtn)   loginBtn.addEventListener('click',   () => openModal('login'));
if (registerBtn) registerBtn.addEventListener('click', () => openModal('register'));
if (modalClose)  modalClose.addEventListener('click',  closeModal);

modalOverlay && modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Modal form submit
const modalForm = document.getElementById('modalForm');
if (modalForm) {
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = modalSubmitBtn;
    btn.textContent = 'Processing...';
    btn.disabled = true;
    setTimeout(() => {
      closeModal();
      btn.disabled = false;
      showToast('🎉 Welcome to RishtaBand! Your journey begins now.');
    }, 1400);
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = '#34a853';
      contactForm.reset();
      showToast('💌 Your message has been sent. We\'ll respond within 24 hours.');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   VIEW PROFILE / MESSAGE BUTTONS
   ============================================================ */
document.querySelectorAll('.tile-btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('👤 Profile details — upgrade to Premium to view full profile!');
  });
});

document.querySelectorAll('.msg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('💬 Messaging is available for Premium members. Upgrade to connect!');
  });
});

/* ============================================================
   PLAN BUTTONS
   ============================================================ */
document.querySelectorAll('.plan-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.closest('.plan-card').querySelector('.plan-name').textContent;
    if (plan === 'Basic') {
      openModal('register');
    } else {
      showToast(`✨ You selected the ${plan} plan! Completing registration…`);
      openModal('register');
    }
  });
});

/* ============================================================
   SEARCH BUTTON
   ============================================================ */
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const selects = document.querySelectorAll('.search-select');
    const lookingFor = selects[0].value;
    const religion   = selects[1].value;
    const age        = selects[2].value;
    showToast(`🔍 Searching for ${religion} ${lookingFor}s aged ${age}…`);
    document.getElementById('profiles').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ============================================================
   PARALLAX ON HERO ORBs
   ============================================================ */
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 12;
    orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.querySelector('button').addEventListener('click', () => {
    const input = newsletterForm.querySelector('input');
    if (input.value.includes('@')) {
      showToast('📧 Subscribed! You\'ll receive our latest updates.');
      input.value = '';
    } else {
      showToast('⚠️ Please enter a valid email address.');
    }
  });
}

/* ============================================================
   SCROLL PROGRESS INDICATOR
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(to right, var(--rose), var(--gold), var(--gold-light));
  z-index: 9999;
  transition: width 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = document.documentElement.scrollTop;
  const scrollH    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress   = (scrollTop / scrollH) * 100;
  progressBar.style.width = progress + '%';
});

/* ============================================================
   SECTION ENTRANCE — Stagger reveal inside steps
   ============================================================ */
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.step-card, .step-connector');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 130);
      });
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const stepsGrid = document.querySelector('.steps-grid');
if (stepsGrid) stepObserver.observe(stepsGrid);

/* ============================================================
   APP BADGE BUTTONS
   ============================================================ */
document.querySelectorAll('.app-badge').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('📱 App coming soon! Stay tuned for updates.');
  });
});

/* ============================================================
   SOCIAL LINK CLICK FEEDBACK
   ============================================================ */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('🔗 Social page coming soon!');
  });
});

console.log('%cRishtaBand ❧', 'color: #c9935a; font-size: 20px; font-family: Georgia; font-style: italic;');
console.log('%cWhere Two Souls Find Their Forever', 'color: #8b7355; font-size: 12px;');
