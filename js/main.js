/* McIndoe Falls Inn — Main JavaScript */

// ── Sticky Header ──────────────────────────────────────────
const header = document.querySelector('.site-header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 80);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ── Mobile Nav ─────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close when any nav link is tapped (important on mobile)
navMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside tap/click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-header')) {
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

// ── Hero Background Ken-Burns Effect ───────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 100);
}

// ── Testimonials Slider ────────────────────────────────────
const track  = document.querySelector('.testimonials-track');
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.t-dot');
let current  = 0;
let autoTimer;

function goToSlide(n) {
  current = (n + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.querySelector('.t-prev')?.addEventListener('click', () => {
  clearInterval(autoTimer);
  goToSlide(current - 1);
  startAuto();
});
document.querySelector('.t-next')?.addEventListener('click', () => {
  clearInterval(autoTimer);
  goToSlide(current + 1);
  startAuto();
});
dots.forEach((d, i) => {
  d.addEventListener('click', () => {
    clearInterval(autoTimer);
    goToSlide(i);
    startAuto();
  });
});

function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 5500);
}
if (slides.length > 1) startAuto();

// Touch / swipe support for testimonials on mobile
let touchStartX = 0;
const sliderEl = document.querySelector('.testimonials-slider');

sliderEl?.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

sliderEl?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 45) {           // min 45px swipe
    clearInterval(autoTimer);
    goToSlide(diff > 0 ? current + 1 : current - 1);
    startAuto();
  }
}, { passive: true });

// Recalculate on window resize (orientation change)
window.addEventListener('resize', () => {
  if (track) track.style.transform = `translateX(-${current * 100}%)`;
}, { passive: true });

// ── Scroll Fade-Up Animation ───────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  }
);
fadeEls.forEach(el => observer.observe(el));

// ── Active Nav Link ────────────────────────────────────────
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-book)');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = 'var(--gold-light)';
  }
});

// ── Smooth Anchor Scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;           // Skip empty placeholders
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
