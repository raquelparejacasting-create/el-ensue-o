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
