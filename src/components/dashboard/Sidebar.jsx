import { useState } from 'react';
import {
  CalendarDays,
  House,
  LogOut,
  Plus,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
  UsersRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { InlineError, Wordmark } from '../common/Interface';

const NAV_ITEMS = [
  { id: 'home', label: 'Beranda', icon: House },
  { id: 'communities', label: 'Lingkungan Aku', icon: UsersRound },
  { id: 'events', label: 'Kegiatan', icon: CalendarDays },
  { id: 'connect', label: 'Teman', icon: UserRoundPlus },
  { id: 'profile', label: 'Profil', icon: UserRound },
  { id: 'verify', label: 'Verifikasi', icon: ShieldCheck }
];

export default function Sidebar({ activeTab, onTabChange, onCreateCommunity, onLogout }) {
  const { currentUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const name = currentUser?.name || 'Mahasiswa';
  const major = currentUser?.major || 'Mahasiswa';

  const handleLogout = async () => {
    setError('');
    setLoggingOut(true);
    try {
      await onLogout();
    } catch {
      setError('Belum bisa keluar. Coba lagi.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Wordmark />
        <nav className="side-nav" aria-label="Ruang kampus">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" aria-current={activeTab === id ? 'page' : undefined}
              onClick={() => onTabChange(id)}>
              <Icon size={19} aria-hidden="true" /> <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button type="button" className="sidebar-new" onClick={onCreateCommunity}>
          <Plus size={17} aria-hidden="true" /> Lingkungan baru
        </button>

        <div className="sidebar-account">
          <button type="button" className="sidebar-user" onClick={() => onTabChange('profile')}
            aria-label={`Buka profil ${name}`} title={`${name} — ${major}`}>
            <span className="user-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
            <span className="user-details"><b>{name}</b><small>{major}</small></span>
          </button>
          <ThemeToggle id="sidebar-theme-toggle" />
        </div>

        {error && <InlineError>{error}</InlineError>}
        <button type="button" className="logout" onClick={handleLogout} disabled={loggingOut}>
          <LogOut size={18} aria-hidden="true" /> {loggingOut ? 'Keluar…' : 'Keluar'}
        </button>
      </div>
    </aside>
  );
}
