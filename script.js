/* ============================================================
   RM LOCAÇÕES — script.js
   - Scroll reveal com IntersectionObserver
   - Animação de contadores (hero stats)
   - Menu mobile toggle
   - Sticky header shadow
   - Smooth scroll com offset para header fixo
   - Ano automático no footer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Ano atual no footer ── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Sticky header shadow ── */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Menu mobile ── */
  const menuToggle  = document.querySelector('.mobile-menu-toggle');
  const mobileNav   = document.getElementById('mobile-nav');
  const menuIcon    = menuToggle?.querySelector('i');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      if (menuIcon) {
        menuIcon.className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
      }
    });

    // Fechar ao clicar em um link do menu mobile
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        if (menuIcon) menuIcon.className = 'ti ti-menu-2';
      });
    });
  }

  /* ── Smooth scroll com offset para header fixo ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll Reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar tudo
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Animação de contadores (hero stats) ── */
  const counterEls = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  } else {
    counterEls.forEach(el => {
      el.textContent = el.getAttribute('data-count');
    });
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top    = section.offsetTop - (header?.offsetHeight || 0) - 60;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + section.id
          );
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

});
