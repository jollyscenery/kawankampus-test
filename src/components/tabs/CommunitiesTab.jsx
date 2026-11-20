import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import CommunityCard from '../cards/CommunityCard';
import { INTEREST_OPTIONS } from '../../services/mockData';
import { EmptyState, InlineError, SearchField, SkeletonList } from '../common/Interface';

export default function CommunitiesTab() {
  const { communities, communitiesLoading, membershipsLoading, communitiesError, membershipsError,
    retryCircles, createCommunity } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [interestTag, setInterestTag] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setError(err.code ? 'Circle belum bisa disimpan. Coba lagi.' : err.message);
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
          {showForm ? 'Tutup formulir' : 'Buat circle'}
        </button>
      </div>

      {showForm && (
        <form className="editor-form" id="create-circle" onSubmit={handleSubmit}>
          <h2>Circle baru</h2>
          <div className="form-grid">
            <div><label htmlFor="circle-name">Nama circle</label>
              <input id="circle-name" required autoFocus value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div><label htmlFor="circle-interest">Minat utama</label>
              <select id="circle-interest" required value={interestTag} onChange={(event) => setInterestTag(event.target.value)}>
                <option value="" disabled>Pilih minat circle</option>
                {INTEREST_OPTIONS.map(({ value }) => <option value={value} key={value}>{value}</option>)}
              </select></div>
            <div className="full"><label htmlFor="circle-description">Deskripsi <small>(opsional)</small></label>
              <textarea id="circle-description" rows="2" value={description}
                onChange={(event) => setDescription(event.target.value)} /></div>
          </div>
          {error && <InlineError>{error}</InlineError>}
          <button type="submit" className="btn btn-primary form-submit" disabled={pending}>{pending ? 'Menyimpan…' : 'Simpan circle'}</button>
        </form>
      )}

      <div className="discovery-tools">
        <SearchField id="community-search" label="Cari circle" value={search} onChange={setSearch} placeholder="Cari nama circle atau minat" />
      </div>
      {communitiesLoading || membershipsLoading ? <SkeletonList type="circle" label="Memuat daftar circle" />
        : (communitiesError || membershipsError) ? <InlineError onRetry={retryCircles}>{communitiesError || membershipsError}</InlineError>
        : filtered.length > 0 ? (
            <div className="card-grid">{filtered.map((circle) => <CommunityCard key={circle.id} community={circle} />)}</div>
          ) : query ? (
            <EmptyState type="search" title="Circle belum ketemu" action="Hapus pencarian" onAction={clearSearch}>
              Coba nama circle atau minat lain.
            </EmptyState>
          ) : (
            <EmptyState title="Belum ada circle" action={showForm ? undefined : 'Buat circle'} onAction={() => setShowForm(true)}>
              Mulai dari minat yang ingin kamu bagi dengan mahasiswa lain.
            </EmptyState>
          )}
    </>
  );
}
