import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Info, MessageCircle, UsersRound } from 'lucide-react';
import { InlineError, PublicHeader, SkeletonList } from '../components/common/Interface';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const backState = { dashboardTab: 'connect' };

export default function PublicProfilePage() {
  const { uid } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: 'loading', profile: null });

  useEffect(() => {
    if (!isAuthenticated || !uid) return undefined;

    let cancelled = false;
    setState({ status: 'loading', profile: null });

    getDoc(doc(db, 'publicProfiles', uid))
      .then((snapshot) => {
        if (cancelled) return;
        setState(snapshot.exists()
          ? { status: 'ready', profile: { id: snapshot.id, ...snapshot.data() } }
          : { status: 'missing', profile: null });
      })
      .catch((error) => {
        console.error('Unable to load public profile:', error);
        if (!cancelled) setState({ status: 'error', profile: null });
      });

    return () => {
      cancelled = true;
    };
  }, [uid, isAuthenticated, attempt]);

  if (authLoading) {
    return (
      <div className="landing">
        <PublicHeader />
        <main className="wrap detail-page">
          <SkeletonList type="person" label="Menyiapkan profil" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const { status, profile } = state;
  const initial = (profile?.name || '?').charAt(0).toUpperCase();

  let content;
  if (status === 'loading') {
    content = <SkeletonList type="person" label="Memuat profil mahasiswa" />;
  } else if (status === 'error') {
    content = <InlineError onRetry={() => setAttempt((value) => value + 1)}>Profil belum bisa dimuat.</InlineError>;
  } else if (status === 'missing' || !profile) {
    content = (
      <div className="status-page">
        <div>
          <p className="status-code">404</p>
          <h1>Profil tidak ditemukan</h1>
          <p>Profil ini belum tersedia atau sudah tidak dibagikan oleh pemiliknya.</p>
          <div className="status-actions">
            <Link className="btn btn-primary" to="/dashboard" state={backState}>Kembali ke Teman kampus</Link>
          </div>
        </div>
      </div>
    );
  } else {
    const interests = Array.isArray(profile.interests) ? profile.interests : [];
    content = (
      <>
        <section className="detail-hero" aria-labelledby="public-profile-title">
          <div className="public-profile-head">
            <span className="profile-avatar" aria-hidden="true">{initial}</span>
            <div>
              <h1 id="public-profile-title">{profile.name || 'Mahasiswa'}</h1>
              <p>{profile.major || 'Mahasiswa'}</p>
            </div>
          </div>
          {interests.length > 0 && (
            <ul className="profile-tag-list" aria-label="Minat">
              {interests.map((interest) => <li className="tag" key={interest}>{interest}</li>)}
            </ul>
          )}
          <div className="public-profile-meta">
            <span className="badge badge-muted"><MessageCircle size={14} aria-hidden="true" /> Pesan langsung belum tersedia</span>
          </div>
        </section>

        <div className="detail-grid">
          <section className="detail-panel" aria-labelledby="public-about-title">
            <h2 id="public-about-title"><Info size={20} aria-hidden="true" /> Tentang</h2>
            <p className="detail-empty">{profile.bio || 'Belum menambahkan bio.'}</p>
          </section>

          <aside className="detail-panel" aria-labelledby="public-activity-title">
            <h2 id="public-activity-title"><UsersRound size={20} aria-hidden="true" /> Aktivitas</h2>
            <div className="detail-unavailable">
              Daftar lingkungan dan kegiatan yang diikuti belum dapat ditampilkan.
            </div>
            <p className="detail-note">
              Kawan Kampus membatasi data keanggotaan agar hanya kamu yang bisa melihat riwayatmu sendiri.
            </p>
          </aside>
        </div>
      </>
    );
  }

  return (
    <div className="landing">
      <PublicHeader>
        <Link className="btn btn-outline" to="/dashboard" state={backState}>Teman kampus</Link>
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
