import { useState } from 'react';
import { CalendarDays, House, LogOut, ShieldCheck, UserRound, UserRoundPlus, UsersRound } from 'lucide-react';
import { InlineError, Wordmark } from '../common/Interface';

const NAV_ITEMS = [
  { id: 'home', label: 'Beranda', icon: House },
  { id: 'communities', label: 'Circle', icon: UsersRound },
  { id: 'events', label: 'Kegiatan', icon: CalendarDays },
  { id: 'connect', label: 'Teman', icon: UserRoundPlus },
  { id: 'profile', label: 'Profil', icon: UserRound },
  { id: 'verify', label: 'Verifikasi', icon: ShieldCheck }
];

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

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
      <Wordmark />
      <nav className="side-nav" aria-label="Ruang kampus">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onTabChange(id)}>
            <Icon size={19} aria-hidden="true" /> <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {error && <InlineError>{error}</InlineError>}
        <button type="button" className="logout" onClick={handleLogout} disabled={loggingOut}>
          <LogOut size={18} aria-hidden="true" /> {loggingOut ? 'Keluar…' : 'Keluar'}
        </button>
      </div>
    </aside>
  );
}
