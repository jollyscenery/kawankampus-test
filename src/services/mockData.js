export const INTEREST_OPTIONS = [
  { value: 'Teknologi', label: 'Teknologi' },
  { value: 'Sains', label: 'Sains' },
  { value: 'Seni', label: 'Seni' },
  { value: 'Kreativitas', label: 'Kreativitas' },
  { value: 'Bisnis', label: 'Bisnis' },
  { value: 'Sosial', label: 'Sosial' },
  { value: 'Komunikasi', label: 'Komunikasi' },
  { value: 'Alam', label: 'Alam' },
  { value: 'Kesehatan', label: 'Kesehatan' },
  { value: 'Olahraga', label: 'Olahraga' },
];

// Preview records were removed: visitors are never shown fabricated data.
export const INITIAL_EVENTS = [
  {
    id: 1,
    community_id: 1,
    community_name: 'Circle Fotografi',
    title: 'Photowalk & Hunting Golden Hour',
    event_date: '2026-11-05 16:00:00',
    place: 'Taman Rektorat & Selasar Barat',
    description: 'Bawa kamera atau HP kamu, kita hunting cahaya sore bersama kawan baru.',
    attendee_count: 8,
    created_by: 101
  },
  {
    id: 2,
    community_id: 2,
    community_name: 'Circle Musik & Akustik',
    title: 'Acoustic Jamming & Coffee',
    event_date: '2026-11-08 19:00:00',
    place: 'Kantin Pusat Lantai 2',
    description: 'Bawa gitar atau instrumenmu, kita santai akustikan bareng sambil ngopi.',
    attendee_count: 12,
    created_by: 103
  },
  {
    id: 3,
    community_id: 3,
    community_name: 'Circle Desain & UI/UX',
    title: 'Design Review & Portofolio Clinic',
    event_date: '2026-11-12 14:00:00',
    place: 'Co-working Space Perpustakaan',
    description: 'Bedah desain dan studi kasus UI/UX untuk persiapan magang dan portofolio.',
    attendee_count: 15,
    created_by: 105
  }
];

export const INITIAL_PEOPLE = [
  {
    id: 101,
    name: 'Alya Rahma',
    major: 'Desain Komunikasi Visual',
    bio: 'Suka fotografi analog, hunting street photo, dan explore visual poster retro.',
    interests: ['Fotografi', 'Desain', 'Film & Series']
  },
  {
    id: 102,
    name: 'Bima Arya',
    major: 'Teknik Informatika',
    bio: 'Gamer santai, suka mabar Valorant & RPG, serta ngulik UI development.',
    interests: ['Gaming', 'Belajar Bareng', 'Musik']
  },
  {
    id: 103,
    name: 'Nadia Safitri',
    major: 'Ilmu Komunikasi',
    bio: 'Penyuka musik indie lokal, suka ikut kegiatan sosial dan volunteering kampus.',
    interests: ['Musik', 'Volunteer', 'Kuliner']
  },
  {
    id: 104,
    name: 'Dimas Pratama',
    major: 'Manajemen',
    bio: 'Eksplor coffee shop baru dan badminton rutin tiap akhir pekan.',
    interests: ['Olahraga', 'Kuliner', 'Fotografi']
  },
  {
    id: 105,
    name: 'Clara Tan',
    major: 'Arsitektur',
    bio: 'Suka arsitektur kota, bikin sketsa ruang, dan marathon series misteri.',
    interests: ['Desain', 'Film & Series', 'Belajar Bareng']
  }
];
