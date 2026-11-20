import { useState } from 'react';
import { Check, UserRoundPlus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { InlineError } from '../common/Interface';

export default function PersonCard({ person }) {
  const { currentUser } = useAuth();
  const { getConnectionStatus, sendConnection, acceptConnection } = useData();
  const connection = getConnectionStatus(person.id);
  const accepted = connection?.status === 'accepted';
  const awaiting = connection?.status === 'pending';
  const incoming = awaiting && connection.toUid === currentUser?.id;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    setPending(true);
    try {
      if (incoming) await acceptConnection(connection.id);
      else await sendConnection(person.id);
    } catch {
      setError(incoming ? 'Koneksi belum bisa diterima. Coba lagi.' : 'Ajakan kenalan belum terkirim. Coba lagi.');
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="person-card">
      <header className="person-heading">
        <span className="person-avatar" aria-hidden="true">{person.name?.charAt(0).toUpperCase() || '?'}</span>
        <div><h3>{person.name}</h3><p>{person.major || 'Mahasiswa'}</p></div>
      </header>
      <p className="person-bio">{person.bio || 'Belum menambahkan bio.'}</p>
      <ul className="profile-tags" aria-label="Minat">
        {(person.interests || []).slice(0, 3).map((interest) => (
          <li className="tag" key={interest}>{interest}</li>
        ))}
      </ul>
      <div className="person-action">
        {accepted ? <span className="joined"><Check size={15} aria-hidden="true" /> Terhubung</span>
          : awaiting && !incoming ? <span className="pending">Permintaan terkirim</span>
          : <button type="button" className="btn btn-primary btn-small" disabled={pending}
              aria-label={pending ? undefined : incoming ? `Terima koneksi dari ${person.name}` : `Ajak ${person.name} kenalan`}
              onClick={handleConnect}>
              <UserRoundPlus size={17} aria-hidden="true" /> {pending ? 'Memproses…' : incoming ? 'Terima koneksi' : 'Ajak kenalan'}
            </button>}
      </div>
      {error && <InlineError>{error}</InlineError>}
    </article>
  );
}
