import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EventCard from '../cards/EventCard';
import { getUpcomingEvents } from '../../utils/events';
import { EmptyState, InlineError, SearchField, SkeletonList } from '../common/Interface';

export default function EventsTab({ onNavigateTab }) {
  const { events, communities, isCommunityJoined, createEvent, isEventAttending, communitiesLoading,
    membershipsLoading, communitiesError, membershipsError, retryCircles,
    eventsLoading, attendeesLoading, eventsError, attendeesError, retryEvents } = useData();
  const joined = communities.filter((circle) => isCommunityJoined(circle.id));
  const [title, setTitle] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [onlyAttending, setOnlyAttending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedCircle = joined.some((circle) => String(circle.id) === communityId)
    ? communityId : String(joined[0]?.id ?? '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');

    if (!selectedCircle) {
      setError('Pilih lingkungan terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await createEvent({ title, community_id: selectedCircle, event_date: eventDate, place, description });
      setTitle('');
      setEventDate('');
      setPlace('');
      setDescription('');
      setShowForm(false);
      setOnlyAttending(false);
      setSearch('');
      document.getElementById('toggle-event-form')?.focus();
    } catch (err) {
      setError(err.message || 'Kegiatan belum bisa disimpan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    document.getElementById('event-search')?.focus();
  };

  const query = search.trim().toLowerCase();
  const upcoming = getUpcomingEvents(events);
  const filtered = upcoming.filter((event) =>
    (!onlyAttending || isEventAttending(event.id)) && [event.title, event.community_name, event.place, event.description]
      .some((value) => value?.toLowerCase().includes(query))
  );

  return (
    <>
      <div className="page-intro">
        <p>Temukan kegiatan kampus dan ajak lingkunganmu ketemu langsung.</p>
        <button type="button" id="toggle-event-form" className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
          aria-expanded={showForm} aria-controls="create-event" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          {showForm ? 'Tutup formulir' : 'Buat kegiatan'}
        </button>
      </div>

      {showForm && (
        <section className="editor-form" id="create-event" aria-labelledby="create-event-title">
          <h2 id="create-event-title">Kegiatan baru</h2>
          {communitiesLoading || membershipsLoading ? <SkeletonList type="event" label="Memuat pilihan lingkungan" />
            : (communitiesError || membershipsError) ? <InlineError onRetry={retryCircles}>{communitiesError || membershipsError}</InlineError>
            : joined.length === 0 ? (
                <EmptyState type="event" title="Perlu lingkungan untuk membuat kegiatan" action="Jelajahi Lingkungan Aku" onAction={() => onNavigateTab('communities')}>
                  Gabung lingkungan dulu agar kegiatanmu punya tempat di agenda.
                </EmptyState>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div><label htmlFor="event-title">Nama kegiatan</label>
                      <input id="event-title" required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} /></div>
                    <div><label htmlFor="event-circle">Lingkungan</label>
                      <select id="event-circle" required value={selectedCircle} onChange={(event) => setCommunityId(event.target.value)}>
                        {joined.map((circle) => <option key={circle.id} value={circle.id}>{circle.name}</option>)}
                      </select></div>
                    <div><label htmlFor="event-date">Tanggal dan waktu</label>
                      <input id="event-date" type="datetime-local" required value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></div>
                    <div><label htmlFor="event-place">Lokasi</label>
                      <input id="event-place" required value={place} onChange={(event) => setPlace(event.target.value)} /></div>
                    <div className="full"><label htmlFor="event-description">Deskripsi <small>(opsional)</small></label>
                      <textarea id="event-description" rows="2" value={description} onChange={(event) => setDescription(event.target.value)} /></div>
                  </div>
                  {error && <InlineError>{error}</InlineError>}
                  <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
                    {submitting ? 'Menyimpan kegiatan…' : 'Publikasikan kegiatan'}
                  </button>
                </form>
              )}
        </section>
      )}

      <div className="discovery-tools">
        <div className="filter-group glass-pill" role="group" aria-label="Tampilkan kegiatan">
          <button type="button" aria-pressed={!onlyAttending} onClick={() => setOnlyAttending(false)}>Semua agenda</button>
          <button type="button" aria-pressed={onlyAttending} onClick={() => setOnlyAttending(true)}>Saya ikuti</button>
        </div>
        <SearchField id="event-search" label="Cari kegiatan" value={search} onChange={setSearch} placeholder="Cari kegiatan atau lokasi" />
      </div>

      {eventsLoading || attendeesLoading ? (
        <SkeletonList type="event" label="Memuat kegiatan dan pendaftaran" />
      ) : eventsError || attendeesError ? (
        <InlineError onRetry={retryEvents}>{eventsError || attendeesError}</InlineError>
      ) : filtered.length > 0 ? (
        <div className="event-list">{filtered.map((event) => <EventCard key={event.id} event={event} />)}</div>
      ) : query ? (
        <EmptyState type="search" title="Kegiatan belum ketemu" action="Hapus pencarian" onAction={clearSearch}>
          Coba nama kegiatan, lingkungan, atau lokasi lain.
        </EmptyState>
      ) : onlyAttending ? (
        <EmptyState type="event" title="Kamu belum mendaftar kegiatan" action="Lihat semua agenda" onAction={() => setOnlyAttending(false)}>
          Kalau ada yang menarik, pilih Ikut kegiatan untuk menyimpannya di sini.
        </EmptyState>
      ) : (
        <EmptyState type="event" title="Belum ada kegiatan mendatang" action={showForm ? undefined : 'Buat kegiatan'} onAction={() => setShowForm(true)}>
          Bikin rencana pertama bersama lingkunganmu.
        </EmptyState>
      )}
    </>
  );
}
