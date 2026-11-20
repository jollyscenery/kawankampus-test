import { ArrowRight, CalendarDays, UsersRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getUpcomingEvents } from '../../utils/events';
import CommunityCard from '../cards/CommunityCard';
import EventCard from '../cards/EventCard';
import { EmptyState, InlineError, SkeletonList } from '../common/Interface';

export default function HomeTab({ onNavigateTab }) {
  const { currentUser } = useAuth();
  const { communities, isCommunityJoined, events, eventsLoading, eventsError, people, peopleLoading, peopleError,
    communitiesLoading, membershipsLoading, communitiesError, membershipsError, retryCircles, retryEvents } = useData();
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || 'Kawan';
  const joined = communities.filter((circle) => isCommunityJoined(circle.id));
  const upcoming = getUpcomingEvents(events);
  const circlesLoading = communitiesLoading || membershipsLoading;
  const circleError = communitiesError || membershipsError;
  const stats = [
    { id: 'communities', label: 'Lingkungan diikuti', value: circlesLoading || circleError ? '—' : joined.length },
    { id: 'events', label: 'Kegiatan mendatang', value: eventsLoading || eventsError ? '—' : upcoming.length },
    { id: 'connect', label: 'Profil teman', value: peopleLoading || peopleError ? '—' : people.length }
  ];

  return (
    <>
      <section className="welcome-banner" aria-labelledby="welcome-title">
        <div>
          <h2 id="welcome-title">Halo, {firstName}.</h2>
          <p>Ada banyak cara untuk kenalan sehabis kelas. Mulai dari lingkungan yang cocok dengan minatmu.</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigateTab('communities')}>
            Jelajahi Lingkungan Aku <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <img src="/kampus-courtyard.webp" width="1200" height="800" alt="" />
      </section>

      <div className="stats-row" role="group" aria-label="Ringkasan kampus">
        {stats.map(({ id, label, value }) => (
          <button className="stat-link" type="button" key={id} onClick={() => onNavigateTab(id)}>
            <b>{value}</b><span>{label}</span><ArrowRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="home-sections">
        <section aria-labelledby="home-circle-title">
          <div className="content-heading">
            <h2 id="home-circle-title"><UsersRound size={21} aria-hidden="true" /> Lingkungan Aku</h2>
          </div>
          {circlesLoading ? <SkeletonList type="circle" label="Memuat Lingkungan Aku" />
            : circleError ? <InlineError onRetry={retryCircles}>{circleError}</InlineError>
            : joined.length > 0 ? (
                <div className="home-circle-list">
                  {joined.slice(0, 3).map((circle) => <CommunityCard key={circle.id} community={circle} showJoin={false} />)}
                </div>
              ) : (
                <EmptyState title="Belum ikut lingkungan" action="Jelajahi Lingkungan Aku" onAction={() => onNavigateTab('communities')}>
                  Cari teman ngobrol atau partner untuk kegiatan kampusmu.
                </EmptyState>
              )}
        </section>

        <section aria-labelledby="home-event-title">
          <div className="content-heading">
            <h2 id="home-event-title"><CalendarDays size={21} aria-hidden="true" /> Agenda kampus</h2>
            <button type="button" className="action-link" onClick={() => onNavigateTab('events')}>
              Semua kegiatan <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          {eventsLoading ? <SkeletonList type="event" label="Memuat Agenda kampus" />
            : eventsError ? <InlineError onRetry={retryEvents}>{eventsError}</InlineError>
            : upcoming.length > 0 ? (
                <div className="event-list compact-events">{upcoming.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}</div>
              ) : (
                <EmptyState type="event" title="Belum ada kegiatan mendatang" action="Buka agenda" onAction={() => onNavigateTab('events')}>
                  Sudah punya rencana bareng lingkunganmu? Tambahkan kegiatan ke agenda.
                </EmptyState>
              )}
        </section>
      </div>
    </>
  );
}
