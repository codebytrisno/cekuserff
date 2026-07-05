# FF Checker — UI/UX Design Spec

---

## DESIGN SYSTEM

### Design Style
- **Style:** Modern & Clean — Dark gaming aesthetic
- **Platform:** Mobile-first
- **Mode:** Dark (primary)
- **Unique Value Proposition:** FF Checker — All-in-one dashboard dengan share card, compare mode, dan tracking statistik player

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#FF6B35` | Brand accent, main CTA |
| `--color-primary-hover` | `#E55A2B` | Hover state primary |
| `--color-secondary` | `#FF3366` | Secondary actions, badges |
| `--color-surface` | `#1A1A2E` | Card/container bg |
| `--color-background` | `#0F0F1A` | Page background |
| `--color-text-primary` | `#FFFFFF` | Main text |
| `--color-text-secondary` | `#B0B0C0` | Muted text |
| `--color-error` | `#FF3D3D` | Error state |
| `--color-success` | `#00D68F` | Success state, online |
| `--color-border` | `#2A2A3E` | Dividers, borders |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| Font Family | Inter | Clean, modern, highly readable |
| `--font-h1` | 24px / 700 / 1.2 | Page title |
| `--font-h2` | 20px / 600 / 1.3 | Section title |
| `--font-h3` | 16px / 600 / 1.4 | Card title |
| `--font-body` | 14px / 400 / 1.5 | Body text |
| `--font-caption` | 12px / 400 / 1.4 | Labels, helper text |
| `--font-button` | 14px / 600 / 1 | Button text |
| `--font-stat` | 28px / 700 / 1 | Stat numbers (K/D, HS%) |

### Spacing (4px Grid)

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Input fields |
| `--radius-md` | 12px | Cards |
| `--radius-lg` | 20px | Modals |
| `--radius-full` | 999px | Chips, avatars |

### Elevation / Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Cards raised |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Dropdown |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Modal |

### Icon Style
- **Style:** Outline (Lucide icons)
- **Size:** 20px default, 24px for nav
- **Color:** Inherits text color

---

## SCREEN MAP & USER FLOW

### Screen Inventory

| # | Screen | Route | Module |
|---|--------|-------|--------|
| 1 | **Home / Search** | `/` | Search |
| 2 | **Player Profile** | `/player/:id` | Profile |
| 3 | **Compare** | `/compare` | Compare |
| 4 | **Bookmarks** | `/bookmarks` | Tracking |
| 5 | **History** | `/history` | Tracking |
| 6 | **Settings** | `/settings` | App |

### User Flow Diagram

```
[Home/Search] ──→ [Player Profile]
     │                    │
     │                    ├──→ [Compare] ←── [Pilih Player 2]
     │                    │
     │                    └──→ [Share Card] (external)
     │
     ├──→ [Bookmarks]
     ├──→ [History]
     └──→ [Settings]
```

### Main Flows

**Flow 1: Cek Player**
1. Home → paste UID di search bar
2. Tap "Cari" → loading skeleton
3. Player Profile muncul: stats, rank, guild, online status
4. Tap "Share" → generate card → share ke WA/Telegram

**Flow 2: Compare 2 Player**
1. Home → tap icon compare
2. Masukkan Player A UID → masukkan Player B UID
3. Tap "Bandingkan" → side-by-side stats
4. Swipe untuk liat perbedaan tiap stat

**Flow 3: Bookmark & Track**
1. Player Profile → tap bookmark icon
2. Bookmark tersimpan di `/bookmarks`
3. Tiap buka bookmark, stat otomatis refresh
4. Liat perubahan K/D, rank dari waktu ke waktu

### Bottom Navigation (Mobile)

| Tab | Icon | Route |
|-----|------|-------|
| Cari | 🔍 | `/` |
| Compare | ⚔️ | `/compare` |
| Bookmark | ⭐ | `/bookmarks` |
| History | 📋 | `/history` |

---

## PER-SCREEN DESIGN

### Screen [01]: Home / Search

**Purpose:** Halaman utama untuk mencari player Free Fire by UID
**UVP Highlight:** First impression — bersih, cepat, fokus ke search aja tanpa noise iklan

**Route:** `/`
**Access:** Public

#### Layout Structure
```
┌──────────────────────────────┐
│  Status Bar                   │
├──────────────────────────────┤
│  Logo "FF Checker"           │
│  [Tagline: Cek stat siapapun] │
│                              │
│  ┌────────────────────────┐  │
│  │ 🔍  Masukkan UID...   │  │
│  │         [Cari]         │  │
│  └────────────────────────┘  │
│                              │
│  [Quick Actions]             │
│  ┌────┐ ┌────┐ ┌────────┐  │
│  │⚔️  │ │⭐  │ │📋     │  │
│  │Cmpr│ │Bkmk│ │History │  │
│  └────┘ └────┘ └────────┘  │
│                              │
│  [Recent Searches]           │
│  • Player A — Lv 75          │
│  • Player B — Lv 62          │
│                              │
├──────────────────────────────┤
│  [Bottom Nav]                │
└──────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| SearchInput | Center | Input UID + Cari button |
| QuickActionCard | Below | Shortcut ke Compare/Bookmark/History |
| RecentSearchItem | History | Recent UIDs dengan nama & level |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Search input + quick actions + recent | Normal state |
| **Empty** | Ilustrasi + "Mulai cari player FF" | No recent searches |
| **Loading** | Skeleton di results | Searching... |
| **Error** | "UID tidak ditemukan" + retry | Invalid UID / API error |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|---------|
| Search Input | Focus | Input glow border orange |
| Cari Button | Tap | Navigate ke `/player/:id` |
| Recent Item | Tap | Instant navigate to profile |
| Quick Action Card | Tap | Navigate ke screen tujuan |

---

### Screen [02]: Player Profile

**Purpose:** Menampilkan semua detail player Free Fire berdasarkan UID
**UVP Highlight:** All-in-one dashboard — semua info dalam 1 layar, langsung bisa share & bookmark

**Route:** `/player/:id`
**Access:** Public

#### Layout Structure
```
┌──────────────────────────────┐
│  ← Back          [⭐] [📤]   │
├──────────────────────────────┤
│  [Online Status Badge]       │
│  ┌──────┐                    │
│  │ Avatar│  Player Name      │
│  │       │  UID: 123456789   │
│  └──────┘  Guild: [name]     │
│            Server: Indonesia  │
├──────────────────────────────┤
│  [Stats Row]                 │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │ K/D│ │ ⚔️  │ │ 🎯  │      │
│  │2.54│ │1.234│ │38%  │      │
│  │K/D │ │Wins │ │HS%  │      │
│  └────┘ └────┘ └────┘      │
├──────────────────────────────┤
│  [Rank Card]                 │
│  [Heroic Icon] Heroic        │
│  ████████░░░░  2.345 / 4.000│
├──────────────────────────────┤
│  [Detail Stats]              │
│  Matches: 5.234              │
│  Top 10: 1.890               │
│  Win Rate: 23.5%             │
│  Account Age: 3 tahun 2 bln  │
│  Last Active: Online sekarang │
├──────────────────────────────┤
│  [Action Buttons]            │
│  [Compare]  [Share Card]    │
├──────────────────────────────┤
│  [Bottom Nav]                │
└──────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| ProfileHeader | Top | Avatar, name, UID, guild, server |
| OnlineBadge | Top-right | Green dot + "Online" / "Offline" |
| StatCard | Middle | K/D, Wins, Headshot % |
| RankProgress | Middle | Rank icon + progress bar |
| DetailList | Bottom | Full stat breakdown |
| ActionButton | Bottom | Compare & Share actions |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | All data displayed | Normal load |
| **Loading** | Skeleton cards | Fetching API |
| **Error** | "Gagal memuat data" + retry | API down / invalid ID |
| **Offline** | "Player sedang offline" | Last seen timestamp |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|---------|
| Back Button | Tap | Back to Home |
| Bookmark Icon | Tap | Toggle bookmark (filled/outline) |
| Share Icon | Tap | Generate card → share sheet native |
| Compare Button | Tap | Navigate to Compare screen with this ID |
| Stat Card | Long press | Tooltip "Detail K/D per season" |

---

### Screen [03]: Compare

**Purpose:** Membandingkan stat 2 player Free Fire secara side-by-side
**UVP Highlight:** Fitur unik yang gak ada di kompetitor — liat langsung siapa yang lebih jago

**Route:** `/compare`
**Access:** Public

#### Layout Structure
```
┌──────────────────────────────┐
│  ← Back     Bandingkan       │
├──────────────────────────────┤
│  ┌────────┐  VS  ┌────────┐ │
│  │ Player A│  ⚔️  │ Player B│ │
│  │ [UID 1] │     │ [UID 2] │ │
│  └────────┘     └────────┘ │
│                              │
│  [Compare Stats]             │
│                              │
│  K/D                         │
│  2.54        VS        1.89  │
│  ████████░░  🏆  ██████░░░░ │
│                              │
│  Headshot %                  │
│  38%         VS        22%   │
│  ████████░░  🏆  ████░░░░░░ │
│                              │
│  Win Rate                    │
│  23.5%       VS        15.2% │
│  ████████░░  🏆  ████░░░░░░ │
│                              │
│  Level                       │
│  75          VS         62   │
│                              │
│  Rank                        │
│  Heroic      VS     Diamond  │
│                              │
├──────────────────────────────┤
│  [Winner Summary]            │
│  "Player A unggul di         │
│   3 dari 5 kategori!"        │
├──────────────────────────────┤
│  [Bottom Nav]                │
└──────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| CompareInput | Top | Dua input UID + VS divider |
| CompareStatRow | Body | Stat name + dual progress bars |
| WinnerBadge | Per row | Trophy icon di sisi yg menang |
| ResultSummary | Bottom | Kesimpulan pemenang |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Dua input kosong | First visit |
| **Filled** | Side-by-side stats | Both UIDs entered |
| **Loading** | Skeleton progress bars | Fetching data |
| **Error** | "Player X tidak ditemukan" | Invalid UID |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|---------|
| UID Input | Paste / Type | Validasi format numeric |
| Swap Button | Tap | Tukar posisi Player A ↔ B |
| Stat Row | Tap | Detail per-season breakdown |
| Share Result | Tap | Export screenshot hasil compare |

---

### Screen [04]: Bookmarks

**Purpose:** Menyimpan player favorit buat quick access & tracking stat dari waktu ke waktu

**Route:** `/bookmarks`
**Access:** Public (local storage)

#### Layout Structure
```
┌──────────────────────────────┐
│  ⭐ Bookmark                  │
├──────────────────────────────┤
│  [Search bar] 🔍 Cari player │
│                              │
│  ┌────────────────────────┐  │
│  │ Player A   ★ Lv 75     │  │
│  │ K/D 2.54  → Naik +0.1  │  │
│  │ Heroic    Online 🟢    │  │
│  ├────────────────────────┤  │
│  │ Player B   ★ Lv 62     │  │
│  │ K/D 1.89  → Turun -0.2 │  │
│  │ Diamond   Offline ⚫   │  │
│  └────────────────────────┘  │
│                              │
│  [Empty State jika kosong]   │
│  "Belum ada bookmark"        │
│  Ilustrasi + tombol cari     │
├──────────────────────────────┤
│  [Bottom Nav]                │
└──────────────────────────────┘
```

### Screen [05]: History

**Purpose:** Riwayat pengecekan UID terakhir

**Route:** `/history`
**Access:** Public (local storage)

#### Layout Structure
```
┌──────────────────────────────┐
│  📋 History                  │
├──────────────────────────────┤
│  [Hari ini]                  │
│  • Player C — 10 menit lalu  │
│  • Player A — 2 jam lalu     │
│                              │
│  [Kemarin]                   │
│  • Player D — 1 hari lalu    │
│                              │
│  [Minggu ini]                │
│  • Player E — 3 hari lalu    │
│  • Player F — 5 hari lalu    │
│                              │
│  [Clear All] [button]        │
├──────────────────────────────┤
│  [Bottom Nav]                │
└──────────────────────────────┘
```

### Screen [06]: Settings

**Purpose:** Pengaturan aplikasi & customization

**Route:** `/settings`
**Access:** Public (local storage)

**Items:**
- Theme (Dark / Light / System)
- Default server (Indonesia, Global, India, dll)
- Notifications (tracking alerts)
- Clear cache
- About app

---

## COMPONENT SPECS

### Component: Button

**Usage:** CTA, form submit, actions
**Category:** Atom

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Primary | Orange bg, white text | Main CTA (Cari, Simpan) |
| Secondary | Dark bg, orange border | Secondary action (Compare) |
| Ghost | Transparent, white text | Subtle action (Batal) |
| Icon | Square, icon only | Bookmark, Share, Back |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal |
| Hover | Brightness 110% |
| Active/Pressed | Scale 0.97 |
| Disabled | Opacity 40% |
| Loading | Spinner ganti icon |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary | secondary | icon` | `primary` | Visual style |
| `size` | `sm | md | lg` | `md` | Size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state |
| `icon` | `string` | `-` | Lucide icon name |
| `onClick` | `function` | `-` | Click handler |

### Component: StatCard

**Usage:** Menampilkan angka statistik di Profile & Compare
**Category:** Molecule

#### Structure
```
┌──────────┐
│  Icon    │
│  2.54    │
│  K/D     │
└──────────┘
```

#### Variants
| Variant | Visual | Use Case |
|---------|--------|----------|
| Default | Dark card | Profile stats |
| Compact | No icon, smaller | Compare row |
| Highlight | Orange accent | Winning stat in Compare |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal |
| Loading | Skeleton shimmer |
| Updated | Brief glow animation on number change |

### Component: RankProgress

**Usage:** Menampilkan rank player dengan progress bar
**Category:** Molecule

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `rank` | `string` | Rank name (Bronze → Grandmaster) |
| `points` | `number` | Current points |
| `maxPoints` | `number` | Points needed for next rank |
| `size` | `sm | md` | Default `md` |

### Component: OnlineBadge

**Usage:** Menampilkan status online player
**Category:** Atom

#### Variants
| Variant | Visual | Description |
|---------|--------|-------------|
| Online | Green dot + "Online" | Player aktif |
| Offline | Gray dot + "Offline" | Player tidak aktif |
| InGame | Green dot + "Dalam Game" | Sedang bermain |
| Unknown | Gray dash | Status tidak diketahui |

### Component: PlayerCard

**Usage:** Menampilkan preview player di Bookmark, History, dan Recent Search
**Category:** Molecule

#### Variants
| Variant | Content | Use Case |
|---------|---------|----------|
| Default | Avatar + Name + Level + Rank | Bookmark list |
| Compact | Name + Level only | Recent search |
| WithStat | + K/D + Online status | Tracking view |

### Component: SearchInput

**Usage:** Input UID utama
**Category:** Molecule

#### States
| State | Visual Change |
|-------|--------------|
| Default | Dark bg, white border |
| Focus | Orange border glow |
| Filled | Angka terisi, tombol aktif |
| Error | Red border, error message |
| Disabled | Opacity 50% |

#### Validation
- Hanya angka (8-12 digit)
- Auto-format: xxx xxxx xxxx
- Paste otomatis trigger search

---

## GOOGLE STITCH PROMPT

```
================================================================================
                      GOOGLE STITCH PROMPT
================================================================================

PROJECT OVERVIEW
Create a mobile-first web app called "FF Checker" where users paste a Free Fire 
player UID to instantly see detailed player stats, rank, online status, and more. 
Dark gaming aesthetic with orange accent.

UNIQUE VALUE PROPOSITION
All-in-one dashboard: stats, rank, online status, guild, account age in 1 screen. 
Fitur unik: Compare Mode (bandingin 2 player), Share Card (export hasil cek ke 
gambar), Bookmark & Track (pantau perubahan stat dari waktu ke waktu). 
Bersih tanpa iklan, loading cepat.

PLATFORM
Mobile-first (responsive), PWA-ready

DESIGN SYSTEM

Colors:
- Primary: #FF6B35 (orange accent)
- Primary Hover: #E55A2B
- Secondary: #FF3366
- Surface: #1A1A2E (cards)
- Background: #0F0F1A (page)
- Text Primary: #FFFFFF
- Text Secondary: #B0B0C0
- Success: #00D68F (online status)
- Error: #FF3D3D
- Border: #2A2A3E

Typography:
- Font Family: Inter
- h1: 24px Bold, h2: 20px Semibold, h3: 16px Semibold
- Body: 14px Regular
- Stat numbers: 28px Bold
- Caption: 12px Regular

Spacing: 4px grid system
Radius: sm=6px, md=12px, lg=20px, full=999px
Shadows: sm/md/lg with rgba(0,0,0,0.3-0.5)
Icons: Lucide outline, 20px default

SCREENS TO DESIGN

Screen 1: Home / Search (Route: /)
- Logo + tagline di atas
- Search input dengan icon 🔍 + "Cari" button
- Quick action cards: Compare ⚔️, Bookmark ⭐, History 📋
- Recent searches dengan avatar preview
- States: default, empty (first time), loading skeleton, error

Screen 2: Player Profile (Route: /player/:id)
- Header with back, bookmark, share icons
- Avatar + name + UID + guild + server
- Online status badge (green/gray dot)
- Stats row: K/D, Total Wins, Headshot %
- Rank card with progress bar
- Detail stats: total matches, top 10, win rate, account age, last active
- Action buttons: Compare, Share Card
- States: default, loading skeleton, error, offline

Screen 3: Compare (Route: /compare)
- Dual input UID with VS divider ⚔️
- Side-by-side stat comparison with progress bars
- Winner trophy badge per category
- Swap button to exchange players
- Result summary at bottom: "Player X unggul di N kategori"
- States: empty, filled, loading, error

Screen 4: Bookmarks (Route: /bookmarks)
- List of saved players
- Each card: avatar, name, level, rank, K/D trend (naik/turun), online status
- Search within bookmarks
- Empty state: illustration + "Belum ada bookmark" + CTA button

Screen 5: History (Route: /history)
- Time-grouped list: Hari ini, Kemarin, Minggu ini
- Each item: avatar, name, UID, timestamp
- Clear All button
- Empty state

Screen 6: Settings (Route: /settings)
- Theme toggle (Dark / Light / System)
- Default server selector
- Clear cache
- About app

USER FLOWS

Flow 1: Cek Player
1. Home → paste UID → tap "Cari"
2. Loading skeleton → Player Profile muncul
3. Liat stats → tap Share → export card → share

Flow 2: Compare
1. Home → tap ⚔️ Compare
2. Masukkan Player A UID → Player B UID
3. Side-by-side comparison muncul
4. Tap share result

Flow 3: Bookmark & Track
1. Player Profile → tap ⭐ bookmark
2. Buka Bookmarks tab → liat semua bookmark
3. Tap bookmark → refresh profile

BOTTOM NAVIGATION
- 🔍 Cari (/)
- ⚔️ Compare (/compare)
- ⭐ Bookmark (/bookmarks)
- 📋 History (/history)

COMPONENT NOTES
- Buttons: Primary (orange), Secondary (border), Ghost, Icon variants; loading state
- StatCard: Icon + big number + label; skeleton loading
- RankProgress: Rank icon + name + progress bar
- OnlineBadge: green/gray dot + status text
- PlayerCard: avatar + name + UID + level + rank + K/D + status
- SearchInput: dark bg, orange focus glow, numeric only 8-12 digits

DESIGN RULES
- Dark background (#0F0F1A) with surface cards (#1A1A2E)
- Orange (#FF6B35) as primary accent for CTAs and highlights
- Clean, minimal, no clutter
- Smooth transitions and micro-animations
- Skeleton loading for all data fetching states
- All screens must have dark theme as default
- Share card should be a beautiful exportable image

================================================================================
```
