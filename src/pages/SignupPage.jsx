import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { InlineError, PublicHeader } from '../components/common/Interface';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { INTEREST_OPTIONS } from '../services/mockData';

export default function SignupPage() {
  const { register } = useAuth();
  const { ensureUserCommunity, showToast } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [social, setSocial] = useState(3);
  const [structure, setStructure] = useState(3);
  const [activity, setActivity] = useState(3);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [interestError, setInterestError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (value) => {
    if (selectedInterests.length >= 4 && !selectedInterests.includes(value)) {
      setInterestError('Pilih maksimal 4 minat.');
      return;
    }
    setInterestError('');
    setSelectedInterests(selectedInterests.includes(value)
      ? selectedInterests.filter((interest) => interest !== value)
      : [...selectedInterests, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInterestError('');

    if (selectedInterests.length < 2) {
      setInterestError('Pilih minimal 2 minat.');
      document.querySelector('#interests input')?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await register({
        name,
        nim,
        email,
        password,
        major,
        bio,
        interests: selectedInterests,
        social,
        structure,
        activity
      });
      ensureUserCommunity(newUser).catch(() => {
        showToast('Akun sudah dibuat. Lingkungan pertama belum bisa disiapkan. Coba gabung lewat halaman Lingkungan Aku.');
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Akun belum bisa dibuat. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <PublicHeader><Link className="text-link" to="/login">Masuk</Link></PublicHeader>
      <main className="signup-layout wrap">
        <div className="signup-intro">
          <p className="kicker">Pendaftaran mahasiswa</p>
          <h1>Bikin profilmu.</h1>
          <p>Ceritakan apa yang kamu suka agar teman dengan minat yang sama bisa menemukanmu.</p>
          <ul className="auth-points">
            <li><Sparkles size={16} aria-hidden="true" /> Pilih 2–4 minat resmi Kawan Kampus.</li>
            <li><Sparkles size={16} aria-hidden="true" /> Profilmu bisa ditemukan mahasiswa lain.</li>
            <li><Sparkles size={16} aria-hidden="true" /> Gabung lingkungan dan kegiatan kampus.</li>
          </ul>
        </div>

        <form className="auth-card signup-card glass-card" id="signup-form" onSubmit={handleSubmit}>
          <h2>Data akun</h2>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="reg-name">Nama lengkap</label>
              <input
                id="reg-name"
                name="name"
                autoComplete="name"
                type="text"
                required
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="reg-nim">NIM</label>
              <input
                id="reg-nim"
                name="nim"
                type="text"
                required
                placeholder="Nomor mahasiswa"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                name="email"
                autoComplete="email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="reg-major">Program studi</label>
              <input
                id="reg-major"
                name="major"
                type="text"
                placeholder="Contoh: DKV, Informatika"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

            <div className="field full">
              <label htmlFor="reg-password">
                Kata sandi <small>(minimal 8 karakter)</small>
              </label>
              <div className="password-field">
                <input
                  id="reg-password"
                  name="password"
                  autoComplete="new-password"
                  type={passwordVisible ? 'text' : 'password'}
                  minLength={8}
                  required
                  placeholder="Buat kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="icon-button" type="button" aria-controls="reg-password"
                  aria-label={passwordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="field full">
              <label htmlFor="reg-bio">
                Bio singkat <small>(opsional)</small>
              </label>
              <textarea
                id="reg-bio"
                name="bio"
                rows={2}
                placeholder="Hal yang ingin orang lain tahu tentangmu..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <h3 className="signup-section-title">Minat</h3>
          <fieldset className="interest-field" aria-describedby={interestError ? 'signup-interests-error' : undefined}>
            <legend>Pilih 2–4 minatmu <small>({selectedInterests.length} dipilih)</small></legend>
            <div className="interest-grid" id="interests">
              {INTEREST_OPTIONS.map((item) => (
                <label key={item.value}>
                  <input
                    type="checkbox"
                    name="interests"
                    value={item.value}
                    checked={selectedInterests.includes(item.value)}
                    onChange={() => handleInterestToggle(item.value)}
                  />
                  <span>{item.value}</span>
                </label>
              ))}
            </div>
            {interestError && <InlineError id="signup-interests-error">{interestError}</InlineError>}
          </fieldset>

          <h3 className="signup-section-title">Preferensi</h3>

          <div className="range-field">
            <label htmlFor="social">
              <span>Gaya sosial</span>
              <output htmlFor="social">{social}/5</output>
            </label>
            <input
              id="social"
              name="social"
              type="range"
              aria-describedby="social-ends"
              min={1}
              max={5}
              value={social}
              onChange={(e) => setSocial(Number(e.target.value))}
              style={{ '--range-progress': `${(social - 1) * 25}%` }}
            />
            <div className="range-endpoints" id="social-ends">
              <span>Grup kecil</span>
              <span>Rame-rame</span>
            </div>
          </div>

          <div className="range-field">
            <label htmlFor="structure">
              <span>Gaya jadwal</span>
              <output htmlFor="structure">{structure}/5</output>
            </label>
            <input
              id="structure"
              name="structure"
              type="range"
              aria-describedby="structure-ends"
              min={1}
              max={5}
              value={structure}
              onChange={(e) => setStructure(Number(e.target.value))}
              style={{ '--range-progress': `${(structure - 1) * 25}%` }}
            />
            <div className="range-endpoints" id="structure-ends">
              <span>Santai</span>
              <span>Terstruktur</span>
            </div>
          </div>

          <div className="range-field">
            <label htmlFor="activity">
              <span>Aktivitas</span>
              <output htmlFor="activity">{activity}/5</output>
            </label>
            <input
              id="activity"
              name="activity"
              type="range"
              aria-describedby="activity-ends"
              min={1}
              max={5}
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              style={{ '--range-progress': `${(activity - 1) * 25}%` }}
            />
            <div className="range-endpoints" id="activity-ends">
              <span>Ngobrol</span>
              <span>Banyak kegiatan</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block form-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Membuat akun...' : 'Buat akun & temukan lingkungan →'}
          </button>

          {error && <InlineError>{error}</InlineError>}

          <p className="auth-switch">
            Sudah punya akun?{' '}
            <Link to="/login">Masuk</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
