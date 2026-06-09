/* RefGC-SR² Project Page — interactions */

// Copy BibTeX
function copyBibtex() {
  const bibtex = document.querySelector('.bibtex-block code');
  if (!bibtex) return;
  const text = bibtex.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    const original = btn.textContent;
    btn.textContent = '✓ Copied!';
    // HRGT sage green from project palette (--color-HRGT)
    btn.style.background = '#78B19B';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 1800);
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection observer for fade-in on scroll (cards, figures)
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in to designated elements
document.querySelectorAll('.contrib-card, .design-card, .us-card, .method-figure, .qual-figure, .insight-box, .formula-box, .table-wrap').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
  fadeObserver.observe(el);
});

// Add visible class via CSS injection
const style = document.createElement('style');
style.textContent = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Demo showcase carousel — prev/next arrows + dot indicators cycle through
// the category slides (Benchmark → In the wild).
(function initDemoCarousel() {
  const carousel = document.querySelector('.demo-carousel');
  if (!carousel) return;

  // Two-level navigation: top-level category (Benchmark / In the wild) ×
  // four scene sub-buttons. A slide is identified by (data-cat, data-scene).
  const slides   = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const catBtns  = Array.from(carousel.querySelectorAll('.carousel-cat'));
  const sceneBtns = Array.from(carousel.querySelectorAll('.carousel-tab'));
  const dots     = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const heads    = Array.from(carousel.querySelectorAll('.demo-block-head'));
  const prevBtn  = carousel.querySelector('.carousel-arrow--prev');
  const nextBtn  = carousel.querySelector('.carousel-arrow--next');
  if (slides.length === 0) return;

  // Scene sub-button labels swap with the active category so each scene
  // reads meaningfully (Figure-1 aspect for the benchmark, model name in the wild).
  const SCENE_LABELS = {
    bench: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4'],
    wild:  ['Gemini', 'ChatGPT', 'Qwen-Image'],
  };
  // Categories can have different scene counts (bench 4, wild 3); extra
  // tab/dot buttons are hidden for the shorter category.
  const sceneCount = () => (SCENE_LABELS[cat] || []).length || sceneBtns.length;

  const activeCat = catBtns.find(b => b.classList.contains('is-active'));
  let cat = activeCat ? activeCat.dataset.cat : 'bench';
  let scene = 0;

  function activeSlide() {
    return slides.find(s => s.dataset.cat === cat && Number(s.dataset.scene) === scene);
  }

  // Stretch the HRRI up-arrow so its tip stops ~3 px below the pipeline
  // ("New task") content, mirroring the ~3 px gap at its tail. The vertical
  // span grows with the frame size, so we measure it and drive the arrow's
  // line height + arrowhead offset through the CSS custom properties.
  function syncRefArrow() {
    const slide = activeSlide();
    if (!slide) return;
    const pipeline = slide.querySelector('.demo-pipeline');
    const refCard = slide.querySelector('.demo-card--ref');
    if (!pipeline || !refCard) return;

    // Reset so the CSS fallback (short arrow) applies whenever the up-arrow
    // is hidden (stacked layout) or the measurement isn't usable.
    refCard.style.removeProperty('--ref-arrow-line-h');
    refCard.style.removeProperty('--ref-arrow-head-mb');

    // The up-arrow only exists in the side-by-side layout (>= 980px).
    if (window.getComputedStyle(refCard, '::before').display === 'none') return;

    const gap = refCard.getBoundingClientRect().top - pipeline.getBoundingClientRect().bottom;
    if (gap <= 24) return; // already short enough — keep the default arrow

    // tail gap (2.25) + line + arrowhead (9) + tip gap (2.25) = gap  [0.75-scaled]
    const lineH = gap - 13.5;
    refCard.style.setProperty('--ref-arrow-line-h', lineH + 'px');
    refCard.style.setProperty('--ref-arrow-head-mb', (lineH + 2.25) + 'px');
  }

  function render() {
    slides.forEach(slide => {
      const active = slide.dataset.cat === cat && Number(slide.dataset.scene) === scene;
      slide.classList.toggle('is-active', active);
      if (active) slide.removeAttribute('hidden');
      else slide.setAttribute('hidden', '');
    });
    catBtns.forEach(btn => {
      const active = btn.dataset.cat === cat;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const labels = SCENE_LABELS[cat] || [];
    const n = sceneCount();
    sceneBtns.forEach((btn, i) => {
      const within = i < n;
      btn.hidden = !within;
      if (labels[i] != null) btn.textContent = labels[i];
      const active = within && i === scene;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    dots.forEach((dot, i) => {
      const within = i < n;
      dot.hidden = !within;
      const active = within && i === scene;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    heads.forEach(h => h.classList.toggle('is-active', h.dataset.cat === cat));
    syncRefArrow();
  }

  function setCat(nextCat) {
    if (!nextCat || nextCat === cat) return;
    cat = nextCat;
    if (scene >= sceneCount()) scene = sceneCount() - 1;  // clamp into the new range
    render();
  }
  function setScene(idx) {
    const n = sceneCount();
    scene = ((idx % n) + n) % n;
    render();
  }

  catBtns.forEach(btn => btn.addEventListener('click', () => setCat(btn.dataset.cat)));
  sceneBtns.forEach((btn, i) => btn.addEventListener('click', () => setScene(i)));
  dots.forEach((dot, i) => dot.addEventListener('click', () => setScene(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => setScene(scene - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setScene(scene + 1));

  // Keyboard support: when the carousel (or any descendant) is focused.
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { setScene(scene - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setScene(scene + 1); e.preventDefault(); }
  });

  // Make the carousel focusable so the keyboard handler works without
  // requiring focus on an internal button.
  if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex', '0');

  // Initial paint, then keep the up-arrow length in sync with the layout: once
  // now, again after web fonts settle (they can shift the pipeline height), and on resize.
  render();
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(syncRefArrow);
  });
  window.addEventListener('load', syncRefArrow);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncRefArrow);
})();

// Slider ⇄ reuse-arrow link. As the img-comparison-slider slider is dragged
// and our result is revealed, drive a --reveal (0..1) on the slide's connector:
// the orange "HRRI reused → Ours" arrow extends + glows while the "RefGC
// (1st generation)" arrow dims — conveying that the same HRRI feeds both the
// original RefGC and our model. value=100 → full LRGI, value=0 → full result.
(function initSliderLink() {
  const sliders = Array.from(document.querySelectorAll('.demo-slider'));
  if (!sliders.length) return;

  // The "what we repair" strip is shared across slides; it mirrors the ACTIVE
  // slide's slider so the artifacts flip ✗→✓ in real time as Ours is revealed.
  const fixStrip = document.querySelector('.fix-strip');
  const carousel = document.querySelector('.demo-carousel');
  const revealOf = sl => {
    const v = (typeof sl.value === 'number') ? sl.value : parseFloat(sl.getAttribute('value'));
    return Math.max(0, Math.min(1, (100 - (v || 0)) / 100));
  };
  const isActive = sl => {
    const slide = sl.closest('.carousel-slide');
    return slide && slide.classList.contains('is-active');
  };
  const syncFixStrip = () => {
    if (!fixStrip) return;
    const sl = carousel && carousel.querySelector('.carousel-slide.is-active .demo-slider');
    if (sl) fixStrip.style.setProperty('--reveal', revealOf(sl).toFixed(3));
  };

  sliders.forEach(sl => {
    const stage = sl.closest('.demo-stage');
    if (!stage) return;
    const update = () => {
      const reveal = revealOf(sl);
      // One value drives everything via CSS: connector arrows, the slider frame's
      // border/neon glow, and the LRGI⇄Ours caption cross-fade.
      stage.style.setProperty('--reveal', reveal.toFixed(3));
      if (isActive(sl) && fixStrip) fixStrip.style.setProperty('--reveal', reveal.toFixed(3));
    };
    sl.addEventListener('slide', update);
    update(); // initial (reads the value attribute before upgrade)
    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('img-comparison-slider').then(update);
    }
  });

  // When the user switches scene/category, re-sync the strip to the new slide.
  if (carousel) {
    ['click', 'keyup'].forEach(ev =>
      carousel.addEventListener(ev, () => requestAnimationFrame(syncFixStrip)));
  }
  syncFixStrip();
})();

// Image magnifier / loupe — hover over any showcase image to inspect fine detail
// (texture, identity, edges) and judge for yourself which artifact our model fixed.
// One reusable circular loupe follows the cursor and shows a zoomed crop of the
// hovered image. Disabled on touch / coarse pointers (no hover).
(function initImageLoupe() {
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
  // Skip images inside the comparison slider — there the slider drag is the
  // interaction, so a loupe would fight it. Loupe stays on the HRRI reference.
  const imgs = Array.from(document.querySelectorAll('.demo-card img'))
    .filter(img => !img.closest('img-comparison-slider'));
  if (!imgs.length) return;

  const ZOOM = 2.6;   // magnification factor
  const SIZE = 190;   // loupe diameter (px)

  const loupe = document.createElement('div');
  loupe.className = 'img-loupe';
  loupe.style.width = loupe.style.height = SIZE + 'px';
  document.body.appendChild(loupe);

  let current = null;

  function position(e) {
    if (!current) return;
    const r = current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) { hide(); return; }

    const bgW = r.width * ZOOM;
    const bgH = r.height * ZOOM;
    loupe.style.backgroundSize = bgW + 'px ' + bgH + 'px';
    loupe.style.backgroundPosition =
      (-(x * bgW - SIZE / 2)) + 'px ' + (-(y * bgH - SIZE / 2)) + 'px';
    loupe.style.left = (e.clientX + window.scrollX - SIZE / 2) + 'px';
    loupe.style.top  = (e.clientY + window.scrollY - SIZE / 2) + 'px';
  }
  function show(e) {
    current = e.currentTarget;
    loupe.style.backgroundImage = 'url("' + (current.currentSrc || current.src) + '")';
    loupe.classList.add('is-visible');
    position(e);
  }
  function hide() {
    current = null;
    loupe.classList.remove('is-visible');
  }

  imgs.forEach(img => {
    img.addEventListener('mouseenter', show);
    img.addEventListener('mousemove', position);
    img.addEventListener('mouseleave', hide);
  });
  // Hide if the page scrolls while hovering (cursor/image relationship is stale).
  window.addEventListener('scroll', () => { if (current) hide(); }, { passive: true });
})();
