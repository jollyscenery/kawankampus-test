import { ShieldCheck } from 'lucide-react';

export default function VerifyTab({ onNavigateTab }) {
  return (
    <section className="verify-panel" aria-labelledby="verify-status-title">
      <ShieldCheck size={35} aria-hidden="true" />
      <h2 id="verify-status-title">Verifikasi belum tersedia</h2>
      <p>Kawan Kampus belum terhubung ke sistem identitas kampus. Saat ini status mahasiswa belum bisa dikonfirmasi melalui email kampus atau KTM.</p>
      <button className="btn btn-outline" type="button" onClick={() => onNavigateTab('profile')}>Kembali ke profil</button>
    </section>
  );
}
