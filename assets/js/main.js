(() => {
  'use strict';

  const DATA = window.SCHOOL_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    galleryIndex: 0,
    galleryItems: [],
    lightboxRoot: null,
    scrollTicking: false,
    introDone: false
  };

  document.documentElement.classList.add('js-ready');

  // ------------------------------------------------------------
  // Content binding
  // ------------------------------------------------------------
  function bindSchoolContent() {
    $$('.js-school-name').forEach(el => { el.textContent = DATA.school.name; });
    $$('.js-tagline').forEach(el => { el.textContent = DATA.school.tagline; });
    $$('.js-address').forEach(el => { el.textContent = DATA.school.address; });
    $$('.js-phone').forEach(el => { el.textContent = DATA.school.phone; });
    $$('.js-email').forEach(el => { el.textContent = DATA.school.email; });
    $$('.js-website').forEach(el => { el.textContent = DATA.school.website; });
    $$('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

    const about = $('.js-about');
    if (about) about.textContent = DATA.school.description;

    const history = $('[data-about-history]');
    if (history) history.textContent = DATA.about.history;

    const vision = $('[data-vision]');
    if (vision) vision.textContent = DATA.about.vision;

    const missions = $('[data-missions]');
    if (missions) {
      missions.innerHTML = DATA.about.missions.map((item, index) => `
        <div class="timeline-item reveal from-left">
          <strong>${String(index + 1).padStart(2, '0')}</strong>
          <p>${escapeHTML(item)}</p>
        </div>
      `).join('');
    }
  }

  // ------------------------------------------------------------
  // Intro screen
  // ------------------------------------------------------------
  function finishIntro() {
    const intro = $('.site-intro');
    if (!intro || state.introDone) return;
    state.introDone = true;
    document.body.classList.remove('menu-lock');
    window.setTimeout(() => intro.classList.add('is-hidden'), reducedMotion ? 0 : 120);
  }

  function setupIntro() {
    const intro = $('.site-intro');
    if (!intro) return;
    document.body.classList.add('menu-lock');
    const delay = reducedMotion ? 80 : 900;
    window.setTimeout(finishIntro, delay);
    window.addEventListener('load', () => window.setTimeout(finishIntro, 120), { once: true });
  }

  // ------------------------------------------------------------
  // Navigation + mobile menu
  // ------------------------------------------------------------
  function setupNavigation() {
    const nav = $('.site-nav');
    const menuButton = $('.menu-btn');
    const menu = $('.nav-links');
    const backTop = $('.backtop');
    const progressBar = $('.scroll-progress span');

    const closeMenu = () => {
      if (!menu) return;
      menu.classList.remove('open');
      nav?.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Buka menu');
      document.body.classList.remove('menu-lock');
    };

    const toggleMenu = () => {
      if (!menu) return;
      const open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      nav?.classList.toggle('menu-open', open);
      menuButton?.setAttribute('aria-expanded', String(open));
      menuButton?.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      document.body.classList.toggle('menu-lock', open);
    };

    menuButton?.addEventListener('click', toggleMenu);
    $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (menu?.classList.contains('open') && !event.target.closest('.nav-inner')) closeMenu();
    });

    const currentPage = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const page = href.split('#')[0] || 'index.html';
      if (page === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    const updateNav = () => {
      const y = window.scrollY;
      nav?.classList.toggle('scrolled', y > 24);
      backTop?.classList.toggle('show', y > 520);
      updateScrollProgress(progressBar);
      updateScrollMotion(y);
      state.scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (state.scrollTicking) return;
      state.scrollTicking = true;
      requestAnimationFrame(updateNav);
    }, { passive: true });

    backTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ------------------------------------------------------------
  // Scroll progress
  // ------------------------------------------------------------
  function updateScrollProgress(progressBar) {
    if (!progressBar) return;

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  // ------------------------------------------------------------
  // Scroll reveal: fade in on enter + fade out on exit
  // ------------------------------------------------------------
  function setupReveal() {
    const elements = $$('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window) || reducedMotion) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('visible');
        } else if (el.dataset.replay !== 'false') {
          el.classList.remove('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((el, index) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 70}ms`);
      }
      observer.observe(el);
    });
  }

  function enhanceMotionTargets() {
    $$('section > .container > .section-head').forEach(el => el.classList.add('reveal', 'from-left'));
    $$('.section-head + .cards > .item, .section-head + .facility-grid > .facility').forEach((el, index) => {
      el.classList.add('reveal', index % 2 ? 'from-right' : 'zoom');
      el.style.setProperty('--reveal-delay', `${(index % 4) * 80}ms`);
    });
    $$('.gallery-item').forEach((el, index) => {
      el.classList.add('reveal', index % 2 ? 'from-right' : 'zoom');
      el.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
    });
    $$('.contact-grid > *, .feature > *, .story-note > *, .timeline-item').forEach((el, index) => {
      el.classList.add('reveal', index % 2 ? 'from-right' : 'from-left');
    });
  }

  // ------------------------------------------------------------
  // Subtle 2D/3D scroll motion
  // ------------------------------------------------------------
  function updateScrollMotion(scrollY) {
    if (reducedMotion) return;

    const hero = $('.hero');
    const orb = $('.hero-orb');
    if (hero) hero.style.setProperty('--hero-y', `${Math.min(scrollY * .08, 48)}px`);
    if (orb) {
      orb.style.setProperty('--orb-y', `${Math.min(scrollY * -.10, 80)}px`);
      orb.style.setProperty('--orb-rot', `${Math.min(scrollY * .025, 20)}deg`);
    }

    $$('[data-scroll-depth]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const depth = Number(el.dataset.scrollDepth || .08);
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.setProperty('--depth-y', `${center * depth * -0.18}px`);
    });

    const footer = $('footer');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const visible = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      footer.style.setProperty('--footer-line', visible.toFixed(2));
    }
  }

  function setupScrollDepth() {
    if (reducedMotion) return;
    $$('.photo, .feature img, .hero-orb, .facility, .item').forEach(el => {
      el.dataset.scrollDepth = el.dataset.scrollDepth || '.10';
    });
  }

  // ------------------------------------------------------------
  // Gentle pointer tilt for desktop
  // ------------------------------------------------------------
  function setupTilt() {
    if (reducedMotion || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    $$('.item, .facility, .photo').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--rx', `${y * -3}deg`);
        card.style.setProperty('--ry', `${x * 3}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });
    });
  }

  // ------------------------------------------------------------
  // Counters
  // ------------------------------------------------------------
  function setupCounters() {
    $$('.counter').forEach(counter => {
      const target = Math.max(0, Number(counter.dataset.target || 0));
      if (reducedMotion || !('IntersectionObserver' in window)) {
        counter.textContent = target.toLocaleString('id-ID');
        return;
      }

      let played = false;
      const observer = new IntersectionObserver(entries => {
        if (played || !entries[0].isIntersecting) return;
        played = true;
        const start = performance.now();
        const duration = 1100;
        const animate = now => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target).toLocaleString('id-ID');
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }, { threshold: .7 });
      observer.observe(counter);
    });
  }

  // ------------------------------------------------------------
  // Lists, facilities and filters
  // ------------------------------------------------------------
  function escapeHTML(value) {
    return String(value).replace(/[&<>\"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[char]));
  }

  // ------------------------------------------------------------
  // Media
  // ------------------------------------------------------------
  function bindMedia() {
    if (window.SCHOOL_MEDIA) {
      window.SCHOOL_MEDIA.bind();
    }
  }

  function imageMarkup(asset, alt) {
    const value = String(asset || '').trim();

    // Foto yang belum ditambahkan memakai placeholder.
    // Tidak menggunakan logo atau foto lain sebagai pengganti.
    const resolvedAsset = value || 'placeholder';

    return `<img data-asset="${escapeHTML(resolvedAsset)}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async">`;
  }

  function renderList(selector, items) {
    const root = $(selector);
    if (!root) return;
    root.innerHTML = items.map((item, index) => `
      <article class="item reveal ${index % 2 ? 'from-right' : 'zoom'}" data-category="${escapeHTML(item.category)}">
        ${imageMarkup(item.image, item.title)}
        <div class="item-body">
          <div class="meta">${escapeHTML(item.category)} · ${escapeHTML(item.year || item.date || '')}</div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </div>
      </article>
    `).join('');
  }

  function renderFacilities() {
    const root = $('[data-facilities]');
    if (!root) return;
    root.innerHTML = DATA.facilities.map((item, index) => `
      <article class="facility reveal ${index % 2 ? 'from-right' : 'zoom'}">
        ${imageMarkup(item.image, item.title)}
        <div class="facility-body">
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </div>
      </article>
    `).join('');
  }

  function setupFilters() {
    const filterGroups = [
      ['activities', '[data-list="activities"]'],
      ['achievements', '[data-list="achievements"]'],
      ['extracurriculars', '[data-list="extracurriculars"]'],
      ['gallery', '[data-gallery]']
    ];

    filterGroups.forEach(([name, listSelector]) => {
      const filterBox = $(`[data-filters="${name}"]`);
      const list = $(listSelector);
      if (!filterBox || !list) return;

      filterBox.addEventListener('click', event => {
        const button = event.target.closest('.filter');
        if (!button) return;
        const category = button.dataset.filter;

        $$('.filter', filterBox).forEach(item => item.classList.toggle('active', item === button));
        $$('[data-category]', list).forEach(item => {
          const visible = category === 'all' || item.dataset.category === category;
          item.hidden = !visible;
          if (visible) item.classList.add('visible');
        });
      });
    });
  }

  // ------------------------------------------------------------
  // Gallery + lightbox
  // ------------------------------------------------------------
  function setupGallery() {
    const roots = $$('[data-gallery]');
    const lightbox = $('.lightbox');
    if (!roots.length) return;

    roots.forEach(root => {
      root.innerHTML = DATA.gallery.map((item, index) => `
        <figure class="gallery-item reveal ${index % 2 ? 'from-right' : 'zoom'}" data-category="${escapeHTML(item.category)}" data-index="${index}">
          ${imageMarkup(item.image, item.title)}
          <figcaption class="gallery-label">${escapeHTML(item.category)}</figcaption>
        </figure>
      `).join('');

      root.addEventListener('click', event => {
        const item = event.target.closest('.gallery-item');
        if (!item) return;
        openLightbox(Number(item.dataset.index), root);
      });
    });

    const visibleItems = root => $$('.gallery-item', root).filter(item => !item.hidden);

    function openLightbox(index, root) {
      if (!lightbox) return;
      state.galleryIndex = index;
      state.lightboxRoot = root;
      state.galleryItems = visibleItems(root);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-lock');
      updateLightbox();
    }

    function updateLightbox() {
      const image = $('img', lightbox);
      const currentData = DATA.gallery[state.galleryIndex];
      if (!image || !currentData) return;
      image.alt = currentData.title;
      if (window.SCHOOL_MEDIA) {
        window.SCHOOL_MEDIA.refresh(image, currentData.image);
      } else {
        image.src = currentData.image || '';
      }
    }

    function moveLightbox(step) {
      if (!state.galleryItems.length) return;
      const indexes = state.galleryItems.map(item => Number(item.dataset.index));
      let position = indexes.indexOf(state.galleryIndex);
      if (position < 0) position = 0;
      state.galleryIndex = indexes[(position + step + indexes.length) % indexes.length];
      updateLightbox();
    }

    function closeLightbox() {
      lightbox?.classList.remove('open');
      lightbox?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-lock');
    }

    lightbox?.addEventListener('click', event => {
      if (event.target === lightbox || event.target.closest('.close')) closeLightbox();
      if (event.target.closest('.prev')) moveLightbox(-1);
      if (event.target.closest('.next')) moveLightbox(1);
    });

    document.addEventListener('keydown', event => {
      if (!lightbox?.classList.contains('open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    });
  }

  // ------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------
  function init() {
    bindSchoolContent();
    setupIntro();
    setupNavigation();

    renderList('[data-list="activities"]', DATA.activities);
    renderList('[data-list="achievements"]', DATA.achievements);
    renderList('[data-list="extracurriculars"]', DATA.extracurriculars);
    renderList('[data-list="activities-home"]', DATA.activities.slice(0, 3));
    renderList('[data-list="achievements-home"]', DATA.achievements.slice(0, 3));
    renderList('[data-list="extracurriculars-home"]', DATA.extracurriculars.slice(0, 3));
    renderFacilities();
    setupGallery();
    bindMedia();
    setupFilters();
    enhanceMotionTargets();
    setupScrollDepth();
    setupReveal();
    // Dynamic content is rendered before this point, so bind local media once more.
    bindMedia();
    setupCounters();
    setupTilt();

    updateScrollMotion(window.scrollY);
  }

  init();
})();
