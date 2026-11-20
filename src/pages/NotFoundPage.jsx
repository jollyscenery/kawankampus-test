import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/common/Interface';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { isAuthenticated, loading } = useAuth();
  const primary = !loading && isAuthenticated
    ? { to: '/dashboard', label: 'Kembali ke beranda' }
    : { to: '/', label: 'Kembali ke halaman utama' };

  return (
    <div className="landing">
      <PublicHeader />
      <main className="wrap">
        <div className="status-page">
          <div>
            <p className="status-code">404</p>
            <h1>Halaman tidak ditemukan</h1>
            <p>Tautan ini mungkin sudah berubah atau tidak pernah ada. Kamu bisa kembali dan melanjutkan dari halaman utama.</p>
            <div className="status-actions">
              <Link className="btn btn-primary" to={primary.to}>{primary.label}</Link>
              {!isAuthenticated && !loading && <Link className="btn btn-outline" to="/login">Masuk</Link>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
