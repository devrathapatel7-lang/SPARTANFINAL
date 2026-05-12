// =============================================================================
// SPARTAN ROOFING — INTERACTIVITY
// =============================================================================

// Inline SVG icons used by JS-rendered content
const ICONS = {
  menu:        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  x:           '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>',
  check:       '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
};

// Real Google reviews — loaded by the testimonial carousel below
const TESTIMONIALS = [
  {
    name: 'Gregory Corsan',
    badge: 'Google Review · Local Guide · 31 reviews',
    quote: 'Leo and his team just finished up the new roof on our home and it looks GREAT! Every interaction with Leo and Megan (in the office) was timely, satisfactory and reasonable. In a world where no one returns your emails or phone calls, it is a pleasure to work with a company that values customer service.'
  },
  {
    name: 'Anne McNutt',
    badge: 'Google Review · 4 reviews · 15 photos',
    quote: 'I went with Spartan Roofing because I did not have to ask Leo about replacing the decking. He recommended it. That my friends is the sign of a true roofer. Other roofers might have charged me to put another roof on some seriously outdated decking telling me I didn\'t need new. Not Leo. The estimate was extremely reasonable. When they took the roof off they found some additional problems. Leo offered me affordable solutions. The job they did on the gutters was great too. The price was reasonable and they were custom cut on sight. It was a pleasure working with Spartan. I highly recommend them.'
  },
  {
    name: 'Cathy Tirri',
    badge: 'Google Review · 10 reviews',
    quote: 'I had a leak coming in through one of my window sill after I had new gutters installed. I thought for sure the leak was caused by the gutters. Gutter guy said it was the roof which had never leaked before. I asked Spartan roofing to come out — they diagnosed the real issue and fixed it right. Great price.'
  },
  {
    name: 'Michael Bras',
    badge: 'Google Review · 4 reviews',
    quote: 'Great price. Messaged them last week and Leo came out the same day to check out the work I needed done. Gave me a quote within a couple of hours and an awesome price! Leo is super professional and very knowledgeable of the work he does.'
  },
  {
    name: 'Rebecca Wiley',
    badge: 'Google Review · 1 review · 6 photos',
    quote: 'Spartan did a fabulous job. He was honest and upfront. Didn\'t try to smooth talk his way into the job (many try that). Straightforward. Did everything I asked. Gutted the roof and rebuilt everything. Gutters are working perfectly. They were even willing to work with the county grant. Definitely recommend!'
  },
  {
    name: 'Jinny Lim',
    badge: 'Google Review · 1 review',
    quote: 'We recently replaced our roof with Spartan. We are very pleased with the final product. Leo and his crew did an incredible job from start to finish. When looking for a roofer we received several quotes. Leo came highly recommended by a friend, and we are so glad we went with Spartan.'
  },
  {
    name: 'Veritas',
    badge: 'Google Review · 2 reviews',
    quote: 'We are very satisfied with the work Leo did for us (roof and gutters). He is a very reliable and honest person who stands by his choices. He is approachable and if you have any questions or concerns after they finish the work he is always there to help.'
  }
];

(function () {
  'use strict';

  // ---- Sticky header background on scroll ----
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu toggle ----
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('svg');
      if (mobileMenu.classList.contains('open')) {
        menuToggle.innerHTML = ICONS.x;
      } else {
        menuToggle.innerHTML = ICONS.menu;
      }
    });
    // Close menu when clicking a link inside
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.innerHTML = ICONS.menu;
      });
    });
  }

  // ---- Scroll reveal (IntersectionObserver) ----
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- Testimonial carousel ----
  const tCard = document.querySelector('[data-testimonial-card]');
  if (tCard) {
    const quoteEl = tCard.querySelector('[data-t-quote]');
    const nameEl = tCard.querySelector('[data-t-name]');
    const badgeEl = tCard.querySelector('[data-t-badge]');
    const dotsWrap = document.querySelector('[data-t-dots]');
    const prev = document.querySelector('[data-t-prev]');
    const next = document.querySelector('[data-t-next]');
    let idx = 0;

    const render = () => {
      const t = TESTIMONIALS[idx];
      quoteEl.textContent = '"' + t.quote + '"';
      nameEl.textContent = t.name;
      badgeEl.textContent = t.badge;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });
      }
    };

    if (dotsWrap) {
      dotsWrap.innerHTML = TESTIMONIALS.map((_, i) =>
        '<button class="t-dot" data-i="' + i + '" aria-label="Show review ' + (i + 1) + '"></button>'
      ).join('');
      dotsWrap.querySelectorAll('.t-dot').forEach((d) => {
        d.addEventListener('click', () => { idx = parseInt(d.dataset.i, 10); render(); });
      });
    }
    if (prev) prev.addEventListener('click', () => { idx = (idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; render(); });
    if (next) next.addEventListener('click', () => { idx = (idx + 1) % TESTIMONIALS.length; render(); });
    render();
  }

  // ---- Smooth-scroll for in-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Contact form submit — sends to dev@seaagency.co via FormSubmit AJAX ----
  const form = document.querySelector('[data-contact-form]');
  const formCard = document.querySelector('[data-form-card]');
  if (form && formCard) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v, k) => { payload[k] = v; });
      payload._subject = 'New Spartan Roofing Inspection Request';
      payload._template = 'table';
      payload._captcha = 'false';
      payload._cc = 'info@spartanroofingnj.com';
      payload._cc = 'info@spartanroofingnj.com';

      try {
        const res = await fetch('https://formsubmit.co/ajax/dev@seaagency.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('submit failed');
      } catch (err) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        alert('Submission failed. Please call us at 973-938-2776 or email info@spartanroofingnj.com.');
        return;
      }

      formCard.innerHTML =
        '<div class="form-success">' +
          ICONS.check.replace('width="22"', 'width="48"').replace('height="22"', 'height="48"') +
          '<h3>Got it. We\'ll be in touch.</h3>' +
          '<p>Expect a call within 2 business hours. Faster if you marked it urgent.</p>' +
        '</div>';
    });
  }

  // ---- Set current year in footer ----
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
