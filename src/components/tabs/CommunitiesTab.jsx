import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import CommunityCard from '../cards/CommunityCard';
import { INTEREST_OPTIONS } from '../../services/mockData';
import { EmptyState, InlineError, SearchField, SkeletonList } from '../common/Interface';

export default function CommunitiesTab({ createIntent = 0, onCreateIntentHandled }) {
  const { communities, communitiesLoading, membershipsLoading, communitiesError, membershipsError,
    retryCircles, createCommunity } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [interestTag, setInterestTag] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  // The sidebar shortcut opens this exact form instead of a new modal.
  useEffect(() => {
    if (createIntent > 0) {
      setShowForm(true);
      onCreateIntentHandled?.();
    }
  }, [createIntent, onCreateIntentHandled]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setError('');
    setPending(true);
    try {
      await createCommunity({ name, interest_tag: interestTag, description });
      setName('');
      setInterestTag('');
      setDescription('');
      setShowForm(false);
      document.getElementById('toggle-circle-form')?.focus();
    } catch (err) {
      setError(err.code ? 'Lingkungan belum bisa disimpan. Coba lagi.' : err.message);
    } finally {
      setPending(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    document.getElementById('community-search')?.focus();
  };

  const query = search.trim().toLowerCase();
  const filtered = communities.filter((circle) =>
    [circle.name, circle.interest_tag, circle.description].some((value) => value?.toLowerCase().includes(query))
  );

  return (
    <>
      <div className="page-intro">
        <p>Gabung dengan teman satu minat, atau buka ruang baru untuk hal yang kamu suka.</p>
        <button type="button" id="toggle-circle-form" className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
          aria-expanded={showForm} aria-controls="create-circle" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
          {showForm ? 'Tutup formulir' : 'Lingkungan baru'}
        </button>
      </div>

      {showForm && (
        <form className="editor-form" id="create-circle" onSubmit={handleSubmit}>
          <h2>Lingkungan baru</h2>
          <div className="form-grid">
            <div><label htmlFor="circle-name">Nama lingkungan</label>
              <input id="circle-name" required autoFocus value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div><label htmlFor="circle-interest">Minat utama</label>
              <select id="circle-interest" required value={interestTag} onChange={(event) => setInterestTag(event.target.value)}>
                <option value="" disabled>Pilih minat lingkungan</option>
                {INTEREST_OPTIONS.map(({ value }) => <option value={value} key={value}>{value}</option>)}
              </select></div>
            <div className="full"><label htmlFor="circle-description">Deskripsi <small>(opsional)</small></label>
              <textarea id="circle-description" rows="2" value={description}
                onChange={(event) => setDescription(event.target.value)} /></div>
          </div>
          {error && <InlineError>{error}</InlineError>}
          <button type="submit" className="btn btn-primary form-submit" disabled={pending}>{pending ? 'Menyimpan…' : 'Simpan lingkungan'}</button>
        </form>
      )}

      <div className="discovery-tools">
        <SearchField id="community-search" label="Cari lingkungan" value={search} onChange={setSearch} placeholder="Cari nama lingkungan atau minat" />
      </div>
      {communitiesLoading || membershipsLoading ? <SkeletonList type="circle" label="Memuat daftar lingkungan" />
        : (communitiesError || membershipsError) ? <InlineError onRetry={retryCircles}>{communitiesError || membershipsError}</InlineError>
        : filtered.length > 0 ? (
            <div className="card-grid">{filtered.map((circle) => <CommunityCard key={circle.id} community={circle} />)}</div>
          ) : query ? (
            <EmptyState type="search" title="Lingkungan belum ketemu" action="Hapus pencarian" onAction={clearSearch}>
              Coba nama lingkungan atau minat lain.
            </EmptyState>
          ) : (
            <EmptyState title="Belum ada lingkungan" action={showForm ? undefined : 'Lingkungan baru'} onAction={() => setShowForm(true)}>
              Mulai dari minat yang ingin kamu bagi dengan mahasiswa lain.
            </EmptyState>
          )}
    </>
  );
}
