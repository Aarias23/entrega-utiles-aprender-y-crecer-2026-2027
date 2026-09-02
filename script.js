const slides = [...document.querySelectorAll('.slide')];
const current = document.querySelector('#currentSlide');
const total = document.querySelector('#totalSlides');
const title = document.querySelector('#slideTitle');
const progress = document.querySelector('#progressBar');
const prev = document.querySelector('#prevButton');
const next = document.querySelector('#nextButton');
let index = Math.max(0, slides.findIndex(slide => slide.id === location.hash.slice(1)));

function showSlide(newIndex, updateHash = true) {
  index = Math.max(0, Math.min(newIndex, slides.length - 1));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });
  current.textContent = String(index + 1).padStart(2, '0');
  total.textContent = String(slides.length).padStart(2, '0');
  title.textContent = slides[index].dataset.title;
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  prev.disabled = index === 0;
  next.disabled = index === slides.length - 1;
  if (updateHash) history.replaceState(null, '', index ? `#diapositiva-${index + 1}` : '#inicio');
}

prev.addEventListener('click', () => showSlide(index - 1));
next.addEventListener('click', () => showSlide(index + 1));
document.addEventListener('keydown', event => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); showSlide(index + 1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(index - 1); }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});

let touchStart = 0;
document.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(delta) > 55) showSlide(index + (delta < 0 ? 1 : -1));
}, { passive: true });

document.querySelector('#fullscreenButton').addEventListener('click', async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  else await document.exitFullscreen?.();
});
document.querySelector('#printForm').addEventListener('click', () => window.print());
showSlide(index, false);
