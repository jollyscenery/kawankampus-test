# Kawan Kampus (Web)

**Platform komunitas mahasiswa untuk membangun koneksi, menemukan minat yang sejalan, dan berpartisipasi dalam kegiatan kampus.**

Kawan Kampus adalah aplikasi web berbasis **React** dan **Vite** yang dirancang untuk membantu mahasiswa menemukan teman, bergabung dengan komunitas (circle), dan mengikuti kegiatan kampus berdasarkan minat serta preferensi aktivitas sosial. Aplikasi ini terintegrasi dengan **Firebase Authentication** untuk manajemen akun yang aman dan **Firestore** untuk sinkronisasi data profil pengguna.

> **Status Proyek:** Fase pengembangan dan prototype interaktif aktif (_Venture Creation_).

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Instalasi & Menjalankan](#panduan-instalasi--menjalankan)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependensi](#2-install-dependensi)
  - [3. Konfigurasi Environment (`.env`)](#3-konfigurasi-environment-env)
  - [4. Konfigurasi Firebase Console](#4-konfigurasi-firebase-console)
  - [5. Menjalankan Server Pengembangan](#5-menjalankan-server-pengembangan)
- [Perintah yang Tersedia (NPM Scripts)](#perintah-yang-tersedia-npm-scripts)
- [Variabel Lingkungan (`.env`)](#variabel-lingkungan-env)
- [Alur Penggunaan Aplikasi](#alur-penggunaan-aplikasi)
- [Rekomendasi Pengembangan Selanjutnya](#rekomendasi-pengembangan-selanjutnya)

---

## Fitur Utama

- **Autentikasi Firebase:** Pendaftaran akun baru, login, dan logout menggunakan **Firebase Authentication** dengan penanganan sesi otomatis (_persistent session_).
- **Onboarding Minat & Gaya Aktivitas:** Pemilihan 2–4 minat utama (_Fotografi, Musik, Desain, Gaming, Volunteer, dsb._) serta kustomisasi gaya interaksi (gaya sosial, gaya jadwal, dan tingkat keaktifan kegiatan).
- **Beranda & Rekomendasi Personal:** Ringkasan statistik komunitas diikuti, agenda kegiatan mendatang, dan kartu circle terdekat.
- **Komunitas (Circle):** Menjelajahi ruang komunitas kampus, filter pencarian instan (_live search_), bergabung ke circle, dan membuat komunitas baru.
- **Kegiatan Kampus (Events):** Melihat agenda kegiatan mendatang, detail tanggal/tempat, konfirmasi kehadiran (RSVP), serta publikasi kegiatan bagi anggota komunitas.
- **Connect:** Menemukan rekan mahasiswa dengan minat yang sejalan serta alur kirim dan terima permintaan koneksi pertemanan.
- **Profil Mahasiswa:** Pengelolaan informasi pribadi, NIM, program studi, bio singkat, preferensi minat, dan slider gaya interaksi sosial.
- **Mode Gelap & Terang (Theme Toggle):** Antarmuka responsif dengan dukungan tema terang dan gelap yang tersimpan di `localStorage`.

---

## Teknologi

- **Library & Framework:** [React 19](https://react.dev/)
- **Build Tool & Dev Server:** [Vite 8](https://vite.dev/)
- **BaaS & Autentikasi:** [Firebase](https://firebase.google.com/) (Firebase Auth & Firestore Database)
- **Styling:** Vanilla CSS Modern dengan CSS Custom Properties (Design Tokens), Typography _DM Sans_ & _Manrope_, serta Responsive Grid/Flexbox
- **Linter & Code Quality:** [Oxlint](https://oxc.rs/)

---

## Struktur Proyek

```text
KawanKampus-web/
├── public/
│   ├── favicon.svg
│   └── logo-kawan-kampus.png
├── src/
│   ├── assets/
│   │   └── logo-kawan-kampus.png       # Aset logo brand
│   ├── components/
│   │   ├── cards/
│   │   │   ├── CommunityCard.jsx       # Kartu komunitas & aksi gabung
│   │   │   ├── EventCard.jsx           # Kartu agenda & RSVP
│   │   │   └── PersonCard.jsx          # Kartu profil kawan & koneksi
│   │   ├── common/
│   │   │   ├── ThemeToggle.jsx         # Tombol ganti tema gelap/terang
│   │   │   └── Toast.jsx               # Notifikasi toast mengambang
│   │   ├── dashboard/
│   │   │   ├── Header.jsx              # Header dashboard & status user
│   │   │   └── Sidebar.jsx             # Navigasi desktop & bottom bar mobile
│   │   └── tabs/
│   │       ├── CommunitiesTab.jsx      # Tab eksplorasi & buat komunitas
│   │       ├── ConnectTab.jsx          # Tab pencarian teman & connect
│   │       ├── EventsTab.jsx           # Tab kalender & buat kegiatan
│   │       ├── HomeTab.jsx             # Tab beranda ringkasan
│   │       ├── ProfileTab.jsx          # Tab edit profil & preferensi
│   │       └── VerifyTab.jsx           # Tab edukasi verifikasi kampus
│   ├── context/
│   │   ├── AuthContext.jsx             # State autentikasi Firebase & profil
│   │   ├── DataContext.jsx             # State komunitas, event, & koneksi
│   │   └── ThemeContext.jsx            # State tema gelap/terang & sync html
│   ├── pages/
│   │   ├── DashboardPage.jsx           # Layout utama dashboard
│   │   ├── LandingPage.jsx             # Halaman utama landing Kawan Kampus
│   │   ├── LoginPage.jsx               # Halaman masuk akun
│   │   └── SignupPage.jsx              # Halaman pendaftaran & minat
│   ├── services/
│   │   └── mockData.js                 # Dataset awal (komunitas & agenda demo)
│   ├── App.css
│   ├── App.jsx                         # Root routing & provider wrapper
│   ├── firebase.js                     # Konfigurasi & inisialisasi Firebase SDK
│   ├── index.css                       # Desain sistem global, token, & media queries
│   └── main.jsx                        # Entry point React DOM
├── .env.example                        # Template variabel lingkungan
├── .gitignore
├── index.html                          # Template HTML utama
├── package.json
└── README.md
```

---

## Persyaratan Sistem

Pastikan perangkat Anda telah terpasang:

- **Node.js:** Versi **18.x** atau **20.x+** (LTS direkomendasikan).
- **NPM:** Versi **9.x+** (terpasang otomatis bersama Node.js).
- **Web Browser Modern:** Chrome, Edge, Safari, atau Firefox versi terbaru.
- **Koneksi Internet:** Untuk mengunduh paket dependensi dan terhubung ke layanan Firebase.

---

## Panduan Instalasi & Menjalankan

Ikuti langkah-langkah di bawah untuk menjalankan proyek di komputer lokal:

### 1. Clone Repository

Buka terminal/shell dan clone repository ini ke folder lokal Anda:

```bash
git clone https://github.com/knaamrb/KawanKampus-repo.git
cd KawanKampus-web
```

### 2. Install Dependensi

Jalankan perintah berikut untuk mengunduh semua library yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)

Salin file template `.env.example` menjadi `.env`:

```bash
# Pada Windows PowerShell
Copy-Item .env.example .env

# Pada Linux / macOS
cp .env.example .env
```

Buka file `.env` di text editor Anda, lalu masukkan kredensial Firebase project Anda



### 4. Konfigurasi Firebase Console

Agar fitur pendaftaran dan masuk dapat bekerja dengan baik:

1. Kunjungi [Firebase Console](https://console.firebase.google.com/) dan pilih project Anda.
2. Buka menu **Build** > **Authentication**.
3. Pilih tab **Sign-in method**, klik **Email/Password**, lalu aktifkan (**Enable**) opsi tersebut dan simpan (**Save**).
4. (Opsional) Buka menu **Firestore Database** dan buat database dalam mode _test mode_ jika Anda ingin data profil tersinkronisasi lintas perangkat.

### 5. Menjalankan Server Pengembangan

Mulai server lokal Vite dengan perintah:

```bash
npm run dev
```

Terminal akan menampilkan tautan lokal, biasanya:

```text
  VITE v8.3.4  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Buka `http://localhost:5173/` pada browser Anda.

---

## Perintah yang Tersedia (NPM Scripts)

| Perintah          | Deskripsi                                                                      |
| :---------------- | :----------------------------------------------------------------------------- |
| `npm run dev`     | Menjalankan local development server Vite dengan Hot Module Replacement (HMR). |
| `npm run build`   | Melakukan kompilasi dan optimasi bundle production ke dalam folder `dist/`.    |
| `npm run preview` | Menjalankan preview lokal dari bundle hasil build production (`dist/`).        |
| `npm run lint`    | Menjalankan pemeriksaan kode cepat menggunakan Oxlint.                         |

---

## Variabel Lingkungan (`.env`)

Semua variabel lingkungan di Vite yang diakses pada sisi klien harus menggunakan prefix `VITE_`:

| Variabel                            | Keterangan                                |
| :---------------------------------- | :---------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Web API Key dari project Firebase         |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Domain autentikasi Firebase               |
| `VITE_FIREBASE_PROJECT_ID`          | ID project Firebase                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | URL bucket cloud storage Firebase         |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID untuk Google Cloud Messaging    |
| `VITE_FIREBASE_APP_ID`              | ID aplikasi Web Firebase                  |
| `VITE_FIREBASE_MEASUREMENT_ID`      | ID pengukuran Google Analytics (opsional) |

---

## Alur Penggunaan Aplikasi

1. **Halaman Utama (Landing Page):**
   - Menjelaskan nilai produk Kawan Kampus, alur kerja (01 Ceritakan dirimu, 02 Temukan kecocokan, 03 Mulai beraktivitas), fitur platform, serta tombol CTA pendaftaran.
2. **Pendaftaran (Signup):**
   - Mahasiswa mengisi nama lengkap, NIM, email, program studi, kata sandi (minimal 8 karakter), bio, memilih 2–4 minat, dan mengatur slider gaya interaksi sosial.
   - Akun dibuat di Firebase Authentication dan secara otomatis bergabung ke komunitas pertama yang sesuai dengan minat utama.
3. **Masuk (Login):**
   - Masuk menggunakan email dan kata sandi yang telah didaftarkan.
4. **Dashboard Mahasiswa:**
   - **Beranda:** Menampilkan salam sapa personal, metrik circle, rekomendasi ruang komunitas, dan kegiatan terdekat.
   - **Profil saya:** Menampilkan kartu ringkasan kawan serta form edit data diri dan preferensi sosial.
   - **Komunitas:** Pencarian komunitas berdasarkan nama atau tag minat, tombol bergabung, serta formulir pembuatan komunitas baru.
   - **Kegiatan:** Kalender agenda mahasiswa, filter pencarian, RSVP kegiatan, dan pembuatan acara gathering baru.
   - **Connect:** Eksplorasi mahasiswa lain yang berada dalam satu ekosistem minat dengan aksi kirim atau terima pertemanan.
   - **Verifikasi:** Informasi kebijakan keamanan komunitas dan mekanisme validasi mahasiswa kampus.

---

## Rekomendasi Pengembangan Selanjutnya

- [ ] **Email Domain Kampus (.ac.id):** Pembatasan pendaftaran otomatis khusus domain email institusi universitas.
- [ ] **Chat & Pesan Instan:** Fitur percakapan dua arah setelah kedua mahasiswa menyetujui permintaan koneksi.
- [ ] **Push Notification:** Pengingat otomatis untuk agenda kegiatan yang telah di-RSVP.
- [ ] **Moderasi & Pelaporan:** Mekanisme tombol lapor dan blokir untuk menjaga kenyamanan komunitas kampus.

---

**Kawan Kampus — Teman tumbuh, teman kampus.**
