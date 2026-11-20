# KawanKampus - Sisa Pekerjaan (20 Nov 2026)

## P0 - Data dan keamanan Firebase
- [ ] Hapus kegiatan palsu dari landing publik; tampilkan event Firestore asli, atau empty state bila kosong.
- [ ] Hapus semua konten mock (event, komunitas, post feed, saran) dari tampilan produksi; pertahankan state loading/empty/error tanpa fallback palsu.
- [ ] Selesaikan validasi Firestore rules: masalah otorisasi membership; cek read/write unauth dan auth untuk communities, posts, memberships; jalankan ulang tes emulator tanpa regresi.

## P1 - Dashboard dan navigasi
- [ ] Hero card: light mode putih, dark mode tetap navy; ganti "Circle" jadi "Lingkungan Aku" (termasuk CTA); teks terbaca di kedua tema.
- [ ] Ganti "Agenda kampus" jadi "Upcoming Kegiatan"; hanya tampilkan event mendatang dari Firestore atau empty state.
- [ ] Hover link "Semua kegiatan" dan "Hapus pencarian": tanpa underline, padding/area klik lebih besar, background rounded halus (hover dan focus).

## P1 - Fitur Lingkungan
- [ ] Halaman diskusi Lingkungan ala Threads, dibuka dari DUA pintu: kartu di Beranda ("Circle kamu" -> "Lingkungan Aku") dan kartu di tab Lingkungan. Harus membawa ID, judul, dan post komunitas yang diklik; jangan buka feed umum atau form buat komunitas. Tombol Gabung/Bergabung tidak boleh memicu navigasi kartu.
- [ ] Layout detail: sidebar KawanKampus tetap; kolom tengah berisi post, info penulis, balasan (data asli per komunitas + empty state).
- [ ] Batasi interaksi: non-member bisa membaca, hanya member yang bisa post/balas. Tampilkan "Kamu belum bergabung di lingkungan ini." + tombol "Gabung sekarang". Validasi juga di Firestore rules.
- [ ] Sidebar rekomendasi kanan: maksimal 2 Lingkungan dan 2 Kegiatan mendatang yang asli, diacak, empty state bila kosong.
- [ ] Pintasan "Lingkungan baru" di kiri bawah: menuju tab Lingkungan dengan form buat komunitas terbuka; perilaku Firestore saat ini tidak berubah.

## P1 - Profil publik mahasiswa
- [ ] Kartu di Teman kampus bisa dibuka ke profil publik; tangani user hilang/terhapus dan pembatasan akses data.
- [ ] Layout profil publik (5 region): avatar, nama lengkap, program studi, bio, minat; daftar Lingkungan dan Kegiatan yang diikuti (scrollable, bisa diklik); input read-only "Message @username" (backend pesan di luar scope).

## P2 - Konsistensi dan rollout
- [ ] Samakan opsi minat di signup, profil, dan filter (10 minat resmi). Hapus kategori lama di profil hanya setelah ada rencana penanganan data tersimpan.
- [ ] Polish layout, responsif, kontras tema, focus state, kontrol navigasi; jangan merusak alur yang sudah jalan.
- [ ] Sinkronkan branch GitHub dan review PR (feature branch, resolve konflik hati-hati).
- [ ] Tes end-to-end dan permission: buat event/komunitas, join, post, profil publik, empty state, persistensi setelah refresh, penolakan write tak sah.
- [ ] Deploy hanya setelah validasi preview: perbaiki lint/build, deploy preview, tes alur utama + dark mode, baru promosikan perubahan yang sudah direview.
