(() => {
  const events = window.ENSUENO_EVENTS;
  const months = ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel = (date) => new Intl.DateTimeFormat('es-CO', {day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));
  const hourLabel = (time) => { const [h,m] = time.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2,'0') + (h < 12 ? ' a. m.' : ' p. m.'); };
  function upcoming(now = new Date()) {
    return events.filter((event) => {
      // Keep events without a known end time visible through the local event day.
      const end = (event.endDate || event.date) + 'T' + (event.endTime || '23:59:59') + '-05:00';
      return new Date(end) >= now;
    }).sort((a,b) => (a.date + (a.time || '00:00')).localeCompare(b.date + (b.time || '00:00')));
  }
  const onDay = (event, day) => event.date <= day && (event.endDate || event.date) >= day;
  function card(event, compact = false) {
    const date = dateLabel(event.date) + (event.endDate ? ' – ' + dateLabel(event.endDate) : '');
    const hours = event.time ? hourLabel(event.time) + (event.endTime ? ' – ' + hourLabel(event.endTime) : '') : 'Horario por confirmar';
    return '<article class="event-card" ' + (compact ? '' : 'id="' + event.id + '"') + '><p class="event-category">' + escape(event.category) + '</p><p class="event-date"><time datetime="' + event.date + '">' + date + '</time></p><h3>' + escape(event.title) + '</h3><p class="event-time">' + hours + '</p>' + (compact ? '<a class="text-link" href="programacion.html#' + event.id + '">Ver encuentro <span aria-hidden="true">↗</span></a>' : event.details.map((line) => '<p class="event-detail">' + escape(line) + '</p>').join('')) + '</article>';
  }
  window.EnsuenoAgenda = {upcoming, onDay, card};
  if (typeof document === 'undefined') return;
  const preview = document.querySelector('[data-upcoming]');
  function renderUpcoming() {
    const next = upcoming().slice(0,4);
    preview.innerHTML = next.length ? next.map((event) => card(event,true)).join('') : '<p class="agenda-empty">No hay próximos encuentros anunciados. Pronto compartiremos nuevas fechas.</p>';
  }
  if (preview) {
    renderUpcoming();
    setInterval(renderUpcoming, 60000);
  }
  const calendar = document.querySelector('[data-calendar]');
  if (!calendar) return;
  calendar.hidden = false;
  const selector = document.querySelector('[data-month-select]');
  const grid = document.querySelector('[data-calendar-days]');
  const result = document.querySelector('[data-calendar-status]');
  const reset = document.querySelector('[data-month-reset]');
  const sections = [...document.querySelectorAll('[data-event-month]')];
  const previous = document.querySelector('[data-prev-month]');
  const next = document.querySelector('[data-next-month]');
  const localToday = () => {
    const parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const value = (type) => parts.find((part) => part.type === type).value;
    return value('year') + '-' + value('month') + '-' + value('day');
  };
  const today = localToday();
  let month = today.startsWith('2026-') ? Math.max(9,Math.min(12,Number(today.slice(5,7)))) : 9;
  let selectedDay = null;
  const targetEvent = events.find((event) => '#' + event.id === window.location.hash);
  if (targetEvent) month = Number(targetEvent.date.slice(5,7));
  function render() {
    selector.value = String(month);
    previous.disabled = month === 9;
    next.disabled = month === 12;
    reset.hidden = !selectedDay;
    const prefix = '2026-' + String(month).padStart(2,'0') + '-';
    const offset = (new Date(Date.UTC(2026,month-1,1)).getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(2026,month,0)).getUTCDate();
    grid.replaceChildren();
    for (let i=0;i<offset;i++) { const spacer = document.createElement('span'); spacer.setAttribute('aria-hidden','true'); grid.append(spacer); }
    for (let day=1;day<=count;day++) {
      const date = prefix + String(day).padStart(2,'0');
      const matches = events.filter((event) => onDay(event,date));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'calendar-day' + (matches.length ? ' has-events' : '');
      button.textContent = String(day);
      button.dataset.date = date;
      button.setAttribute('aria-label',dateLabel(date) + ' de 2026: ' + matches.length + (matches.length === 1 ? ' actividad' : ' actividades'));
      button.setAttribute('aria-pressed',String(selectedDay === date));
      if (date === today) button.setAttribute('aria-current','date');
      button.addEventListener('click',() => {
        selectedDay = date;
        render();
        grid.querySelector('[data-date="' + date + '"]').focus();
      });
      grid.append(button);
    }
    const matches = events.filter((event) => selectedDay ? onDay(event,selectedDay) : event.date.startsWith(prefix));
    result.textContent = (selectedDay ? dateLabel(selectedDay) : months[month-9] + ' de 2026') + ': ' + matches.length + (matches.length === 1 ? ' actividad' : ' actividades') + (matches.length ? '.' : ' anunciadas por ahora.');
    sections.forEach((section) => {
      section.hidden = Number(section.dataset.eventMonth) !== month;
      section.querySelectorAll('.event-card').forEach((article) => { article.hidden = !matches.some((event) => event.id === article.id); });
    });
  }
  function changeMonth(value) { month = value; selectedDay = null; render(); }
  selector.addEventListener('change',() => changeMonth(Number(selector.value)));
  previous.addEventListener('click',() => changeMonth(month-1));
  next.addEventListener('click',() => changeMonth(month+1));
  reset.addEventListener('click',() => { selectedDay = null; render(); selector.focus(); });
  window.addEventListener('hashchange',() => {
    const event = events.find((item) => '#' + item.id === window.location.hash);
    if (event) { changeMonth(Number(event.date.slice(5,7))); document.getElementById(event.id)?.scrollIntoView(); }
  });
  render();
  if (targetEvent) requestAnimationFrame(() => document.getElementById(targetEvent.id)?.scrollIntoView());
})();
