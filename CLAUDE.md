# KawanKampus

Platform komunitas dan kegiatan mahasiswa berbahasa Indonesia.
Stack: React 19 + Vite + react-router-dom 7 + Firebase (Auth, Firestore, Hosting). Linter: oxlint.

## Perintah
- `npm install`
- `npm run dev` : dev server Vite
- `npm run lint` : wajib bersih sebelum commit
- `npm run build` : wajib sukses sebelum commit
- Tes security rules (emulator saja): `firebase emulators:start --only firestore`, lalu di terminal lain `node .\kawankampus-security-test.mjs`

## Struktur
- `src/pages` : Landing, Login, Signup, Dashboard
- `src/components/tabs` : Home, Communities, Events, Connect, Profile, Verify
- `src/components/cards` : CommunityCard, EventCard, PersonCard
- `src/context` : Auth, Data, Theme
- `src/services/mockData.js` : berisi INTEREST_OPTIONS (dipakai signup/profil) dan data preview untuk pengunjung
- `firestore.rules` : aturan keamanan; koleksi: users, publicProfiles, communities (+members), communityMemberships, events, publicEvents, eventAttendees, connections
- `DESIGN.md`, `docs/` : acuan desain dan spesifikasi
- `TODO.md` : daftar pekerjaan tersisa

## Aturan penting
- Teks UI berbahasa Indonesia. Istilah UI: "Lingkungan" / "Lingkungan Aku" menggantikan "Circle". JANGAN ganti nama koleksi Firestore, field, atau route lama.
- Jangan pakai data mock/fake di tampilan produksi. Selalu sediakan state loading, empty, dan error tanpa record palsu.
- Pertahankan warna brand hijau dan dukungan light/dark mode lewat token tema yang sudah ada; jangan tambah dependency tanpa diminta.
- Pilihan minat resmi: Teknologi, Sains, Seni, Kreativitas, Bisnis, Sosial, Komunikasi, Alam, Kesehatan, Olahraga. Nilai lama yang sudah tersimpan jangan dihapus tanpa rencana migrasi.
- Perubahan UI tidak boleh mengubah logika bisnis, query Firestore, atau rules kecuali task memintanya.

## Git dan keamanan
- Bekerja di feature branch, satu task TODO per branch. Jangan push langsung ke main.
- JANGAN PERNAH menjalankan `firebase deploy`. `.firebaserc` menunjuk project production (`kawan-kampus-venture`).
- Jangan membaca, mencetak, atau commit `.env*`, kunci service account, atau `firebase-export-*`.
- Jangan tambahkan `Co-Authored-By`, `Claude-Session`, atau footer "Generated with Claude Code" di commit maupun PR. Pesan commit ditulis sebagai kontribusi pengguna, format `feat:`, `fix:`, `chore:`, `docs:`.
- Sebelum menyelesaikan task: jalankan lint + build, lalu ringkas file yang berubah.
