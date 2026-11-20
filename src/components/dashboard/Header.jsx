import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const TAB_TITLES = {
  home: 'Beranda',
  communities: 'Lingkungan Aku',
  events: 'Kegiatan',
  connect: 'Teman kampus',
  profile: 'Profil saya',
  verify: 'Verifikasi mahasiswa'
};

export default function Header({ activeTab, onProfile }) {
  const { currentUser } = useAuth();
  const name = currentUser?.name || 'Mahasiswa';
  const major = currentUser?.major || 'Mahasiswa';

  return (
    <header className="app-header glass-nav">
      <h1 id="page-title" tabIndex={-1}>{TAB_TITLES[activeTab]}</h1>
      <div className="header-actions">
        <ThemeToggle id="dashboard-theme-toggle" />
        <button className="user-pill" type="button" onClick={onProfile}
          aria-label="Buka profil saya" title={`${name} — ${major}`}>
          <span className="user-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          <span className="user-details"><b>{name}</b><small>{major}</small></span>
        </button>
      </div>
    </header>
  );
}
