// ============================================
// OpenBridge PH — script.js
// Forms submit to openbridgeph@gmail.com
// via Formspree (https://formspree.io)
//
// SETUP: Replace 'YOUR_FORM_ID' below with
// your Formspree form ID. Sign up free at
// formspree.io, create a form pointing to
// openbridgeph@gmail.com, and paste the ID.
// Example ID: "xdoqkyzp"
// ============================================

const FORMSPREE_CLIENT_ID   = 'YOUR_CLIENT_FORM_ID';
const FORMSPREE_VA_ID        = 'YOUR_VA_FORM_ID';
const FORMSPREE_ENTERTAINER_ID = 'YOUR_ENTERTAINER_FORM_ID';

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Modal System
const modals = document.querySelectorAll('.modal');
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalCloses = document.querySelectorAll('.modal-close');
const modalOverlays = document.querySelectorAll('.modal-overlay');

modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = trigger.dataset.modal + '-modal';
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeAllModals() {
  modals.forEach(modal => modal.classList.remove('open'));
  document.body.style.overflow = '';
}

modalCloses.forEach(close => close.addEventListener('click', closeAllModals));
modalOverlays.forEach(overlay => overlay.addEventListener('click', closeAllModals));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

// ============================================
// Form Submission via Formspree
// ============================================

async function submitToFormspree(formId, formData, successMessage) {
  if (!formId || formId.startsWith('YOUR_')) {
    console.warn('Formspree ID not configured.');
    showSuccessToast(successMessage);
    closeAllModals();
    return;
  }

  const submitBtn = document.activeElement;
  if (submitBtn && submitBtn.type === 'submit') {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });

    if (response.ok) {
      showSuccessToast(successMessage);
      closeAllModals();
      document.querySelectorAll('.modal-form').forEach(f => f.reset());
    } else {
      const data = await response.json();
      const errMsg = data.errors
        ? data.errors.map(e => e.message).join(', ')
        : 'Something went wrong. Please try again or email us directly at openbridgeph@gmail.com';
      showErrorToast(errMsg);
    }
  } catch (err) {
    showErrorToast('Network error. Please check your connection or email us at openbridgeph@gmail.com');
  } finally {
    if (submitBtn && submitBtn.type === 'submit') {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
    }
  }
}

const clientForm = document.getElementById('client-form');
if (clientForm) {
  clientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitToFormspree(FORMSPREE_CLIENT_ID, new FormData(clientForm), "Thanks! We'll be in touch within 24 hours.");
  });
}

const vaForm = document.getElementById('va-form');
if (vaForm) {
  vaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitToFormspree(FORMSPREE_VA_ID, new FormData(vaForm), "Application received! We'll respond within 3–5 business days.");
  });
}

const entertainerForm = document.getElementById('entertainer-form');
if (entertainerForm) {
  entertainerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitToFormspree(FORMSPREE_ENTERTAINER_ID, new FormData(entertainerForm), "We've got your details! Expect a message within 24 hours.");
  });
}

// ============================================
// Toast Notifications
// ============================================

function showSuccessToast(message) { _showToast(message, 'success'); }
function showErrorToast(message) { _showToast(message, 'error'); }

function _showToast(message, type) {
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();
  const isError = type === 'error';
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);
    background:#ffffff;border:1.5px solid ${isError ? 'rgba(232,64,64,0.3)' : 'rgba(34,114,184,0.25)'};
    color:#2d2d42;padding:1rem 1.75rem;border-radius:14px;
    font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9375rem;font-weight:400;
    max-width:480px;width:calc(100% - 2rem);text-align:center;z-index:9999;
    box-shadow:0 8px 32px rgba(13,51,82,0.12),0 2px 8px rgba(13,51,82,0.07);
    display:flex;align-items:center;gap:0.75rem;opacity:0;
    transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
  `;
  const icon = document.createElement('span');
  icon.textContent = isError ? '!' : '✓';
  icon.style.cssText = `
    width:26px;height:26px;min-width:26px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:${isError ? '#fdeaea' : '#ddeeff'};
    color:${isError ? '#e84040' : '#2272b8'};font-weight:700;font-size:0.75rem;
  `;
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(icon);
  toast.appendChild(text);
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================
// Intersection Observer — slide-up animations
// ============================================

const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Explicit .slide-up elements
document.querySelectorAll('.slide-up').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`;
  observer.observe(el);
});

// ============================================
// Auto slide-up: section headings, cards,
// grid items, and standalone blocks
// that don't already have .slide-up
// ============================================

const AUTO_SLIDE_SELECTORS = [
  // Section headers & labels
  '.section-header',
  '.how-v2-header',
  '.va-services-header',
  '.ent-video-header',
  '.entertainer-cta-inner > h2',
  '.entertainer-cta-inner > .cta-eyebrow',
  '.entertainer-cta-inner > .cta-lead',
  '.entertainer-cta-inner > .cta-closer',
  '.ent-opening-question',
  '.ent-opening-sub',
  '.eo-label',
  '.careers-hero-inner > *:not(.careers-hero-cta)',
  '.careers-openings-inner > .label',
  '.careers-openings-inner > h2',
  '.careers-cta-inner > *',
  '.careers-mini-cta-inner',
  '.cb-header',
  // Individual cards & items
  '.va-service-card',
  '.how-step',
  '.op-card',
  '.benefit',
  '.check-item',
  '.timeline-item',
  '.faq-item',
  '.process-step',
  '.pricing-card',
  '.strength-card',
  '.opening-row',
  '.cta-benefit-card',
  '.eo-card',
  '.notif-card',
  '.hero-float-card',
  // CTA section pieces
  '.cta-split-content > *',
  '.cta-guarantee-item',
  '.discovery-form',
  '.discovery-header',
  // About page
  '.about-hero-text > *:not(h1)',
  '.strengths-inner .strengths-header',
  '.section-strengths .strength-card',
];

// Build a Set of elements already marked .slide-up to avoid double-init
const alreadyAnimated = new Set(document.querySelectorAll('.slide-up'));

const autoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      autoObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.07,
  rootMargin: '0px 0px -30px 0px'
});

AUTO_SLIDE_SELECTORS.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (alreadyAnimated.has(el)) return;

    // Skip elements inside the hero (they have their own CSS animations)
    if (el.closest('.hero') || el.closest('.entertainer-hero') || el.closest('.careers-hero')) return;

    // Skip elements already have inline opacity set (e.g. .op-card)
    // We still want op-card to animate via autoObserver so allow it
    alreadyAnimated.add(el);

    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${(i % 6) * 0.08}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${(i % 6) * 0.08}s`;
    autoObserver.observe(el);
  });
});

// ============================================
// Staggered animation for grid/list sections
// ============================================
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(
        '.timeline-item, .benefit, .value-item, .check-item, .faq-item, .process-step, .pricing-card, .comparison-card'
      );
      items.forEach((item, i) => {
        if (alreadyAnimated.has(item)) return;
        item.style.opacity = '0';
        item.style.transform = 'translateY(24px)';
        item.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50 + i * 80);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll(
  '.timeline, .benefits-grid, .values-grid, .checklist, .faq-list, .how-right, .pricing-grid, .comparison-grid'
).forEach(el => staggerObserver.observe(el));

// ============================================
// Subtle cursor glow (desktop only)
// ============================================
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9998;
    background:radial-gradient(circle,rgba(34,114,184,0.05) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:opacity 0.3s;top:0;left:0;overflow:hidden;
  `;
  document.body.appendChild(cursor);
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  function animCursor() {
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
}

// FAQ Accordion
document.querySelectorAll('.faq-acc-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-acc-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-acc-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ============================================
// Careers Page
// ============================================

const seeWhatBtn = document.getElementById('seeWhatBtn');
if (seeWhatBtn) {
  seeWhatBtn.addEventListener('click', () => {
    document.getElementById('whats-included').scrollIntoView({ behavior: 'smooth' });
  });
}

document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

const joinPoolBtn = document.getElementById('scrollToJoinPool');
if (joinPoolBtn) {
  joinPoolBtn.addEventListener('click', () => {
    const target = document.getElementById('join-the-pool');
    if (target) {
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
}