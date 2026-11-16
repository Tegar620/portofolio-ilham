/* ================================================================
   SPLASH SCREEN — splash.js
   Alur animasi:
   0–0.5s   : Logo inisial I muncul (CSS handles)
   0.5–1s   : Efek glow pada logo (CSS handles)
   1–1.5s   : Tulisan Welcome muncul (CSS handles)
   1.5–2s   : Progress bar berjalan + counter label
   2s       : Transisi ke homepage
   ================================================================ */

(function () {
  'use strict';

  /* ── Prevent main content flash ───────────────────────────── */
  document.body.classList.add('splash-active');

  /* ── Grab elements ─────────────────────────────────────────── */
  const splash      = document.getElementById('splash-screen');
  const bar         = document.getElementById('splash-bar');
  const label       = document.getElementById('splash-label');
  const canvas      = document.getElementById('splash-canvas');

  if (!splash) return;   // safety guard

  /* ================================================================
     PARTICLE CANVAS
     ================================================================ */
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  /* Particle definition */
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.life   = 1;
      this.decay  = Math.random() * 0.003 + 0.001;
      this.color  = Math.random() > 0.5 ? '37,99,235' : '124,58,237';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.6})`;
      ctx.fill();
    }
  }

  /* Create initial particles */
  for (let i = 0; i < 90; i++) particles.push(new Particle());

  let animId;
  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ================================================================
     PROGRESS BAR — real JS counter (1.5–2s window)
     ================================================================ */
  let progress = 0;
  let countRaf;

  function runProgress() {
    const startTime = performance.now();
    const duration  = 600; // ms (matches CSS 0.6s)

    function step(now) {
      const elapsed = now - startTime;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (label) label.textContent = progress + '%';
      if (progress < 100) {
        countRaf = requestAnimationFrame(step);
      }
    }
    countRaf = requestAnimationFrame(step);
  }

  // Start counting at 1.5s to sync with CSS animation
  setTimeout(runProgress, 1500);

  /* ================================================================
     TRANSITION TO HOMEPAGE — at 2.4s
     (extra 0.4s buffer after 2s alur so CSS finishes cleanly)
     ================================================================ */
  const TOTAL_DURATION  = 2400;  // ms before exit starts
  const EXIT_DURATION   = 700;   // ms for fade-out

  setTimeout(() => {

    /* 1. Add exit class → triggers fade + scale CSS */
    splash.classList.add('splash-exit');

    /* 2. Stop particle canvas */
    cancelAnimationFrame(animId);
    cancelAnimationFrame(countRaf);

    /* 3. After exit animation, fully hide splash & unlock scroll */
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      document.body.classList.remove('splash-active');
      /* Trigger any main-page entrance animations */
      document.dispatchEvent(new CustomEvent('splashDone'));
    }, EXIT_DURATION);

  }, TOTAL_DURATION);

  /* ================================================================
     SKIP — allow user to click/press to skip splash
     ================================================================ */
  let skipped = false;
  function skipSplash() {
    if (skipped) return;
    skipped = true;
    clearTimeout(exitTimer); // won't fire if already past
    splash.classList.add('splash-exit');
    cancelAnimationFrame(animId);
    cancelAnimationFrame(countRaf);
    if (label) label.textContent = '100%';
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      document.body.classList.remove('splash-active');
      document.dispatchEvent(new CustomEvent('splashDone'));
    }, EXIT_DURATION);
  }

  // Click anywhere after 1.2s to skip
  setTimeout(() => {
    splash.addEventListener('click', skipSplash, { once: true });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skipSplash();
    }, { once: true });

    // Show subtle skip hint
    const hint = document.createElement('p');
    hint.textContent = 'Klik di mana saja untuk melewati';
    hint.style.cssText = `
      position: absolute;
      bottom: 48px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Poppins', sans-serif;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      z-index: 20;
      animation: fadeInHint 0.4s ease forwards;
      white-space: nowrap;
      pointer-events: none;
    `;
    splash.appendChild(hint);

    const hs = document.createElement('style');
    hs.textContent = `@keyframes fadeInHint { from{opacity:0;} to{opacity:1;} }`;
    document.head.appendChild(hs);
  }, 1200);

  /* ================================================================
     MOUSE PARALLAX — logo reacts to cursor
     ================================================================ */
  const logoWrap = document.getElementById('splash-logo');
  if (logoWrap) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;  // -1 to 1
      const dy = (e.clientY - cy) / cy;  // -1 to 1
      logoWrap.style.transform = `
        perspective(600px)
        rotateY(${dx * 10}deg)
        rotateX(${-dy * 10}deg)
        translateZ(20px)
      `;
    }, { passive: true });
  }

  /* ================================================================
     BURST PARTICLES on logo area — triggered at 0.5s (glow phase)
     ================================================================ */
  setTimeout(() => {
    burstParticles(W / 2, H / 2, 20);
  }, 550);

  function burstParticles(ox, oy, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const bp = {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '37,99,235' : '124,58,237',
      };
      particles.push({
        update() {
          this.x += this.vx * 1.5;
          this.y += this.vy * 1.5;
          this.vx *= 0.95;
          this.vy *= 0.95;
          this.life -= 0.025;
          if (this.life <= 0) {
            const idx = particles.indexOf(this);
            if (idx > -1) particles.splice(idx, 1);
          }
        },
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * this.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
          ctx.fill();
        }
      });
    }
  }

  /* ── Console signature ──────────────────────────────────────── */
  console.log(
    '%c✦ SPLASH SCREEN LOADED',
    'color:#7C3AED; font-weight:900; font-size:14px;'
  );

})();
