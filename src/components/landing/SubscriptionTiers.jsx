import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ScrollFade from '../common/ScrollFade';

const tiers = [
  {
    name: 'Good',
    audience: 'Buat kamu yang baru mulai kenalan.',
    features: ['Profil dan minat pribadi', 'Cari circle dan kegiatan sekitar', 'Ikut agenda yang kamu suka'],
  },
  {
    name: 'Best',
    audience: 'Buat pengurus circle dan tim kampus.',
    features: ['Semua yang ada di Better', 'Bantu kelola agenda lintas circle', 'Rangkum kegiatan untuk pengurus'],
  },
  {
    name: 'Better',
    audience: 'Buat kamu yang aktif ikut banyak circle.',
    features: ['Semua yang ada di Good', 'Simpan agenda favorit', 'Pengingat sebelum kegiatan'],
  },
];

export default function SubscriptionTiers() {
  const [selected, setSelected] = useState('');

  return (
    <section className="subscription" id="paket" aria-labelledby="subscription-title">
      <ScrollFade className="section-heading">
        <div>
          <h2 id="subscription-title">Paket berlangganan</h2>
          <p>Pratinjau pilihan paket. Harga dan pembayaran belum tersedia.</p>
        </div>
      </ScrollFade>
      <div className="tier-grid">
        {tiers.map(({ name, audience, features }, index) => (
          <ScrollFade as="article" style={{ '--reveal-delay': `${index * 80}ms` }} className={`tier-card${name === 'Best' ? ' tier-featured glass-card' : ''}`}
            data-selected={selected === name} key={name}>
            <h3>{name}</h3>
            <p>{audience}</p>
            <ul>
              {features.map((feature) => <li key={feature}><Check size={16} aria-hidden="true" /> {feature}</li>)}
            </ul>
            <button className={`btn ${name === 'Best' || selected === name ? 'btn-primary' : 'btn-outline'}`}
              type="button" aria-pressed={selected === name} onClick={() => setSelected(name)}>
              Pilih {name} <ArrowRight size={17} aria-hidden="true" />
            </button>
          </ScrollFade>
        ))}
      </div>
      <p className="tier-feedback" role="status">{selected && `Paket ${selected} dipilih untuk pratinjau.`}</p>
    </section>
  );
}
