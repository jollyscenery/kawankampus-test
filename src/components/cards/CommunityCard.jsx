import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, UserRound } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { InlineError } from '../common/Interface';

export default function CommunityCard({ community, showJoin = true, onJoin }) {
  const { isCommunityJoined, joinCommunity } = useData();
  const joined = isCommunityJoined(community.id);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');
    setPending(true);
    try {
      await (onJoin || joinCommunity)(community.id);
    } catch (err) {
      setError(err.code ? 'Belum bisa gabung ke lingkungan ini. Coba lagi.' : err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <article className="community-card">
      {community.interest_tag && <span className="tag">{community.interest_tag}</span>}
      <h3><Link className="card-title-link" to={`/lingkungan/${community.id}`}>{community.name}</Link></h3>
      <p>{community.description || 'Ruang untuk kenalan dengan teman satu minat.'}</p>
      <div className="card-foot">
        <span className="member-count">
          <span className="member-stack" aria-hidden="true">
            {Array.from({ length: Math.min(community.member_count || 0, 3) }, (_, index) =>
              <span key={index}><UserRound size={12} /></span>
            )}
          </span>
          {community.member_count ?? 0} anggota
        </span>
        {joined ? <span className="joined"><Check size={15} aria-hidden="true" /> Bergabung</span> : showJoin && (
          <button type="button" className="btn btn-primary btn-small" onClick={handleJoin} disabled={pending}
            aria-label={pending ? undefined : `Gabung ke ${community.name}`}>
            <Plus size={16} aria-hidden="true" /> {pending ? 'Memproses…' : 'Gabung'}
          </button>
        )}
      </div>
      {error && <InlineError>{error}</InlineError>}
    </article>
  );
}
