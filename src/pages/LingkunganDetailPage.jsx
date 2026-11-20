import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Info, UsersRound } from 'lucide-react';
import { InlineError, PublicHeader, SkeletonList } from '../components/common/Interface';
import EventCard from '../components/cards/EventCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getUpcomingEvents } from '../utils/events';

const backState = { dashboardTab: 'communities' };

export default function LingkunganDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { communities, communitiesLoading, membershipsLoading, communitiesError, retryCircles, isCommunityJoined,
    joinCommunity, events, eventsLoading, eventsError } = useData();
  const [pending, setPending] = useState(false);
  const [joinError, setJoinError] = useState('');

  if (authLoading) {
    return (
      <div className="landing">
        <PublicHeader />
        <main className="wrap detail-page">
          <SkeletonList type="circle" label="Menyiapkan halaman lingkungan" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const community = communities.find((item) => String(item.id) === String(id));
  const joined = community ? isCommunityJoined(community.id) : false;
  const communityEvents = community
    ? getUpcomingEvents(events).filter((event) => String(event.community_id) === String(community.id))
    : [];

  const handleJoin = async () => {
    if (!community || pending) return;
    setJoinError('');
    setPending(true);
    try {
      await joinCommunity(community.id);
    } catch (err) {
      setJoinError(err?.code ? 'Belum bisa gabung ke lingkungan ini. Coba lagi.' : err.message);
    } finally {
      setPending(false);
    }
  };

  let content;
  if (communitiesLoading || membershipsLoading) {
    content = <SkeletonList type="circle" label="Memuat informasi lingkungan" />;
  } else if (communitiesError) {
    content = <InlineError onRetry={retryCircles}>{communitiesError}</InlineError>;
  } else if (!community) {
    content = (
      <div className="status-page">
        <div>
          <p className="status-code">404</p>
          <h1>Lingkungan tidak ditemukan</h1>
          <p>Lingkungan ini mungkin sudah dihapus atau tautannya tidak lagi berlaku.</p>
          <div className="status-actions">
            <Link className="btn btn-primary" to="/dashboard" state={backState}>Kembali ke beranda</Link>
            <Link className="btn btn-outline" to="/dashboard" state={{ dashboardTab: 'communities' }}>Jelajahi Lingkungan Aku</Link>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        <section className="detail-hero" aria-labelledby="lingkungan-title">
          {community.interest_tag && <span className="tag">{community.interest_tag}</span>}
          <h1 id="lingkungan-title">{community.name}</h1>
          <p>{community.description || 'Ruang untuk kenalan dengan teman satu minat.'}</p>
          <div className="detail-meta">
            <span><UsersRound size={16} aria-hidden="true" /> {community.member_count ?? 0} anggota</span>
            <span><CalendarDays size={16} aria-hidden="true" /> {communityEvents.length} kegiatan mendatang</span>
          </div>
          {joined ? (
            <div className="detail-actions">
              <span className="badge badge-success"><Check size={15} aria-hidden="true" /> Bergabung</span>
            </div>
          ) : (
            <div className="detail-actions">
              <p className="detail-empty">Kamu belum bergabung di lingkungan ini.</p>
              <button type="button" className="btn btn-primary" onClick={handleJoin} disabled={pending}>
                {pending ? 'Memproses…' : 'Gabung sekarang'}
              </button>
            </div>
          )}
          {joinError && <InlineError>{joinError}</InlineError>}
        </section>

        <div className="detail-grid">
          <section className="detail-panel" aria-labelledby="lingkungan-agenda-title">
            <h2 id="lingkungan-agenda-title"><CalendarDays size={20} aria-hidden="true" /> Agenda lingkungan</h2>
            {eventsLoading ? <p className="detail-empty" role="status">Memuat kegiatan…</p>
              : eventsError ? <InlineError>{eventsError}</InlineError>
                : communityEvents.length > 0 ? (
                  <div className="event-list compact-events">
                    {communityEvents.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="detail-empty">Belum ada kegiatan mendatang di lingkungan ini.</p>
                )}
          </section>

          <aside className="detail-panel" aria-labelledby="lingkungan-about-title">
            <h2 id="lingkungan-about-title"><Info size={20} aria-hidden="true" /> Tentang lingkungan</h2>
            <p className="detail-empty">
              {community.description || 'Lingkungan ini belum menambahkan deskripsi.'}
            </p>
            <div className="detail-unavailable">
              Forum diskusi lingkungan belum tersedia. Halaman ini hanya menampilkan informasi lingkungan tanpa kiriman atau balasan.
            </div>
            <p className="detail-note">Dibuat oleh anggota Kawan Kampus.</p>
          </aside>
        </div>
      </>
    );
  }

  return (
    <div className="landing">
      <PublicHeader>
        <Link className="btn btn-outline" to="/dashboard" state={backState}>Lingkungan Aku</Link>
      </PublicHeader>
      <main className="wrap detail-page">
        <Link className="action-link detail-back" to="/dashboard" state={backState}>
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda
        </Link>
        {content}
      </main>
    </div>
  );
}
