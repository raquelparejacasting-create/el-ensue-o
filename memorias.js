(() => {
  const dialog = document.querySelector('.memory-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const heading = dialog.querySelector('h2');
  const counter = dialog.querySelector('[data-counter]');
  const story = dialog.querySelector('.memory-viewer-story');
  const full = dialog.querySelector('[data-full]');
  const prev = dialog.querySelector('[data-prev]');
  const next = dialog.querySelector('[data-next]');
  let links = [], index = 0, trigger;
  function render() {
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    full.href = link.href;
    counter.textContent = (index + 1) + ' / ' + links.length;
    prev.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }
  document.querySelectorAll('.memory-photo').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'memory-viewer');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const chapter = link.closest('.memory-chapter');
      links = [...chapter.querySelectorAll('.memory-photo')];
      index = links.indexOf(link);
      heading.textContent = chapter.querySelector('h3').textContent;
      story.textContent = chapter.querySelector('.memory-story-text').textContent;
      render();
      dialog.showModal();
      document.body.classList.add('memory-viewer-open');
    });
  });
  const move = delta => { const target = index + delta; if (target >= 0 && target < links.length) { index = target; render(); } };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('memory-viewer-open'); trigger?.focus(); });
})();