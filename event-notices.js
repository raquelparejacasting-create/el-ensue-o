(() => {
  const dayInColombia = (now = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const part = type => parts.find(item => item.type === type).value;
    return part('year') + '-' + part('month') + '-' + part('day');
  };
  function notice(event, now = new Date()) {
    const today = dayInColombia(now);
    const tomorrow = new Date(Date.parse(today + 'T12:00:00Z') + 86400000).toISOString().slice(0,10);
    if (event.date <= today && (event.endDate || event.date) >= today) return 'Hoy';
    return event.date === tomorrow ? 'Mañana' : '';
  }
  window.EnsuenoEventNotices = {notice, dayInColombia};
  if (typeof document === 'undefined') return;
  function refresh() {
    const now = new Date();
    document.querySelectorAll('.event-card').forEach(article => {
      const link = article.querySelector('a[href*="programacion.html#"]');
      const id = article.id || link?.getAttribute('href').split('#')[1];
      const event = window.ENSUENO_EVENTS.find(item => item.id === id);
      if (!event) return;
      const label = notice(event, now);
      const old = article.querySelector('.event-notice');
      if (old?.dataset.label === label) return;
      old?.remove();
      if (!label) return;
      const badge = document.createElement('p');
      badge.className = 'event-notice ' + (label === 'Hoy' ? 'event-notice-today' : 'event-notice-tomorrow');
      badge.dataset.label = label;
      const icon = document.createElement('img');
      icon.setAttribute('aria-hidden', 'true');
      icon.src = 'assets/favicon.png'; icon.alt = ''; icon.width = 36; icon.height = 36;
      badge.append(icon, ' ' + label);
      article.prepend(badge);
    });
    document.querySelectorAll('[data-calendar-days] [data-date]').forEach(button => {
      if (button.dataset.date === dayInColombia(now)) button.setAttribute('aria-current','date');
      else button.removeAttribute('aria-current');
    });
  }
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  const preview = document.querySelector('[data-upcoming]');
  if (preview) new MutationObserver(refresh).observe(preview, {childList:true});
  const calendar = document.querySelector('[data-calendar-days]');
  if (calendar) new MutationObserver(refresh).observe(calendar, {childList:true});
})();
