/* =====================================================
   PORTOFOLIO ILHAM — JAVASCRIPT (ENHANCED ANIMATIONS)
   ===================================================== */

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });

  // ── Active nav link on scroll ─────────────────────────────
  const sections = ['tentang', 'project', 'sertifikat', 'skill', 'kontak'];

  function updateActiveNav() {
    let current = 'tentang';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ── Hamburger menu ────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── Reveal on scroll — AOS-style Fade-up ─────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Skill tag staggered animation on scroll ───────────────
  const skillCatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillCatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(el => skillCatObserver.observe(el));

  // ── Back to Top button ────────────────────────────────────
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Contact form ──────────────────────────────────────────
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btnText = form.querySelector('.btn-text');
  const btnLoad = form.querySelector('.btn-loading');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm();
      return;
    }
    if (!isValidEmail(email)) {
      document.getElementById('email').style.borderColor = '#ef4444';
      document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
      setTimeout(() => {
        document.getElementById('email').style.borderColor = '';
        document.getElementById('email').style.boxShadow = '';
      }, 2000);
      return;
    }

    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';
    form.querySelector('.btn-submit').disabled = true;

    setTimeout(() => {
      btnText.style.display = 'inline';
      btnLoad.style.display = 'none';
      form.querySelector('.btn-submit').disabled = false;
      success.style.display = 'block';
      form.reset();
      setTimeout(() => success.style.display = 'none', 5000);
    }, 1800);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm() {
    form.style.animation = 'none';
    form.offsetHeight; // reflow
    form.style.animation = 'shake 0.4s ease';
  }

  // ── Keyframes injected dynamically ───────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
    @keyframes ripple {
      to { transform: translate(-50%,-50%) scale(4); opacity: 0; }
    }
    @keyframes particleFade {
      0%   { opacity: 1; transform: translate(0,0) scale(1); }
      100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
    }
  `;
  document.head.appendChild(style);

  // ── Typing animation for Section Title ───────────────────
  function typeWriterEffect(el, text, speed = 70, callback) {
    el.textContent = '';
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(tick, speed);
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  // Profile name typing on page load
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    const originalText = profileName.textContent.trim();
    profileName.textContent = '';
    setTimeout(() => {
      typeWriterEffect(profileName, originalText, 80, () => {
        profileName.classList.add('typed'); // hide blinking cursor after done
      });
    }, 600);
  }

  // ── Particle cursor glow (smooth follow) ─────────────────
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(57,208,216,0.05) 0%, rgba(168,85,247,0.02) 50%, transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
    transition: left 0.08s linear, top 0.08s linear;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  // ── Ripple effect on buttons ──────────────────────────────
  function addRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      transform: translate(-50%,-50%) scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  document.querySelectorAll('.btn-cv, .btn-submit').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', addRipple);
  });

  // ── Project card magnetic tilt effect ────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Animated counter for any [data-count] elements ───────
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target + '+'; clearInterval(timer); return; }
      el.textContent = Math.floor(start) + '+';
    }, 16);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        if (!isNaN(target)) animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── Tech badge custom hover colors ───────────────────────
  const techColors = {
    'HTML5': '#e34f26', 'CSS3': '#1572b6', 'JavaScript': '#f7df1e',
    'React': '#61dafb', 'PHP': '#777bb4', 'Laravel': '#ff2d20',
    'Python': '#3776ab', 'Node.js': '#339933', 'MySQL': '#4479a1',
    'Firebase': '#ffca28', 'Android': '#3ddc84', 'Git': '#f05032',
    'VS Code': '#007acc', 'Figma': '#f24e1e', 'Postman': '#ff6c37',
  };

  document.querySelectorAll('.tech-badge').forEach(badge => {
    const text = badge.textContent.trim();
    const color = Object.entries(techColors).find(([k]) => text.includes(k));
    if (color) {
      badge.addEventListener('mouseenter', () => {
        badge.style.borderColor = color[1];
        badge.style.color = color[1];
        badge.style.background = color[1] + '15';
        badge.style.boxShadow = `0 0 20px ${color[1]}33`;
      });
      badge.addEventListener('mouseleave', () => {
        badge.style.borderColor = '';
        badge.style.color = '';
        badge.style.background = '';
        badge.style.boxShadow = '';
      });
    }
  });

  // ── Lightbox ──────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  window.openLightbox = function (src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // ── Smooth section reveal on first load ───────────────────
  // Trigger visible for elements already in viewport
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('visible');
      }
    });
  }, 100);

  // ── Init ──────────────────────────────────────────────────
  updateActiveNav();
  toggleBackToTop();

  console.log('%c🚀 Portofolio Ilham', 'color: #39d0d8; font-size: 20px; font-weight: bold;');
  console.log('%cAnimasi: AOS-style • Floating • Typing • Hover Glow • GSAP-inspired', 'color: #a855f7;');

})();
