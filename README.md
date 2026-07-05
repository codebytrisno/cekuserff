# FF Checker — Cek Statistik Free Fire Player

Platform pengecekan statistik Free Fire paling cepat, bersih, dan all-in-one. Cukup paste UID, semua data muncul dalam 1 layar — tanpa iklan, tanpa ribet.

![FF Checker](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Fitur Utama

### 🔍 **Instant Search**
- Paste UID, langsung lihat profil player dalam < 3 detik
- Statistik lengkap: K/D, Win Rate, Headshot %, Rank, Guild
- Online status real-time (Online/Offline/In Game)

### ⚔️ **Compare Mode**
- Bandingkan 2 player side-by-side
- Indicator otomatis untuk menunjukkan siapa yang lebih unggul
- Swap player dengan 1 klik

### 📸 **Share Card**
- Export profil player jadi gambar siap share
- Layout clean dengan branding FF Checker
- Share ke WhatsApp, Instagram, atau Twitter

### ⭐ **Bookmark & Tracking**
- Simpan hingga 50 player favorit
- Track perubahan statistik dari waktu ke waktu
- Trend indicator (naik/turun) untuk setiap metric

### 📜 **History**
- Riwayat pengecekan lengkap
- Time-grouped: Hari ini, Kemarin, Minggu ini
- Max 100 entries, auto-cleanup

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Share Card:** html-to-image
- **Storage:** localStorage (no backend for V1)

---

## 📦 Instalasi

### Prerequisites
- Node.js 18+ atau Bun
- npm/yarn/pnpm/bun

### Clone & Install

```bash
# Clone repo
git clone https://github.com/codebytrisno/cekuserff.git
cd cekuserff

# Install dependencies
npm install
# atau
bun install
```

### Jalankan Development Server

```bash
npm run dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Project

```
cekuserff/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home / Search
│   │   ├── player/[id]/       # Player Profile
│   │   ├── compare/           # Compare 2 Players
│   │   ├── bookmarks/         # Bookmarked Players
│   │   ├── history/           # Search History
│   │   ├── settings/          # App Settings
│   │   └── api/player/[uid]/  # API Route (proxy)
│   ├── components/            # React Components
│   │   ├── TopAppBar.tsx     # Navigation bar
│   │   └── BottomNav.tsx     # Mobile bottom nav
│   ├── hooks/                 # Custom React Hooks
│   │   └── usePlayer.ts      # Player data fetching
│   ├── lib/                   # Utilities & Logic
│   │   ├── api.ts            # API client
│   │   ├── store.ts          # Zustand store
│   │   ├── tracker.ts        # Stat tracking logic
│   │   ├── share.ts          # Share card generator
│   │   └── constants.ts      # Constants & config
│   └── types/                 # TypeScript types
│       └── index.ts          # Type definitions
├── design-references/         # Design mockups & references
├── .agents/                   # Project documentation
│   ├── PRD.md                # Product Requirements
│   ├── DESIGN.md             # Design System
│   ├── TECH-SPEC.md          # Technical Specification
│   └── TASKS.md              # Task List
└── public/                    # Static assets
```

---

## 🔌 API & Data Source

FF Checker menggunakan **Free Fire Public API** (third-party/unofficial) untuk mengambil data player.

### Endpoint yang Digunakan:
- `GET /player/{uid}` — Player profile & statistics
- `GET /player/{uid}/status` — Online status

### Rate Limiting:
- Max 30 request per menit per IP
- Response time target < 200ms

> **Note:** API eksternal dapat berubah sewaktu-waktu. Jika API down, app akan menampilkan error state.

---

## 🎨 Design System

### Color Palette (Dark Theme Default)

- **Background:** `#0F0F0F` (Midnight)
- **Surface:** `#1A1A1A` (Card background)
- **Primary:** `#FF6B00` (Orange accent — Free Fire signature color)
- **Secondary:** `#00D9FF` (Cyan — untuk highlight & badges)
- **Text Primary:** `#FFFFFF` (Pure white)
- **Text Secondary:** `#A0A0A0` (Muted gray)
- **Success:** `#00FF88` (Green — untuk stat naik)
- **Danger:** `#FF4444` (Red — untuk stat turun)

### Typography

- **Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont)
- **Headings:** Bold, 24-32px
- **Body:** Regular, 14-16px
- **Caption:** Regular, 12px

---

## 📱 Responsive Design

- **Mobile-first:** Prioritas utama untuk layar < 768px
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

---

## 🚢 Deployment

### Deploy ke Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy ke Netlify

```bash
# Build
npm run build

# Deploy folder out/
netlify deploy --prod --dir=out
```

### Deploy ke Cloudflare Pages

1. Connect GitHub repo ke Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`

---

## 🛠️ Commands

```bash
# Development
npm run dev          # Jalankan dev server
npm run build        # Build production
npm run start        # Jalankan production build
npm run lint         # Lint code dengan ESLint
npm run typecheck    # Type checking dengan TypeScript
```

---

## 📝 Roadmap (V2+)

- [ ] **Multi-language** — Tambah support bahasa Inggris
- [ ] **Cloud Sync** — Sinkronisasi bookmark & history antar device
- [ ] **Backend Server** — Rate limiting & caching server-side
- [ ] **Push Notifications** — Notifikasi real-time untuk player yang di-bookmark
- [ ] **Advanced Analytics** — Grafik performa player dari waktu ke waktu
- [ ] **Guild Leaderboard** — Ranking guild berdasarkan stat agregat

---

## 🤝 Kontribusi

Kontribusi sangat welcome! Silakan:

1. Fork repo ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

Project ini menggunakan **MIT License** — bebas digunakan untuk keperluan personal maupun komersial.

---

## 🙏 Credits

- **Free Fire** — Garena International
- **Icons** — [Lucide Icons](https://lucide.dev)
- **Font** — [Inter](https://rsms.me/inter/)
- **Design Inspiration** — Modern mobile gaming UX patterns

---

## 📧 Kontak

Ada pertanyaan atau feedback? Reach out via:

- **GitHub Issues:** [Report Bug](https://github.com/codebytrisno/cekuserff/issues)
- **Email:** codebytrisno@example.com

---

**Dibuat dengan ❤️ untuk komunitas Free Fire Indonesia**
