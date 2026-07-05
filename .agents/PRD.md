# FF Checker — Product Requirement Document

---

## BAGIAN 1: Visi & Tujuan Produk

### Visi Produk
Menjadi platform pengecekan statistik Free Fire paling cepat, bersih, dan all-in-one — cukup paste UID, semua data muncul dalam 1 layar.

### Tujuan Utama
1. **Cek Instant** — User bisa liat stat player dalam < 3 detik setelah paste UID
2. **Compare Mode** — Bandingin 2 player side-by-side biar tau siapa yang lebih jago
3. **Share Card** — Hasil cek bisa di-export jadi gambar siap share
4. **Tracking** — Bookmark player favorit dan pantau perubahan stat dari waktu ke waktu

### Value Proposition
- All-in-one dashboard: stats, rank, online status, guild, account age dalam 1 screen
- Tanpa iklan — fokus ke kecepatan & user experience
- Fitur unik: Compare & Share Card yang gak ada di competitor

---

## BAGIAN 2: User Persona

### Persona 1: Rendi — Si Tryhard
- **Usia/Pekerjaan:** 19 tahun, Mahasiswa
- **Level Teknis:** Menengah
- **Tujuan:** Mau tau stat lawan sebelum push rank, biar tau lawan itu pro atau noob
- **Pain Points:** Competitor penuh iklan & loading lama, susah bandingin stat 2 player
- **Motivasi:** Biar bisa atur strategi — kalo lawan pro dia main defensif, kalo noob dia agresif

### Persona 2: Vina — Guild Leader
- **Usia/Pekerjaan:** 22 tahun, Freelance Designer
- **Level Teknis:** Pemula
- **Tujuan:** Mau rekrut anggota guild yang beneran jago, bukan cuma pajul level doang
- **Pain Points:** Sulit verifikasi player sebelum invite, sering kena tipu akun palsu
- **Motivasi:** Membangun guild kompetitif dengan anggota berkualitas

---

## BAGIAN 3: User Stories

### Modul 1: Search & Profile
- Sebagai pemain FF, saya ingin paste UID dan langsung liat profil, agar gak perlu buka game
- Sebagai pemain, saya ingin liat K/D, win rate, dan headshot %, agar tau kemampuan player
- Sebagai pemain, saya ingin liat rank dan progress rank, agar tau sejauh mana pencapaiannya
- Sebagai pemain, saya ingin liat online status, agar tau player lagi aktif atau nggak

### Modul 2: Compare
- Sebagai pemain, saya ingin bandingin 2 player secara side-by-side, agar tau siapa yang lebih unggul
- Sebagai pemain, saya ingin liat indicator winner di setiap kategori, agar tau perbedaannya langsung

### Modul 3: Share & Bookmark
- Sebagai pemain, saya ingin share hasil cek ke temen dalam bentuk gambar, agar gak perlu screenshot manual
- Sebagai pemain, saya ingin bookmark player favorit, agar gak perlu search ulang tiap kali
- Sebagai pemain, saya ingin liat perubahan stat dari bookmark, agar tau perkembangan player

### Modul 4: History & Settings
- Sebagai pemain, saya ingin liat riwayat pengecekan, agar bisa balik liat player yang pernah di-search
- Sebagai pemain, saya ingin pilih default server, agar gak perlu ganti server tiap cek
- Sebagai pemain, saya ingin ganti theme dark/light, sesuai preferensi

---

## BAGIAN 4: Functional Requirements

### Modul 1: Search & Profile

**FR-01: Cari Player by UID**
- **Input:** UID (8-12 digit angka)
- **Proses:** Validasi format → fetch API eksternal → parse data
- **Output:** Profile player lengkap
- **Aturan:** Hanya angka, auto-trim spasi, min 8 digit

**FR-02: Tampilkan Player Profile**
- **Input:** Response data player
- **Proses:** Map data ke komponen UI
- **Output:** Avatar, nama, UID, guild, server, online status, stat cards, rank progress, detail stats
- **Aturan:** Skeleton loading selama fetch, error state kalo gagal

**FR-03: Cek Online Status**
- **Input:** UID
- **Proses:** Fetch status endpoint → cek last active
- **Output:** Online/Offline/InGame badge
- **Aturan:** Auto-refresh setiap 30 detik

### Modul 2: Compare

**FR-04: Bandingkan 2 Player**
- **Input:** UID Player A + UID Player B
- **Proses:** Fetch kedua profil → komparasi data
- **Output:** Side-by-side comparison dengan progress bar + winner badge
- **Aturan:** Swap button untuk tukar posisi

### Modul 3: Share & Bookmark

**FR-05: Share Card**
- **Input:** Data player
- **Proses:** Generate gambar dari canvas (html-to-image)
- **Output:** Gambar siap share (PNG)
- **Aturan:** Layout card = nama, UID, avatar, stats, rank, QR code/branding

**FR-06: Bookmark Player**
- **Input:** UID
- **Proses:** Simpan ke localStorage
- **Output:** Icon bookmark terisi, player masuk daftar bookmark
- **Aturan:** Max 50 bookmark, duplicate dicegah

**FR-07: Track Stat Changes**
- **Input:** Bookmarked player data
- **Proses:** Compare data lama vs baru
- **Output:** Trend indicator (naik/turun) + delta value
- **Aturan:** Snapshot disimpan tiap kali buka profile

### Modul 4: History & Settings

**FR-08: Riwayat Pengecekan**
- **Input:** UID yang di-search
- **Proses:** Simpan ke localStorage dengan timestamp
- **Output:** List time-grouped (Hari ini/Kemarin/Minggu ini)
- **Aturan:** Max 100 entries, auto-hapus yang paling lama

**FR-09: Pengaturan Aplikasi**
- **Input:** Preference user
- **Proses:** Simpan ke localStorage
- **Output:** Theme, default server, cache
- **Aturan:** Theme default dark

---

## BAGIAN 5: Non-Functional Requirements

### Performa
- Waktu muat profile < 3 detik (termasuk fetch API eksternal)
- API response internal < 200ms
- First Contentful Paint < 1.5 detik
- Bundle size < 200KB (gzip)

### Keamanan
- Tidak menyimpan password atau data sensitif user
- Input sanitization untuk UID (numeric only)
- Rate limiting: max 30 request per menit per IP
- Tidak ada autentikasi — semua data public read-only

### Skalabilitas
- Target 5.000 user aktif bulanan
- Semua data pake localStorage (no backend for V1)
- Static site / SPA — bisa di-host di CDN manapun
- Siap tambah backend kalo butuh fitur cloud sync nanti

### Usability
- Mobile-first responsive (priority: mobile < tablet < desktop)
- Bahasa Indonesia (default)
- Dark theme sebagai default
- Loading skeleton untuk semua state fetching
- Support semua browser modern (Chrome, Firefox, Safari, Edge)

---

## BAGIAN 6: Out of Scope & Dependensi

### Out of Scope (V1)
- **Login/Autentikasi** — V1 pure public, gak perlu akun
- **Cloud Sync** — Bookmark & history pake localStorage dulu, cloud nanti
- **Backend Server** — V1 langsung fetch dari API eksternal dari client
- **Notifikasi Real-time** — Monitor player online status secara live
- **Multi-language** — Bahasa Indonesia dulu, English next
- **Dalam Game Integration** — Login ke akun Garena, dll

### Dependensi
- **Free Fire Public API** — sumber data utama (third-party / unofficial)
- **html-to-image** (html2canvas + dom-to-image) — buat generate share card
- **Lucide Icons** — icon set
- **Inter Font** — typography
- **Hosting:** Vercel / Netlify / Cloudflare Pages

### Asumsi
- Free Fire API masih available & gratis
- User punya koneksi internet stabil
- User sudah tahu UID player yang mau di-cek
- Data yang ditampilkan sesuai data publik dari API
