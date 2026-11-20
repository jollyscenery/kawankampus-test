import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PublicHeader, SkeletonList } from './components/common/Interface';
import Toast from './components/common/Toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
