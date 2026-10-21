const galleryDialog = document.querySelector('[data-bri-dialog]');
document.querySelectorAll('[data-bri-photo]').forEach((button) => {
  button.addEventListener('click', () => {
    const photo = button.querySelector('img');
    const image = galleryDialog.querySelector('img');
    image.src = photo.src;
    image.alt = photo.alt;
    galleryDialog.querySelector('p').textContent = button.closest('figure').querySelector('figcaption').textContent;
    galleryDialog.showModal();
  });
});
galleryDialog?.querySelector('button').addEventListener('click', () => galleryDialog.close());
galleryDialog?.addEventListener('click', (event) => {
  const bounds = galleryDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) galleryDialog.close();
});

(() => { const notice = document.querySelector('[data-bri-book-notice]'); if (!notice) return; const key = 'bri-national-library-arrival-dismissed'; let dismissed = false; try { dismissed = sessionStorage.getItem(key) === 'yes'; } catch {} const dismiss = () => { notice.hidden = true; try { sessionStorage.setItem(key, 'yes'); } catch {} }; notice.querySelector('[data-bri-notice-close]').addEventListener('click', dismiss); notice.querySelector('[data-bri-notice-link]').addEventListener('click', () => { dismiss(); const section = document.querySelector('#libros'); section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true }); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !notice.hidden && !document.querySelector('dialog[open]')) dismiss(); }); if (!dismissed) window.setTimeout(() => { notice.hidden = false; }, 1800); })();