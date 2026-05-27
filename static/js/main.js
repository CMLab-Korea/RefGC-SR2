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
    btn.style.background = '#10b981';
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
  const prevBtn = carousel.querySelector('.carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.carousel-arrow--next');
  if (slides.length === 0) return;

  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current < 0) current = 0;

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
    current = next;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-index'));
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
})();
