# CEKUSERFF — Cek Statistik Free Fire Player

Platform pengecekan statistik Free Fire paling cepat, berani, dan berani tampil beda. Cukup paste UID, semua data muncul instan — tanpa login, tanpa iklan, tanpa ribet. 100% gratis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Fitur Utama

### 🔍 **Instant Search**
- Paste UID, langsung lihat profil player dalam < 3 detik
- Statistik lengkap: K/D, Win Rate, Headshot %, Rank, Guild, dan 30+ data lainnya
- Data langsung dari server Garena via Protobuf

### ⚔️ **Compare Mode**
- Bandingkan 2 player side-by-side dengan 5 kategori statistik
- Indicator otomatis trophy untuk player yang lebih unggul
- Swap player dengan 1 klik

### 📸 **Share Card**
- Export profil player jadi gambar (1080x1920) siap share
- Layout clean dengan branding CEKUSERFF
- Share ke WhatsApp, Instagram, atau Twitter

### ⭐ **Bookmark & Tracking**
- Simpan hingga 50 player favorit
- Track perubahan statistik dari waktu ke waktu
- Trend indicator (naik/turun) untuk setiap metric

### 📜 **History**
- Riwayat pengecekan lengkap dengan time-grouping
- Hari ini, Kemarin, Minggu ini, Lainnya
- Max 100 entries, auto-cleanup

### ⚙️ **Settings**
- Toggle tema (Light/Dark/System)
- Pilih server default
- Kelola cache & penyimpanan

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **UI** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs) (localStorage) |
| **API** | [`@arbakti_store/freefire-api`](https://www.npmjs.com/package/@arbakti_store/freefire-api) (Garena Protobuf) |
| **Icons** | Material Symbols Outlined |
| **Fonts** | Outfit (Headings) · DM Sans (Body) · Bangers (Display) |
| **Share Card** | Canvas API (native) |

---

## 🎨 Design System — Maximalism

Desain bold, loud, dan penuh energi. Bukan minimalis — ini maximalism.

### Color Palette

| Token | Hex | Kegunaan |
|-------|-----|----------|
| **Accent (Magenta)** | `#FF3AF2` | Primary actions, borders, glow |
| **Secondary (Cyan)** | `#00F5D4` | Success states, secondary highlights |
| **Tertiary (Yellow)** | `#FFE600` | Warnings, trophies, shadows |
| **Quaternary (Orange)** | `#FF6B35` | BR stats, energy |
| **Quinary (Purple)** | `#7B2FFF` | Deep accents, gradients |
| **Background** | `#0D0D1A` | Cosmic black |
| **Surface** | `#150F28` | Card backgrounds |
| **Surface Card** | `rgba(45, 27, 78, 0.6)` | Glassmorphism cards |

### Design Language
- **Borders:** 4px solid, multi-colored offset shadows (`8px 8px 0`, `16px 16px 0`)
- **Cards:** Glassmorphism + pattern overlays (dots, stripes, checker, mesh)
- **Buttons:** Gradient backgrounds, thick borders, offset box-shadows
- **Text:** Triple text-shadows, gradient fills, neon glow effects
- **Layout:** Asymmetric rotations (`rotate-1`, `-rotate-1`), bento grids

### Animations (30+ CSS keyframes)
- **Entrance:** `slide-up-fade`, `card-entrance`, `elastic-in`, `stagger-fade`
- **Ambient:** `float`, `glow-breath`, `neon-flicker`, `morph-shape`
- **Interactive:** `tilt-3d`, `scale-bounce`, `ripple-out`, `shimmer-border`
- **Loading:** `dotPulse`, `barSlide`, `particle-float`, `pulse-ring`
- **Decorative:** `gradient-shift`, `mega-glow`, `border-dance`, `spin-slow`

---

## 📦 Instalasi

### Prerequisites
- Node.js 18+ atau Bun

### Quick Start

```bash
# Clone repo
git clone https://github.com/codebytrisno/cekuserff.git
cd cekuserff

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 📁 Struktur Project

```
cekuserff/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # Home — Search + Dashboard
│   │   ├── layout.tsx             # Root layout (fonts)
│   │   ├── globals.css            # Maximalism design tokens & animations
│   │   ├── player/[id]/page.tsx   # Player Profile + Share Card
│   │   ├── compare/page.tsx       # Compare 2 Players
│   │   ├── bookmarks/page.tsx     # Bookmarks + History tabs
│   │   ├── history/page.tsx       # Redirects to bookmarks?tab=history
│   │   ├── settings/page.tsx      # Theme, Server, Cache settings
│   │   └── api/player/[uid]/      # API Route → Garena Protobuf
│   ├── components/
│   │   ├── BottomNav.tsx          # Mobile bottom navigation
│   │   ├── FloatingDecorations.tsx # Animated emoji + orbs background
│   │   ├── PlayerProfileView.tsx  # Full profile display component
│   │   ├── Providers.tsx          # Global patterns + decorations
│   │   ├── Toast.tsx              # Toast notification system
│   │   ├── ToastWrapper.tsx       # Toast container
│   │   └── TopAppBar.tsx          # Top navigation (back, bookmark, share)
│   ├── hooks/
│   │   └── usePlayer.ts           # Player data fetching hook
│   ├── lib/
│   │   ├── api.ts                 # Legacy API client
│   │   ├── ff-api.ts              # Garena Protobuf wrapper
│   │   ├── store.ts               # Zustand store (localStorage)
│   │   ├── constants.ts           # UID rules, servers, ranks
│   │   ├── share.ts               # Share card helper
│   │   └── tracker.ts             # Stat tracking logic
│   └── types/
│       └── index.ts               # PlayerData, Bookmark, etc.
├── design-references/              # Design mockups
├── .agents/                        # Project docs (PRD, DESIGN, etc.)
├── public/                         # Static assets
├── next.config.ts                  # serverExternalPackages config
├── tailwind.config.ts              # Tailwind v4 config
└── package.json
```

---

## 🔌 API & Data Source

### Direct Garena Connection

CEKUSERFF menggunakan [`@arbakti_store/freefire-api`](https://www.npmjs.com/package/@arbakti_store/freefire-api) — library npm yang berkomunikasi langsung dengan server Garena menggunakan **Protobuf**.

- **Tidak perlu API key** — menggunakan guest credentials bawaan
- **Tidak perlu database** — semua data dari Garena langsung
- **Response time:** ~1-3 detik tergantung server Garena

### Data yang Diambil
- Profil player (nama, level, EXP, guild, signature)
- Statistik BR (matches, wins, kills, headshots, damage, dll)
- Statistik Clash Squad (matches, wins, kills)
- Rank & tier information
- Status akun (online, in-game, banned)
- Equipment (weapon skins, outfit, skills, pet)
- Detail akun (usia, created date, season, credit score)

### Known Limitations
- Rank points selalu 0 (protobuf schema mismatch di library)
- Badges & title selalu 0 (reason yang sama)

---

## 📱 Responsive Design

- **Mobile-first** — dirancang untuk layar < 768px
- **Breakpoints:** Mobile (< 640px) · Tablet (640-1024px) · Desktop (> 1024px)
- **Bottom Navigation** untuk mobile, full layout untuk desktop

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify / Cloudflare Pages

```bash
npm run build
# Deploy folder .next/ atau out/
```

---

## 🛠️ Commands

```bash
npm run dev          # Jalankan dev server (Turbopack)
npm run build        # Build production
npm run start        # Jalankan production build
npm run lint         # ESLint
```

---

## 📝 Roadmap

- [ ] Multi-language (English support)
- [ ] Cloud Sync bookmark & history
- [ ] Push notifications untuk player yang di-bookmark
- [ ] Grafik performa player dari waktu ke waktu
- [ ] Guild leaderboard

---

## 🤝 Kontribusi

1. Fork repo ini
2. Buat branch baru (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

---

## 📄 License

MIT License — bebas digunakan untuk keperluan personal maupun komersial.

---

## 🙏 Credits

- **Free Fire** — Garena International
- **API Library** — [`@arbakti_store/freefire-api`](https://www.npmjs.com/package/@arbakti_store/freefire-api)
- **Icons** — [Material Symbols](https://fonts.google.com/icons)
- **Fonts** — [Outfit](https://fonts.google.com/specimen/Outfit) · [DM Sans](https://fonts.google.com/specimen/DM+Sans) · [Bangers](https://fonts.google.com/specimen/Bangers)
- **Design Inspiration** — Maximalism, brutalism, gaming UX

---

## 📧 Kontak

- **GitHub Issues:** [Report Bug](https://github.com/codebytrisno/cekuserff/issues)
- **Developer:** [codebytrisno.vercel.app](https://codebytrisno.vercel.app/)

---

**Dibuat dengan ❤️ untuk komunitas Free Fire Indonesia**
