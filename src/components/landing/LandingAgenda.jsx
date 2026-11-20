import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { db } from '../../firebase';
import { useData } from '../../context/DataContext';
import ScrollFade from '../common/ScrollFade';

const dayFormat = new Intl.DateTimeFormat('id-ID', { day: '2-digit' });
const monthFormat = new Intl.DateTimeFormat('id-ID', { month: 'short' });
const timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function upcomingEvents(events, now) {
  return events
    .map((event) => {
      if (typeof event.event_date !== 'string') return null;
      const date = new Date(event.event_date.replace(' ', 'T'));
      return Number.isNaN(date.getTime()) ? null : { ...event, date };
    })
    .filter((event) => event && event.date >= now)
    .sort((first, second) => first.date - second.date)
    .slice(0, 3);
}

export default function LandingAgenda({ destination, isAuthenticated }) {
  const { events, eventsLoading, eventsError } = useData();
  // Only intentionally public event previews are readable by guest visitors.
  // Full event documents and attendee records remain authenticated.
  const [publicEvents, setPublicEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) return undefined;
    const unsubscribe = onSnapshot(
      collection(db, 'publicEvents'),
      (snapshot) => {
        setPublicEvents(snapshot.docs.map((eventDoc) => ({
          id: eventDoc.id,
          ...eventDoc.data(),
        })));
        setStatus('ready');
      },
      (error) => {
        console.error('Unable to load public landing agenda:', error);
        setPublicEvents([]);
        setStatus('error');
      }
    );

    return unsubscribe;
  }, [isAuthenticated]);

  // Existing events remain visible to signed-in users before any public backfill.
  const agenda = upcomingEvents(isAuthenticated ? events : publicEvents, now);
  const loading = isAuthenticated ? eventsLoading : status === 'loading';
  const error = isAuthenticated ? Boolean(eventsError) : status === 'error';

  return (
    <ScrollFade as="section" className="sample-event" style={{ '--reveal-delay': '80ms' }} id="agenda" aria-labelledby="sample-event-title">
      <h3 id="sample-event-title"><CalendarDays size={20} aria-hidden="true" /> Kegiatan mendatang</h3>
      {loading ? (
        <p className="agenda-lede" role="status">Memuat kegiatan kampus…</p>
      ) : error ? (
        <p className="agenda-lede" role="alert">Agenda belum bisa dimuat. Silakan coba lagi nanti.</p>
      ) : agenda.length > 0 ? (
        <>
          <p className="agenda-lede">Simpan tanggalnya. Jangan sampai kelewatan!</p>
          <ul className="agenda-preview">
            {agenda.map(({ id, title, date, place }) => (
              <li key={id}>
                <time className="date-tile" dateTime={date.toISOString()}>
                  <b>{dayFormat.format(date)}</b><small>{monthFormat.format(date)}</small>
                </time>
                <div>
                  <strong>{title}</strong>
                  <p>{timeFormat.format(date)} · {place}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="agenda-lede">Belum ada kegiatan mendatang yang dipublikasikan.</p>
      )}
      <Link className="text-link" to={destination}
        state={isAuthenticated ? { dashboardTab: 'events' } : undefined}>
        Lihat agenda kampus <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </ScrollFade>
  );
}
