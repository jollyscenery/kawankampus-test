import { useState } from 'react';
import { ArrowRight, Check, Clock3, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatEventDate } from '../../utils/events';
import { InlineError } from '../common/Interface';

export default function EventCard({ event, onAttend }) {
  const { isEventAttending, attendEvent } = useData();
  const attending = isEventAttending(event.id);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const { date, day, month, schedule } = formatEventDate(event);

  const handleAttend = async () => {
    setError('');
    setPending(true);
    try {
      await (onAttend || attendEvent)(event.id);
    } catch {
      setError('Kehadiran belum tersimpan. Coba daftar lagi.');
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="event-card">
      <div className="date-tile" aria-hidden="true"><b>{day}</b><small>{month}</small></div>
      <div className="event-info">
        <span className="event-community">{event.community_name}</span>
        <h3>{event.title}</h3>
        <p className="event-meta">
          <span><Clock3 size={15} aria-hidden="true" /><time dateTime={date ? date.toISOString() : undefined}>{schedule}</time></span>
          <span><MapPin size={15} aria-hidden="true" /><span>{event.place}</span></span>
        </p>
        {event.description && <p className="event-description">{event.description}</p>}
        {error && <InlineError>{error}</InlineError>}
      </div>
      <div className="event-action">
        {attending ? <span className="joined"><Check size={15} aria-hidden="true" /> Terdaftar</span> : (
          <button type="button" className="btn btn-primary btn-small" disabled={pending}
            aria-label={pending ? undefined : `Ikut kegiatan ${event.title}`} onClick={handleAttend}>
            {pending ? 'Mendaftar…' : 'Ikut kegiatan'} <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
        <small>{event.attendee_count ?? 0} terdaftar</small>
      </div>
    </article>
  );
}
