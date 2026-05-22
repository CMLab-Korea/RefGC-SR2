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
