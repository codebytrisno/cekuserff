# FF Checker — Technical Specification

---

## BAGIAN 1: Tech Stack & Arsitektur

### Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| State | Zustand + localStorage | 5.x |
| Icons | Lucide React | latest |
| Font | Inter (next/font) | - |
| Image Export | html-to-image | latest |
| Database | localStorage (V1 — no backend) | - |
| Hosting | Vercel | - |

### Arsitektur Sistem

```
User → Browser → Next.js (Static SPA)
                    ↓
              localStorage (Bookmark, History, Theme)
                    ↓
           Free Fire Public API (eksternal, dari client)
```

**V1 = Frontend-only.** Semua state & persistensi di client. Fetch data langsung dari Free Fire API.

### Struktur Folder
```
src/
├── app/
│   ├── page.tsx              # Home / Search
│   ├── layout.tsx            # Root layout + font + metadata
│   └── player/
│       └── [id]/
│           └── page.tsx      # Player Profile
├── components/
│   ├── ui/                   # Atom components
│   │   ├── Button.tsx
│   │   ├── SearchInput.tsx
│   │   ├── StatCard.tsx
│   │   ├── OnlineBadge.tsx
│   │   └── RankProgress.tsx
│   ├── PlayerCard.tsx        # Molecule
│   ├── CompareRow.tsx
│   ├── ShareCard.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── api.ts                # Free Fire API fetcher
│   ├── store.ts              # Zustand store (bookmark, history, theme)
│   ├── utils.ts              # Formatter, validasi UID
│   └── constants.ts          # Colors, breakpoints, dll
├── hooks/
│   ├── usePlayer.ts          # Fetch player data
│   └── useOnlineStatus.ts    # Online status polling
└── types/
    └── index.ts              # TypeScript interfaces
```

### Justifikasi
- **Next.js 16:** App Router, image optimization, deploy seamless ke Vercel
- **Tailwind CSS:** Design system dari DESIGN.md gampang diimplement sebagai utility classes
- **Zustand:** Ringan (< 1KB), gak perlu boilerplate, support persist middleware buat localStorage
- **Vercel:** Zero-config deploy, gratis, support static export

---

## BAGIAN 2: Database Design

### Ringkasan Database
| Item | Detail |
|------|--------|
| Database | localStorage (browser) |
| Driver | Zustand persist middleware |
| Pendekatan | Key-Value (JSON) |
| Tools Migrasi | Zustand version migration |

### Entity Overview

| Entity | Key | Key Fields | Notes |
|--------|-----|-----------|-------|
| **Bookmark** | `uid` | uid, name, level, rank, kd, headshot, guild, avatar, addedAt, lastCheckedAt, snapshots[] | Max 50 |
| **History** | `uid` | uid, name, level, checkedAt | Max 100 |
| **Settings** | `-` | theme, defaultServer | Singleton |
| **Snapshot** | Nested | uid, kd, rank, points, headshot, recordedAt | Array di Bookmark |

### Data Flow

```
User search UID → Zustand store → localStorage (history)
User bookmark   → Zustand persist → localStorage (bookmarks)
User ganti theme → Zustand persist → localStorage (settings)
```

### Zustand Store Structure
```typescript
interface Store {
  bookmarks: Bookmark[]
  history: HistoryItem[]
  settings: Settings
  addBookmark: (player: PlayerData) => void
  removeBookmark: (uid: string) => void
  addHistory: (player: PlayerData) => void
  clearHistory: () => void
  updateSettings: (partial: Partial<Settings>) => void
}
```

---

## BAGIAN 3: Interface Design

### Routes (Next.js App Router)

| Route | Page | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Home / Search — input UID + quick actions + recent |
| `/player/[id]` | `player/[id]/page.tsx` | Player Profile — stat, rank, online status, bookmark |
| `/compare` | `compare/page.tsx` | Compare 2 player side-by-side |
| `/bookmarks` | `bookmarks/page.tsx` | Daftar bookmark + search + tracking |
| `/history` | `history/page.tsx` | Riwayat pengecekan |
| `/settings` | `settings/page.tsx` | Theme, server, cache |

### Client Components Tree
```
<Layout>
  <BottomNav />                    // Persisten di semua page
  {children}
    ├─ <HomePage>
    │    ├─ <Logo />
    │    ├─ <SearchInput />        // Input UID + Cari button
    │    ├─ <QuickActions />       // Shortcut ke Compare/Bookmark/History
    │    └─ <RecentList>
    │         └─ <PlayerCard />    // Compact variant
    │
    ├─ <PlayerProfilePage>
    │    ├─ <ProfileHeader />      // Avatar + name + UID + guild
    │    ├─ <OnlineBadge />        // Online/Offline status
    │    ├─ <StatsRow>
    │    │    └─ <StatCard />      // K/D, Wins, HS%
    │    ├─ <RankProgress />
    │    ├─ <DetailStats />        // Matches, top 10, win rate, age
    │    └─ <ActionButtons />      // Compare + Share
    │
    ├─ <ComparePage>
    │    ├─ <CompareInput />       // Dual UID + VS
    │    ├─ <CompareStatRow />     // Baris per stat + progress bar
    │    └─ <ResultSummary />      // Winner announcement
    │
    ├─ <BookmarksPage>
    │    ├─ <SearchInput />        // Filter bookmark
    │    └─ <PlayerCard />         // Default variant + trend indicator
    │
    ├─ <HistoryPage>
    │    └─ <HistoryList />        // Time-grouped
    │
    └─ <SettingsPage>
         └─ <SettingsForm />
</Layout>
```

### Color Tokens (Tailwind Config)
```typescript
colors: {
  primary: '#FF6B35',
  'primary-hover': '#E55A2B',
  secondary: '#FF3366',
  surface: '#1A1A2E',
  background: '#0F0F1A',
  'text-primary': '#FFFFFF',
  'text-secondary': '#B0B0C0',
  success: '#00D68F',
  error: '#FF3D3D',
  border: '#2A2A3E',
}
```

---

## BAGIAN 4: Alur Logika & Business Rules

### Alur Cek Player
1. User paste UID (8-12 digit angka) di SearchInput
2. Validasi client-side: numeric only, length 8-12
3. Zustand set `loading: true` → UI tampil skeleton
4. `usePlayer` hook: fetch dari Free Fire API eksternal
5. **Success:** Map data ke komponen → navigate ke `/player/[id]`
6. **Error:** Tampilkan error state + retry button
7. Tambahkan ke history (Zustand → localStorage)

### Alur Compare
1. User masuk halaman `/compare`
2. Input UID Player A + Player B
3. Tap "Bandingkan" → fetch kedua player paralel (`Promise.all`)
4. Skeleton loading untuk kedua sisi
5. Data termuat → render CompareStatRow per kategori
6. Setiap kategori: bandingin nilai → winner badge di sisi unggul
7. ResultSummary: hitung total kemenangan per player

### Alur Bookmark
1. Di Player Profile → tap icon bookmark ⭐
2. Zustand `addBookmark()` → simpan data + snapshot pertama
3. Icon berubah jadi filled ⭐
4. Di Bookmarks page: render semua bookmark, masing-masing ada trend indicator
5. Tap bookmark → navigate ke `/player/[id]`
6. Tiap buka profile bookmark: auto-refresh + simpan snapshot baru
7. Bandingkan snapshot terakhir vs baru → arrow naik/turun + delta

### Alur Share Card
1. Tap "Share" di Player Profile
2. Render komponen `ShareCard` (hidden, off-screen)
3. `html-to-image` convert ke PNG blob
4. Native Web Share API (`navigator.share`) atau fallback copy to clipboard
5. Card layout: avatar, name, UID, K/D, HS%, rank, guild, branding "FF Checker"

### Business Rules
- UID hanya angka 8-12 digit, auto-trim spasi
- Max 50 bookmark, duplicate dicegah (cek uid)
- Max 100 history entries, auto-hapus oldest
- Online status auto-refresh tiap 30 detik (optional, pake polling)
- Theme default: dark
- Default server: Indonesia
- Rate limit: max 30 request/menit per IP (dari client)

---

## BAGIAN 5: Keamanan, Performa, & Deployment

### Keamanan
- **No backend V1** — semua di client, gak ada data sensitif disimpan
- **Input sanitization** — UID di-filter numeric only, regex `/^\d{8,12}$/`
- **CORS** — Free Fire API eksternal, request dari browser via fetch langsung
- **localStorage** — hanya nyimpen UID, nama, & stat publik (no password/email)

### Performa
- **Static Generation** — Next.js static export, build sekali, serve dari CDN
- **Image Optimization** — next/font + next/image buat Inter font & avatar
- **Bundle splitting** — dynamic import buat `html-to-image` (cuma dipake di share)
- **Skeleton loading** — semua komponen punya loading state biar gak ada layout shift
- **localStorage sync** — Zustand persist middleware, baca/tulis async biar gak blocking

### Deployment (Vercel)
1. Push ke GitHub
2. Import repo ke Vercel
3. Vercel auto-detect Next.js → build `npm run build`
4. Deploy ke `*.vercel.app` (atau custom domain)
5. Auto-deploy tiap push ke main branch

### Development Setup
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Static export
npm run lint         # ESLint
```

**Catatan:** V1 pure frontend — cukup `npm install && npm run dev` udah bisa jalan.
