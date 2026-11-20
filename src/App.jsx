import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PublicHeader, SkeletonList } from './components/common/Interface';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LingkunganDetailPage from './pages/LingkunganDetailPage';
import PublicProfilePage from './pages/PublicProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedDashboard() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch (error) {
      setSigningOut(false);
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="wrap session-loading">
          <h1>Menyiapkan beranda</h1>
          <SkeletonList type="circle" label="Memuat sesi dan profilmu" />
        </main>
      </>
    );
  }

  if (!isAuthenticated) return <Navigate to={signingOut ? '/' : '/login'} replace />;

  return <DashboardPage onLogout={handleLogout} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<ProtectedDashboard />} />
              <Route path="/lingkungan/:id" element={<LingkunganDetailPage />} />
              <Route path="/profil/:uid" element={<PublicProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toast />
          </ErrorBoundary>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
