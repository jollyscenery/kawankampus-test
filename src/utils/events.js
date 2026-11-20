/**
 * Firestore stores `event_date` as a local "YYYY-MM-DD HH:mm" string.
 * This helper keeps every consumer tolerant of missing or malformed values
 * instead of throwing during render.
 */
export function parseEventDate(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isUpcomingEvent(event, now = new Date()) {
  const date = parseEventDate(event?.event_date);
  return Boolean(date && date >= now);
}

export function getUpcomingEvents(events, now = new Date()) {
  if (!Array.isArray(events)) return [];
  return events
    .map((event) => ({ event, date: parseEventDate(event.event_date) }))
    .filter(({ date }) => date && date >= now)
    .sort((first, second) => first.date - second.date)
    .map(({ event }) => event);
}

export function formatEventDate(event) {
  const date = parseEventDate(event?.event_date);
  if (!date) {
    const raw = typeof event?.event_date === 'string' ? event.event_date.trim() : '';
    return { date: null, day: '–', month: '', schedule: raw || 'Tanggal belum tersedia' };
  }
  return {
    date,
    day: date.toLocaleDateString('id-ID', { day: '2-digit' }),
    month: date.toLocaleDateString('id-ID', { month: 'short' }),
    schedule: date.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
  };
}
