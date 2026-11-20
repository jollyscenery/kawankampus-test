import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, MapPin, UsersRound } from 'lucide-react';
import AutoScrollStrip from '../components/common/AutoScrollStrip';
import { PublicHeader, Wordmark } from '../components/common/Interface';
import ScrollFade from '../components/common/ScrollFade';
import LandingAgenda from '../components/landing/LandingAgenda';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const gallery = [
  {
    src: '/kampus-courtyard.webp',
    width: 1200,
    height: 800,
    alt: 'Tiga mahasiswa berbincang di meja halaman kampus',
    caption: 'Obrolan sehabis kelas',
  },
  {
    src: '/kampus-studio.webp',
    width: 768,
    height: 1024,
    alt: 'Empat mahasiswa mengerjakan poster di meja studio',
    caption: 'Berkarya bareng di studio',
  },
  {
    src: '/kampus-garden.webp',
    width: 768,
    height: 1024,
    alt: 'Tiga mahasiswa menanam bibit di kebun warga',
    caption: 'Gotong royong di kebun warga',
  },
];

const visitorSteps = [
  'Pilih minat yang paling menggambarkan dirimu.',
  'Gabung lingkungan yang sesuai dan mulai berkenalan.',
  'Ikut kegiatan kampus yang sedang berlangsung.',
];

function scrollToAgenda(event) {
  const agenda = document.getElementById('agenda');
  if (!agenda) return;

  event.preventDefault();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  agenda.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (window.location.hash !== '#agenda') {
    window.history.replaceState(window.history.state, '', '#agenda');
  }
}

function shouldAnimateReveals() {
  return typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function LandingPage() {
  const [revealReady] = useState(shouldAnimateReveals);
  const { isAuthenticated } = useAuth();
  const { communities, communitiesLoading, communitiesError } = useData();
  const destination = isAuthenticated ? '/dashboard' : '/signup';
  // Only real Firestore communities are shown. Visitors get honest guidance,
  // never fabricated sample records.
  const displayedCommunities = isAuthenticated ? communities : [];

  return (
    <div className="landing" data-reveal-ready={revealReady || undefined}>
      <PublicHeader linkToHome={false}>
        <a className="text-link public-discover" href="#cara-kerja">Jelajah</a>
        {isAuthenticated
          ? <Link className="btn btn-primary" to={destination}>Ke Beranda <ArrowUpRight size={16} aria-hidden="true" /></Link>
          : <>
              <Link className="text-link" to="/login">Masuk</Link>
              <Link className="btn btn-primary" to="/signup">Daftar <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </>}
      </PublicHeader>

      <main id="main-content" className="wrap">
        <section className="hero" aria-labelledby="hero-title">
          <ScrollFade className="hero-copy">
            <h1 id="hero-title">Teman baru.<br /> <em>Cerita baru.</em></h1>
            <p className="hero-description">
              Dari teman hunting foto sampai kawan belajar. Temukan orang, lingkungan, dan kegiatan yang bikin kamu betah di kampus dan sekitarnya.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-large" to={destination}>
                {isAuthenticated ? 'Buka beranda' : 'Jelajahi Lingkungan Aku'} <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <a className="text-link" href="#agenda" onClick={scrollToAgenda}>Lihat kegiatan <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
          </ScrollFade>

          <ScrollFade className="hero-showcase glass-card">
            <AutoScrollStrip id="kampus-gallery" label="Galeri kampus" className="campus-gallery-strip"
              direction="left" holdSeconds={2} pauseOnHover={false} playWithReducedMotion items={[
                <figure className="hero-slide logo-slide" key="logo">
                  <img src="/logo-kawan-kampus.png" width="922" height="727" fetchPriority="high"
                    draggable={false} alt="Kawan Kampus, teman perjalanan akademikmu" />
                </figure>,
                ...gallery.map(({ src, width, height, alt, caption }) => (
                  <figure className="hero-slide photo-slide" key={src}>
                    <img src={src} width={width} height={height} alt={alt} decoding="async" draggable={false} />
                    <figcaption><MapPin size={15} aria-hidden="true" /> {caption}</figcaption>
                  </figure>
                )),
              ]} />
          </ScrollFade>
        </section>

        <section className="landing-discovery" id="cara-kerja" aria-labelledby="discovery-title">
          <ScrollFade className="section-heading">
            <div>
              <h2 id="discovery-title">Selepas kelas, mau ke mana?</h2>
            </div>
            <p>Jelajahi lingkungan dan agenda kampus, dari halaman fakultas sampai lingkungan sekitar.</p>
          </ScrollFade>

          <div className="discovery-board">
            <ScrollFade as="section" className="sample-circles" aria-labelledby="sample-circle-title">
              <h3 id="sample-circle-title"><UsersRound size={20} aria-hidden="true" /> Lingkungan kampus</h3>
              {isAuthenticated && communitiesLoading ? (
                <p className="circle-list-state" role="status">Memuat lingkungan kampus…</p>
              ) : isAuthenticated && communitiesError ? (
                <p className="circle-list-state" role="alert">{communitiesError}</p>
              ) : isAuthenticated && displayedCommunities.length === 0 ? (
                <p className="circle-list-state">Belum ada lingkungan kampus. Mulai dengan membuat lingkungan pertamamu.</p>
              ) : displayedCommunities.length > 0 ? (
                <ul id="campus-circles" className="campus-circles-list" aria-labelledby="sample-circle-title" tabIndex={0}>
                  {displayedCommunities.map(({ id, name, interest_tag, description }) => (
                    <li className="circle-preview" key={id}>
                      <div><strong>{name}</strong><p>{description}</p></div>
                      <span className="tag">{interest_tag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="visitor-guide">
                  <strong>Masuk untuk melihat lingkungan kampus yang nyata.</strong>
                  <p>Kami tidak menampilkan contoh palsu. Setelah daftar, kamu akan melihat lingkungan yang benar-benar dibuat mahasiswa.</p>
                  <ul className="visitor-steps">
                    {visitorSteps.map((step) => (
                      <li key={step}><Check size={16} aria-hidden="true" /> <span>{step}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <Link className="text-link" to={destination} state={isAuthenticated ? { dashboardTab: 'communities' } : undefined}>
                Jelajahi Lingkungan Aku <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </ScrollFade>
            <div className="sample-side">
               <LandingAgenda destination={destination} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </section>

        {/* SubscriptionTiers is intentionally not rendered while the pricing
            presentation is paused. The component is kept for easy restoration. */}
      </main>

      <ScrollFade as="footer" className="wrap public-footer">
        <Wordmark linkToHome={false} />
        <small>© Kawan Kampus</small>
      </ScrollFade>
    </div>
  );
}
