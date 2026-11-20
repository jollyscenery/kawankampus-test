import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InlineError } from '../common/Interface';
import { INTEREST_OPTIONS } from '../../services/mockData';

export default function ProfileTab() {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedInterests, setSelectedInterests] = useState(currentUser?.interests || []);
  const [social, setSocial] = useState(currentUser?.social || 3);
  const [structure, setStructure] = useState(currentUser?.structure || 3);
  const [activity, setActivity] = useState(currentUser?.activity || 3);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [interestError, setInterestError] = useState('');
  const [pending, setPending] = useState(false);
  const legacyInterests = selectedInterests.filter((value) =>
    !INTEREST_OPTIONS.some((option) => option.value === value)
  );

  const handleInterestToggle = (interestVal) => {
    if (selectedInterests.length >= 4 && !selectedInterests.includes(interestVal)) {
      setInterestError('Maksimal memilih 4 minat.');
      return;
    }
    setInterestError('');
    setSelectedInterests(selectedInterests.includes(interestVal)
      ? selectedInterests.filter((interest) => interest !== interestVal)
      : [...selectedInterests, interestVal]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInterestError('');
    setMessage('');

    if (selectedInterests.length < 2 || selectedInterests.length > 4) {
      setInterestError('Pilih 2–4 minat.');
      document.querySelector('#profile-interests input')?.focus();
      return;
    }

    setPending(true);
    try {
      await updateProfile({
        name,
        major,
        bio,
        interests: selectedInterests,
        social,
        structure,
        activity
      });
      setMessage('Profil berhasil diperbarui.');
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const initial = (currentUser?.name || 'K').charAt(0).toUpperCase();

  return (
    <div className="profile-layout">
      <section className="profile-summary">
        <div className="profile-avatar" aria-hidden="true">{initial}</div>
        <h2>{currentUser?.name || 'Mahasiswa'}</h2>
        <p>{currentUser?.major || 'Mahasiswa'}</p>
        {currentUser?.bio && <p className="profile-bio">{currentUser.bio}</p>}
        <ul className="profile-tags" aria-label="Minat">
          {(currentUser?.interests || []).map((i) => (
            <li className="tag" key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Perbarui profil</h2>

        <label htmlFor="prof-name">Nama lengkap</label>
        <input
          id="prof-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="prof-major">Program studi</label>
        <input
          id="prof-major"
          name="major"
          type="text"
          placeholder="Contoh: Desain Komunikasi Visual"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />

        <label htmlFor="prof-bio">Bio</label>
        <textarea
          id="prof-bio"
          name="bio"
          rows="3"
          placeholder="Ceritakan sedikit tentang dirimu..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <fieldset className="interest-field" aria-describedby={interestError ? 'profile-interests-error' : undefined}>
          <legend>Minat (pilih 2–4)</legend>
          <div className="interest-grid" id="profile-interests">
            {[...INTEREST_OPTIONS.map(({ value }) => value), ...legacyInterests].map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                <span>{interest}</span>
              </label>
            ))}
          </div>
          {interestError && <InlineError id="profile-interests-error">{interestError}</InlineError>}
        </fieldset>

        <div className="range-field">
          <label htmlFor="prof-social">
            <span>Gaya sosial</span>
            <output htmlFor="prof-social">{social}/5</output>
          </label>
          <input
            id="prof-social"
            name="social"
            type="range"
            aria-describedby="prof-social-ends"
            min="1"
            max="5"
            value={social}
            onChange={(e) => setSocial(Number(e.target.value))}
            style={{ '--range-progress': `${(social - 1) * 25}%` }}
          />
          <div className="range-endpoints" id="prof-social-ends">
            <span>Grup kecil</span>
            <span>Rame-rame</span>
          </div>
        </div>

        <div className="range-field">
          <label htmlFor="prof-structure">
            <span>Gaya jadwal</span>
            <output htmlFor="prof-structure">{structure}/5</output>
          </label>
          <input
            id="prof-structure"
            name="structure"
            type="range"
            aria-describedby="prof-structure-ends"
            min="1"
            max="5"
            value={structure}
            onChange={(e) => setStructure(Number(e.target.value))}
            style={{ '--range-progress': `${(structure - 1) * 25}%` }}
          />
          <div className="range-endpoints" id="prof-structure-ends">
            <span>Santai</span>
            <span>Terstruktur</span>
          </div>
        </div>

        <div className="range-field">
          <label htmlFor="prof-activity">
            <span>Aktivitas</span>
            <output htmlFor="prof-activity">{activity}/5</output>
          </label>
          <input
            id="prof-activity"
            name="activity"
            type="range"
            aria-describedby="prof-activity-ends"
            min="1"
            max="5"
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
            style={{ '--range-progress': `${(activity - 1) * 25}%` }}
          />
          <div className="range-endpoints" id="prof-activity-ends">
            <span>Ngobrol</span>
            <span>Banyak kegiatan</span>
          </div>
        </div>

        {error && <InlineError>{error}</InlineError>}
        {message && <div className="form-message" role="status">{message}</div>}

        <button type="submit" className="btn btn-primary form-submit" disabled={pending}>
          {pending ? 'Menyimpan…' : 'Simpan perubahan'}
        </button>
      </form>
    </div>
  );
}
