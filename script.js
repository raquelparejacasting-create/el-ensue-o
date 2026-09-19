const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const dropdowns = [...document.querySelectorAll('[data-dropdown]')];
function closeDropdown(dropdown) {
  dropdown.querySelector('[data-dropdown-toggle]').setAttribute('aria-expanded', 'false');
  dropdown.querySelector('.dropdown-list').hidden = true;
  dropdown.querySelectorAll('[data-dropdown]').forEach(closeDropdown);
}
function closeDropdowns() { dropdowns.forEach(closeDropdown); }
toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  menu?.classList.toggle('open', !isOpen);
  if (isOpen) closeDropdowns();
});
dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector('[data-dropdown-toggle]');
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    dropdowns.forEach((other) => {
      if (other !== dropdown && !other.contains(dropdown)) closeDropdown(other);
    });
    button.setAttribute('aria-expanded', String(!isOpen));
    dropdown.querySelector('.dropdown-list').hidden = isOpen;
  });
  dropdown.addEventListener('focusout', (event) => {
    if (!dropdown.contains(event.relatedTarget)) closeDropdown(dropdown);
  });
});
menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    closeDropdowns();
  });
  if (link.getAttribute('href') === window.location.pathname.split('/').pop()) link.setAttribute('aria-current', 'page');
});
document.addEventListener('click', (event) => {
  dropdowns.forEach((dropdown) => { if (!dropdown.contains(event.target)) closeDropdown(dropdown); });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openButton = [...(menu?.querySelectorAll('[data-dropdown-toggle][aria-expanded="true"]') || [])].pop();
  if (openButton) { closeDropdown(openButton.closest('[data-dropdown]')); openButton.focus(); }
  else if (toggle?.getAttribute('aria-expanded') === 'true') {
    menu?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
