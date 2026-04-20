/* ═══════════════════════════════════════════════════════════════
   JEAN FONTAINE — PORTFOLIO 2026
═══════════════════════════════════════════════════════════════ */

/* ─── Custom Cursor ──────────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
(function tickCursor() {
  cx += (mx - cx) * 0.14; cy += (my - cy) * 0.14;
  cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
  requestAnimationFrame(tickCursor);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('c-link'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('c-link'));
});
document.querySelectorAll('.card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('c-card'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('c-card'));
});

/* ─── Nav scroll ─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

/* ─── Hero entrance ──────────────────────────────────────────── */
document.querySelectorAll('.ht-word').forEach((w, i) => {
  setTimeout(() => {
    w.style.transition = `transform 1.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`;
    w.style.transform  = 'translateY(0)';
  }, 100);
});
['.hero-kicker', '.hero-bottom', '.hero-cat-wrap', '.hero-logo-wrap', '.hero-scroll-hint'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  setTimeout(() => {
    el.style.transition = `opacity 1s var(--ease), transform 1s var(--ease)`;
    el.style.opacity    = '1';
    el.style.transform  = sel === '.hero-cat-wrap' ? 'translateY(0) rotate(-5deg)' : 'translateY(0)';
  }, 600 + i * 120);
});

/* ─── Tagline cycling ────────────────────────────────────────── */
const taglineWord = document.getElementById('taglineWord');
const tagWords = ['Designer', 'Développeur', 'Illustrateur', 'Motion'];
let wordIdx = 0;
setInterval(() => {
  taglineWord.classList.add('fade-out');
  setTimeout(() => {
    wordIdx = (wordIdx + 1) % tagWords.length;
    taglineWord.textContent = tagWords[wordIdx];
    taglineWord.classList.remove('fade-out');
  }, 250);
}, 2400);

/* ─── Filter ─────────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.card');
const countEl    = document.getElementById('projectsCount');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    let visible  = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) { card.classList.remove('hidden', 'hidden-done'); visible++; }
      else { card.classList.add('hidden'); setTimeout(() => card.classList.add('hidden-done'), 420); }
    });
    countEl.textContent = visible + ' projet' + (visible > 1 ? 's' : '');
  });
});

/* ─── Video hover autoplay ───────────────────────────────────── */
document.querySelectorAll('.card').forEach(card => {
  const video = card.querySelector('.card-video');
  if (!video) return;
  let t;
  card.addEventListener('mouseenter', () => {
    t = setTimeout(() => video.play().then(() => card.classList.add('playing')).catch(() => {}), 200);
  });
  card.addEventListener('mouseleave', () => {
    clearTimeout(t); video.pause(); video.currentTime = 0; card.classList.remove('playing');
  });
});

/* ─── Lightbox ───────────────────────────────────────────────── */
const lb         = document.getElementById('lb');
const lbImg      = document.getElementById('lbImg');
const lbVideo    = document.getElementById('lbVideo');
const lbThumbs   = document.getElementById('lbThumbs');
const lbTitle    = document.getElementById('lbTitle');
const lbDesc     = document.getElementById('lbDesc');
const lbCat      = document.getElementById('lbCat');
const lbYear     = document.getElementById('lbYear');
const lbTags     = document.getElementById('lbTags');
const lbLink     = document.getElementById('lbLink');
const lbClose    = document.getElementById('lbClose');
const lbBackdrop = document.getElementById('lbBackdrop');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');

let galleryImages = [], galleryIdx = 0;

function openLightbox(card) {
  const overlay = card.querySelector('.card-overlay');
  const isVideo = !!card.querySelector('.card-video');
  const imgEl   = card.querySelector('.card-img');
  const videoEl = card.querySelector('.card-video');
  const raw     = card.dataset.gallery || '';
  const extLink = card.dataset.link    || '';

  galleryImages = raw ? raw.split('|').filter(Boolean) : (imgEl ? [imgEl.src] : []);
  galleryIdx    = 0;

  lbTitle.textContent = overlay.querySelector('.card-title').textContent;
  lbDesc.textContent  = overlay.querySelector('.card-desc').textContent;
  lbCat.textContent   = overlay.querySelector('.card-cat').textContent;
  lbYear.textContent  = overlay.querySelector('.card-year').textContent;

  lbTags.innerHTML = '';
  overlay.querySelectorAll('.card-tags span').forEach(t => {
    const s = document.createElement('span'); s.textContent = t.textContent; lbTags.appendChild(s);
  });

  extLink ? (lbLink.href = extLink, lbLink.classList.remove('hidden')) : lbLink.classList.add('hidden');

  if (isVideo) {
    lb.classList.add('is-video'); lbVideo.src = videoEl.src; lbVideo.load();
  } else {
    lb.classList.remove('is-video'); renderGalleryImage(0);
  }
  renderThumbs(isVideo); updateArrows();
  lb.classList.add('open'); document.body.style.overflow = 'hidden';
}
function renderGalleryImage(idx) {
  lbImg.classList.add('switching');
  setTimeout(() => { lbImg.src = galleryImages[idx]; lbImg.classList.remove('switching'); }, 200);
  document.querySelectorAll('.lb-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}
function renderThumbs(isVideo) {
  lbThumbs.innerHTML = '';
  if (isVideo || galleryImages.length <= 1) return;
  galleryImages.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src; img.className = 'lb-thumb' + (i === 0 ? ' active' : '');
    img.addEventListener('click', () => { galleryIdx = i; renderGalleryImage(i); updateArrows(); });
    lbThumbs.appendChild(img);
  });
}
function updateArrows() {
  lbPrev.disabled = galleryIdx <= 0;
  lbNext.disabled = galleryIdx >= galleryImages.length - 1;
}
function closeLightbox() {
  lb.classList.remove('open'); document.body.style.overflow = '';
  setTimeout(() => { lbVideo.pause(); lbVideo.src = ''; lb.classList.remove('is-video'); }, 400);
}

cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', e => { e.stopPropagation(); if (galleryIdx > 0) { galleryIdx--; renderGalleryImage(galleryIdx); updateArrows(); } });
lbNext.addEventListener('click', e => { e.stopPropagation(); if (galleryIdx < galleryImages.length - 1) { galleryIdx++; renderGalleryImage(galleryIdx); updateArrows(); } });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && !lbPrev.disabled) lbPrev.click();
  if (e.key === 'ArrowRight' && !lbNext.disabled) lbNext.click();
});

/* ═══════════════════════════════════════════════════════════════
   GSAP
═══════════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ─── Scroll animations de base ──────────────────────────────── */
gsap.fromTo('.card',
  { opacity: 0, y: 48, scale: 0.96 },
  { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: { amount: 1.2 }, ease: 'power3.out',
    scrollTrigger: { trigger: '.projects-grid', start: 'top 82%' } }
);
function splitAndAnimate(el) {
  if (!el) return;
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = parts.map(p => `<span style="display:block;overflow:hidden"><span class="sl">${p}</span></span>`).join('');
  gsap.fromTo(el.querySelectorAll('.sl'),
    { yPercent: 105 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 80%' } }
  );
}
splitAndAnimate(document.querySelector('.about-title'));
gsap.fromTo('.about-body, .about-grid, .btn-cv',
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-right', start: 'top 70%' } }
);
gsap.fromTo('.about-cat-sticker',
  { opacity: 0, x: -30, rotate: -20 },
  { opacity: 1, x: 0, rotate: -4, duration: 1.4, ease: 'elastic.out(1,0.5)',
    scrollTrigger: { trigger: '.about-cat-block', start: 'top 85%' } }
);
gsap.fromTo('.contact-title span',
  { yPercent: 110 },
  { yPercent: 0, duration: 1.3, stagger: 0.1, ease: 'power4.out',
    scrollTrigger: { trigger: '.contact-title', start: 'top 80%' } }
);
gsap.fromTo('.clink',
  { opacity: 0, x: -20 },
  { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-links', start: 'top 80%' } }
);

/* Easter eggs */
const heroCat = document.querySelector('.hero-cat');
if (heroCat) heroCat.addEventListener('click', () =>
  gsap.to(heroCat, { rotation: '+=360', duration: 0.6, ease: 'power2.inOut' })
);
const aboutCatSticker = document.querySelector('.about-cat-sticker');
if (aboutCatSticker) aboutCatSticker.addEventListener('click', () =>
  gsap.to(aboutCatSticker, { rotation: '+=360', scale: 1.15, duration: 0.7, ease: 'back.out(1.7)',
    onComplete: () => gsap.to(aboutCatSticker, { scale: 1, duration: 0.4 }) })
);

/* ═══════════════════════════════════════════════════════════════
   EFFET 8 — FOND ANIMÉ PAR SECTION
═══════════════════════════════════════════════════════════════ */
const sectionColors = {
  hero:    '#0c0c0f',
  work:    '#090d11',
  about:   '#0f0b1a',
  contact: '#160c10',
};
Object.entries(sectionColors).forEach(([id, color]) => {
  const el = document.getElementById(id);
  if (!el) return;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 55%', end: 'bottom 45%',
    onEnter:     () => (document.body.style.backgroundColor = color),
    onEnterBack: () => (document.body.style.backgroundColor = color),
  });
});

/* ═══════════════════════════════════════════════════════════════
   EFFET 6 — HERO CINÉMATIQUE
   Le fond disparaît. Les lettres s'écartent et restent en dernier,
   gigantesques, pendant que les projets apparaissent derrière.
═══════════════════════════════════════════════════════════════ */
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=100%',
    scrub: 2,
    pin: true,
    pinSpacing: true,
  },
});
// Le fond (blobs + logo) disparaît en premier
heroTL.to('.hero-bg, .hero-logo-wrap', { opacity: 0, duration: 0.4, ease: 'none' }, 0);
// Les éléments secondaires s'effacent
heroTL.to('.hero-kicker, .hero-bottom, .hero-cat-wrap, .hero-scroll-hint',
  { opacity: 0, y: -20, stagger: 0.03, duration: 0.35, ease: 'none' }, 0.05);
// Les lettres s'étirent
heroTL.to('.ht-word', { letterSpacing: '0.65em', ease: 'none', duration: 0.6 }, 0.1);
// Les lettres s'effacent en dernier — on voit les projets derrière avant qu'elles partent
heroTL.to('.ht-word', { opacity: 0, duration: 0.3, ease: 'none' }, 0.7);

/* ═══════════════════════════════════════════════════════════════
   EFFET 10 — LIQUID TYPE (lettres magnétiques)
   Chaque lettre est attirée vers le curseur
═══════════════════════════════════════════════════════════════ */
// Split en lettres individuelles
const heroTitleEl = document.querySelector('.hero-title');
document.querySelectorAll('.ht-word').forEach(word => {
  const text = word.textContent;
  word.innerHTML = text.split('').map(ch => `<span class="ht-letter">${ch}</span>`).join('');
});
heroTitleEl.classList.add('letters-active');

// Stocker les refs une seule fois
const htLetters = Array.from(heroTitleEl.querySelectorAll('.ht-letter'));

document.addEventListener('mousemove', e => {
  htLetters.forEach(letter => {
    const r    = letter.getBoundingClientRect();
    const lx   = r.left + r.width  / 2;
    const ly   = r.top  + r.height / 2;
    const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
    if (dist < 180) {
      const pull  = Math.pow(1 - dist / 180, 2.2) * 30;
      const angle = Math.atan2(e.clientY - ly, e.clientX - lx);
      gsap.to(letter, {
        x: Math.cos(angle) * pull,
        y: Math.sin(angle) * pull,
        duration: 0.3, ease: 'power2.out', overwrite: 'auto',
      });
    } else {
      gsap.to(letter, {
        x: 0, y: 0,
        duration: 1.1, ease: 'elastic.out(1, 0.35)', overwrite: 'auto',
      });
    }
  });
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   EFFET 4 — CURSOR TRAIL (traîne de miniatures de projets)
═══════════════════════════════════════════════════════════════ */
const trailSrcs = [
  'assets/scraped/a20a3c03-620d-4ac3-bd50-97330377a96f_rw_1920.jpg',
  'assets/scraped/6014510e-9595-4aad-8c5c-148e1486ed44_rw_1920.png',
  'assets/scraped/8731b2e5-e74b-48d5-b605-e5542ffae801_rw_1920.jpg',
  'assets/scraped/8ab0d47c-a4e8-4c18-b064-2578a50345fc_rw_1920.jpg',
  'assets/scraped/94b41fe2-23c7-46d9-badb-9b43c34af7a2_rw_1200.png',
  'assets/branding/mmirage-affiche-principale.png',
  'assets/branding/sako-mockup-3d.png',
  'assets/scraped/d628991c-bb6e-4e64-90c7-9e15f6a5f15f_rw_600.png',
];
let trailIdx = 0, lastTrailTime = 0, prevX = 0, prevY = 0;

document.addEventListener('mousemove', e => {
  const speed = Math.hypot(e.clientX - prevX, e.clientY - prevY);
  prevX = e.clientX; prevY = e.clientY;

  const now = Date.now();
  if (now - lastTrailTime < 100 || speed < 6) return;

  // Pas de trail sur les cartes, la nav et le lightbox
  const under = document.elementFromPoint(e.clientX, e.clientY);
  if (under && under.closest('.card, .nav, #lb, .about-cat-sticker')) return;

  lastTrailTime = now;

  const el  = document.createElement('div');
  const img = document.createElement('img');
  img.src   = trailSrcs[trailIdx % trailSrcs.length];
  trailIdx++;
  el.appendChild(img);

  const rot = (Math.random() - 0.5) * 32;
  Object.assign(el.style, {
    position:      'fixed',
    left:          e.clientX + 'px',
    top:           e.clientY + 'px',
    width:         '96px',
    borderRadius:  '10px',
    overflow:      'hidden',
    zIndex:        '9980',
    pointerEvents: 'none',
    boxShadow:     '0 8px 28px rgba(0,0,0,0.6)',
  });
  Object.assign(img.style, { width: '100%', display: 'block', aspectRatio: '3/4', objectFit: 'cover' });
  document.body.appendChild(el);

  // Propriétés GSAP natives — évite les conflits avec les transform strings CSS
  gsap.set(el, { xPercent: -50, yPercent: -50, rotation: rot, scale: 0.5, opacity: 0 });

  // Apparition
  gsap.to(el, {
    opacity: 1, scale: 1,
    duration: 0.22, ease: 'back.out(1.4)',
    onComplete() {
      // Disparition en flottant vers le haut
      gsap.to(el, {
        opacity: 0,
        top:      (e.clientY - 70) + 'px',
        rotation: rot * 1.4,
        scale:    0.75,
        duration: 0.5, delay: 0.35, ease: 'power2.in',
        onComplete: () => el.remove(),
      });
    },
  });
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   EFFET 3 — LIQUID WIPE (transition en cercle liquide)
   S'active sur tous les liens de navigation ancre
═══════════════════════════════════════════════════════════════ */
const liquidWipe = document.getElementById('liquidWipe');
const wipeColors = {
  '#work':    '#7c3aed',
  '#about':   '#ff2d78',
  '#contact': '#00e5a0',
};

document.querySelectorAll('a[href^="#"]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href === '#') return;

  link.addEventListener('click', e => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    const r     = link.getBoundingClientRect();
    const ox    = r.left + r.width  / 2;
    const oy    = r.top  + r.height / 2;
    const color = wipeColors[href] || '#ff2d78';

    liquidWipe.style.background    = color;
    liquidWipe.style.pointerEvents = 'all';

    // Réinitialise proprement avant d'animer
    gsap.killTweensOf(liquidWipe);
    gsap.set(liquidWipe, { clipPath: `circle(0% at ${ox}px ${oy}px)` });

    gsap.to(liquidWipe, {
      clipPath:  `circle(160% at ${ox}px ${oy}px)`,
      duration:  0.52,
      ease:      'power3.inOut',
      onComplete() {
        target.scrollIntoView({ behavior: 'instant' });
        gsap.to(liquidWipe, {
          clipPath:  `circle(0% at ${ox}px ${oy}px)`,
          duration:  0.48,
          ease:      'power3.inOut',
          delay:     0.06,
          onComplete: () => gsap.set(liquidWipe, { pointerEvents: 'none' }),
        });
      },
    });
  });
});
