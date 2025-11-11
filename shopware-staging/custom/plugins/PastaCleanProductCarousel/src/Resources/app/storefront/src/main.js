import './scss/base.scss';
import { tns } from 'tiny-slider/src/tiny-slider';

const initPCCarousel = () => {
  // 🚫 Skip initialization on desktop / large screens
  if (window.innerWidth > 768) return;

  const wrappers = document.querySelectorAll('[data-pc-carousel]');
  wrappers.forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('[data-pc-slide]'));
    if (!slides.length) return;

    // --- Basic container setup ---
    const container = carousel;
    container.style.display = 'flex';
    container.style.overflow = 'hidden';

    slides.forEach(s => {
      s.style.minWidth = '100%';
      s.style.boxSizing = 'border-box';
      const img = s.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'cover';
        img.style.display = 'flex';
      }
    });

    // --- Build track ---
    const total = slides.length;
    let index = 0;

    const track = document.createElement('div');
    track.className = 'pc-track';
    track.style.display = 'flex';
    track.style.transition = 'transform 300ms ease';
    track.style.width = `${100 * total}%`;

    slides.forEach(slide => track.appendChild(slide));
    carousel.appendChild(track);

    // --- Dots navigation ---
    const dotsContainer = carousel.parentElement.querySelector('[data-pc-dots]');
    const dots = [];
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'pc-dot';
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      if (dotsContainer) dotsContainer.appendChild(d);
      dots.push(d);
    }

    // --- Prev / Next controls ---
    const prevBtn = carousel.parentElement.querySelector('[data-pc-prev]');
    const nextBtn = carousel.parentElement.querySelector('[data-pc-next]');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    // --- Swipe handling ---
    let startX = 0;
    let dragging = false;

    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      dragging = true;
      track.style.transition = 'none';
    });

    track.addEventListener('touchmove', e => {
      if (!dragging) return;
      const x = e.touches[0].clientX;
      const delta = x - startX;
      const percent = (delta / carousel.clientWidth) * 100;
      track.style.transform = `translateX(${ -index * 100 + percent }%)`;
    });

    track.addEventListener('touchend', e => {
      dragging = false;
      track.style.transition = 'transform 300ms ease';
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) goTo(index + 1);
        else goTo(index - 1);
      } else {
        goTo(index);
      }
    });

    // --- Navigation functions ---
    function goTo(i) {
      if (i < 0) i = 0;
      if (i >= total) i = total - 1;
      index = i;
      track.style.transform = `translateX(${-index * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
    }

    goTo(0);
  });
};

document.addEventListener('DOMContentLoaded', initPCCarousel);
window.PluginManager?.register('PCCarousel', initPCCarousel);

// ✅ Tiny Slider initialization — only for mobile
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) return; // stop for desktop

  const wrapper = document.querySelector('[data-pc-carousel]');
  if (!wrapper) return;

  tns({
    container: wrapper,
    items: 1,
    slideBy: 'page',
    autoplay: false,
    controls: true,
    nav: true,
    navContainer: '.pc-dots',
    controlsText: ['←', '→'],
    mouseDrag: true,
    gutter: 0,
    edgePadding: 0,
    loop: true,
  });
});

function markImageOrientation(img) {
  img.classList.remove('portrait','landscape');
  if (!img.naturalWidth || !img.naturalHeight) return;
  if (img.naturalHeight > img.naturalWidth) img.classList.add('portrait');
  else img.classList.add('landscape');
}

// run on existing zoom images and when modal opens
document.addEventListener('DOMContentLoaded', () => {
  const allZoomImgs = document.querySelectorAll('.image-zoom-modal img, .modal.image-zoom-modal img, .image-zoom-container img');
  allZoomImgs.forEach(img => {
    img.addEventListener('load', () => markImageOrientation(img));
    if (img.complete) markImageOrientation(img);
  });

  // if your theme opens modal dynamically, listen for modal insert/open
  document.body.addEventListener('click', (e) => {
    const targetImg = e.target.closest('.gallery-slider-image, .gallery-slider-item img');
    if (!targetImg) return;
    // small timeout to allow zoom modal DOM to render
    setTimeout(() => {
      document.querySelectorAll('.image-zoom-modal img, .modal.image-zoom-modal img').forEach(img => {
        if (img.complete) markImageOrientation(img);
        else img.addEventListener('load', () => markImageOrientation(img));
      });
    }, 50);
  });
});

export default initPCCarousel;


SWSCRXBTZJJYUKZ3U25UBZZAQG

