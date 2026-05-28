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
// the category slides (Benchmark → Existing RefGC → Commercial).
(function initDemoCarousel() {
  const carousel = document.querySelector('.demo-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const tabs = Array.from(carousel.querySelectorAll('.carousel-tab'));
  const prevBtn = carousel.querySelector('.carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.carousel-arrow--next');
  if (slides.length === 0) return;

  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current < 0) current = 0;

  // Stretch the HRRI up-arrow so its tip stops ~3 px below the pipeline
  // ("New task") content, mirroring the ~3 px gap at its tail. The vertical
  // span grows with the frame size, so we measure it and drive the arrow's
  // line height + arrowhead offset through the CSS custom properties.
  function syncRefArrow() {
    const slide = slides[current];
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
    if (gap <= 32) return; // already short enough — keep the default arrow

    // tail gap (3) + line + arrowhead (12) + tip gap (3) = gap
    const lineH = gap - 18;
    refCard.style.setProperty('--ref-arrow-line-h', lineH + 'px');
    refCard.style.setProperty('--ref-arrow-head-mb', (lineH + 3) + 'px');
  }

  function show(idx) {
    const next = (idx + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === next;
      slide.classList.toggle('is-active', active);
      if (active) {
        slide.removeAttribute('hidden');
      } else {
        slide.setAttribute('hidden', '');
      }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === next);
      dot.setAttribute('aria-selected', i === next ? 'true' : 'false');
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === next);
      tab.setAttribute('aria-selected', i === next ? 'true' : 'false');
    });
    current = next;
    syncRefArrow();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-index'));
      if (!Number.isNaN(idx)) show(idx);
    });
  });
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = Number(tab.getAttribute('data-index'));
      if (!Number.isNaN(idx)) show(idx);
    });
  });

  // Keyboard support: when the carousel (or any descendant) is focused.
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { show(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
  });

  // Make the carousel focusable so the keyboard handler works without
  // requiring focus on an internal button.
  if (!carousel.hasAttribute('tabindex')) carousel.setAttribute('tabindex', '0');

  // Keep the up-arrow length in sync with the layout: once now, again after
  // web fonts settle (they can shift the pipeline height), and on resize.
  syncRefArrow();
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(syncRefArrow);
  });
  window.addEventListener('load', syncRefArrow);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncRefArrow);
})();
