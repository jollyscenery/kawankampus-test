import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { InlineError, PublicHeader } from '../components/common/Interface';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, sessionError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Belum bisa masuk. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <PublicHeader><Link className="text-link" to="/signup">Daftar</Link></PublicHeader>
      <main className="auth-layout wrap">
        <figure className="auth-photo">
          <img src="/kampus-courtyard.webp" width="1200" height="800"
            alt="Mahasiswa mengobrol bersama di halaman kampus" />
          <figcaption>Selalu ada waktu buat kenalan sehabis kelas.</figcaption>
        </figure>
        <form className="auth-card glass-card" id="login-form" onSubmit={handleSubmit}>
          <h1>Masuk ke<br />Kawan Kampus.</h1>
          <p>Temukan lagi circle, teman, dan agenda kampusmu.</p>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required
            placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />

          <label htmlFor="password">Kata sandi</label>
          <div className="password-field">
            <input id="password" name="password" type={passwordVisible ? 'text' : 'password'}
              autoComplete="current-password" required value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <button className="icon-button" type="button" aria-controls="password"
              aria-label={passwordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {(error || sessionError) && <InlineError>{error || sessionError}</InlineError>}
          <button className="btn btn-primary btn-block form-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Sedang masuk…' : 'Masuk'} <ArrowRight size={18} aria-hidden="true" />
          </button>

          <p className="auth-switch">Belum punya akun? <Link to="/signup">Daftar di sini</Link></p>
        </form>
      </main>
    </div>
  );
}
