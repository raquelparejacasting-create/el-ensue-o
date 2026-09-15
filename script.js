
const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const dropdown = document.querySelector('[data-dropdown]');
const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
const dropdownList = document.getElementById('historical-nav');

function closeDropdown() {
  dropdownToggle?.setAttribute('aria-expanded', 'false');
  if (dropdownList) dropdownList.hidden = true;
}

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  menu?.classList.toggle('open', !isOpen);
  if (isOpen) closeDropdown();
});

dropdownToggle?.addEventListener('click', () => {
  const isOpen = dropdownToggle.getAttribute('aria-expanded') === 'true';
  dropdownToggle.setAttribute('aria-expanded', String(!isOpen));
  dropdownList.hidden = isOpen;
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    closeDropdown();
  });
});

document.addEventListener('click', (event) => {
  if (!dropdown?.contains(event.target)) closeDropdown();
});

dropdown?.addEventListener('focusout', (event) => {
  if (!dropdown.contains(event.relatedTarget)) closeDropdown();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (dropdownToggle?.getAttribute('aria-expanded') === 'true') {
    closeDropdown();
    dropdownToggle.focus();
  } else if (toggle?.getAttribute('aria-expanded') === 'true') {
    menu?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});

const currentPage = window.location.pathname.split('/').pop();
dropdownList?.querySelectorAll('a').forEach((link) => {
  if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
