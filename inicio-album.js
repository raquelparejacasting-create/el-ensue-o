(() => {
const album = document.querySelector('.home-mini-album');
if (!album) return;
const track = album.querySelector('.home-mini-track');
const pause = album.querySelector('[data-album-pause]');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motion.matches;
function update() { pause.textContent = paused ? 'Reanudar' : 'Pausar'; pause.setAttribute('aria-pressed', String(paused)); }
function move(direction) {
const max = track.scrollWidth - track.clientWidth;
const step = track.querySelector('a').getBoundingClientRect().width + 12;
let target = track.scrollLeft + direction * step;
if (direction > 0 && track.scrollLeft >= max - 3) target = 0;
if (direction < 0 && track.scrollLeft <= 3) target = max;
track.scrollTo({left: Math.max(0, Math.min(max,target)), behavior: motion.matches ? 'instant' : 'smooth'});
}
pause.addEventListener('click', () => { paused = !paused; update(); });
album.querySelector('[data-album-prev]').addEventListener('click', () => move(-1));
album.querySelector('[data-album-next]').addEventListener('click', () => move(1));
track.addEventListener('touchstart', () => { paused = true; update(); }, {passive:true});
motion.addEventListener('change', () => { if (motion.matches) { paused = true; update(); } });
setInterval(() => { if (!paused && !document.hidden && !album.matches(':hover') && !album.contains(document.activeElement)) move(1); }, 3500);
update();
})();