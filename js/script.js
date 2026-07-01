/* ============================================
   CELLAR CROWN — Premium Cleaning Services
   Main JavaScript
   ============================================ */

/* ---- Loading Screen ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ---- Sticky Navigation ---- */
const nav = document.querySelector('.nav');
const handleScroll = () => {
  if (window.scrollY > 60) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
  // Back to top button
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
};
window.addEventListener('scroll', handleScroll, { passive: true });

/* ---- Mobile Menu ---- */
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav?.classList.toggle('open');
});
// Close on link click
document.querySelectorAll('.nav__mobile a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
  });
});

/* ---- Back to Top ---- */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- Animated Counters ---- */
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ---- FAQ Accordion ---- */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-item__q');
  question?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ---- Testimonials Slider ---- */
const track = document.querySelector('.testimonials__track');
const dots = document.querySelectorAll('.testimonials__dot');
if (track && dots.length) {
  let autoSlide;
  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  const scrollTo = (index) => {
    currentIndex = (index + totalCards) % totalCards;
    const card = cards[currentIndex];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollTo(i)));
  autoSlide = setInterval(() => scrollTo(currentIndex + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => scrollTo(currentIndex + 1), 5000);
  });
  scrollTo(0);
}

/* ---- Parallax Hero ---- */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${offset * 0.3}px)`;
  }, { passive: true });
}

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Show success if redirected back from FormSubmit
  if (window.location.search.includes('sent=1')) {
    const formEl = document.querySelector('.form-fields');
    const successEl = document.querySelector('.form-success');
    if (formEl) formEl.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
  }

  contactForm.addEventListener('submit', function (e) {
    const btn = this.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
    }
    // Allow the native form POST to FormSubmit to proceed
    // (do not call e.preventDefault() so the form actually submits)
  });
}

/* ---- WhatsApp Chat Widget ---- */
const waBtn = document.getElementById('whatsapp-btn');
const waPopup = document.getElementById('waPopup');
const waSendBtn = document.getElementById('waSendBtn');
const waMessageInput = document.getElementById('waMessage');
const waIcon = document.getElementById('waIcon');

if (waBtn && waPopup) {
  let popupOpen = false;

  waBtn.addEventListener('click', () => {
    popupOpen = !popupOpen;
    waPopup.classList.toggle('open', popupOpen);
    // Remove badge on first open
    const badge = waBtn.querySelector('.wa-badge');
    if (badge) badge.style.display = 'none';
    // Swap icon
    if (waIcon) {
      waIcon.className = popupOpen ? 'fas fa-times' : 'fab fa-whatsapp';
    }
  });

  const sendMessage = () => {
    const msg = waMessageInput?.value?.trim() || '';
    const text = msg || 'Hello! I would like to book a cleaning service with Cellar Crown.';
    const phone = '18000000000';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    if (waMessageInput) waMessageInput.value = '';
  };

  waSendBtn?.addEventListener('click', sendMessage);
  waMessageInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Auto open popup after 5s on first visit
  if (!sessionStorage.getItem('waShown')) {
    setTimeout(() => {
      popupOpen = true;
      waPopup.classList.add('open');
      sessionStorage.setItem('waShown', '1');
    }, 5000);
  }
}

/* ---- Active Nav Link ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
