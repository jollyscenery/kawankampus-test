import { useData } from '../../context/DataContext';
import PersonCard from '../cards/PersonCard';
import { EmptyState, InlineError, SkeletonList } from '../common/Interface';

export default function ConnectTab({ onNavigateTab }) {
  const { people, peopleLoading, peopleError, retryPeople } = useData();

  return (
    <>
      <div className="page-intro"><p>Kenalan dengan mahasiswa dari jurusan lain lewat minat yang sama.</p></div>
      {peopleLoading ? <SkeletonList type="person" label="Memuat profil teman" />
        : peopleError ? <InlineError onRetry={retryPeople}>{peopleError}</InlineError>
        : people.length > 0 ? (
            <div className="people-grid">{people.map((person) => <PersonCard key={person.id} person={person} />)}</div>
          ) : (
            <EmptyState title="Belum ada profil teman" action="Jelajahi Lingkungan Aku" onAction={() => onNavigateTab('communities')}>
              Coba lihat lingkungan yang sesuai minatmu untuk mulai berkenalan.
            </EmptyState>
          )}
    </>
  );
}
