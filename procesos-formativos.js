(() => {
  const dialog = document.querySelector('.photo-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.photo-dialog-image');
  const title = dialog.querySelector('.photo-dialog-title');
  const story = dialog.querySelector('.photo-dialog-text');
  const counter = dialog.querySelector('.photo-dialog-counter');
  const previous = dialog.querySelector('[data-photo-previous]');
  const next = dialog.querySelector('[data-photo-next]');
  let photos = [], index = 0, trigger;
  function render() {
    const figure = photos[index];
    const thumbnail = figure.querySelector('img');
    image.src = figure.querySelector('a').href;
    image.alt = thumbnail.alt;
    title.textContent = figure.querySelector('h3').textContent;
    story.textContent = figure.querySelector('figcaption > p:last-child').textContent;
    counter.textContent = (index + 1) + ' / ' + photos.length;
    previous.disabled = index === 0;
    next.disabled = index === photos.length - 1;
  }
  document.querySelectorAll('.album-photo a').forEach(link => {
    const figure = link.closest('figure');
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'photo-viewer');
    link.setAttribute('aria-label', 'Abrir fotografía y microrelato: ' + figure.querySelector('h3').textContent);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      photos = Array.from(link.closest('.album-grid').querySelectorAll('.album-photo'));
      index = photos.indexOf(figure);
      render();
      dialog.showModal();
      document.body.classList.add('photo-viewer-open');
    });
  });
  previous.addEventListener('click', () => { if (index > 0) { index--; render(); } });
  next.addEventListener('click', () => { if (index < photos.length - 1) { index++; render(); } });
  dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); index--; render(); }
    if (event.key === 'ArrowRight' && index < photos.length - 1) { event.preventDefault(); index++; render(); }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('photo-viewer-open');
    trigger?.focus();
  });
  document.documentElement.classList.add('albums-ready');
})();
