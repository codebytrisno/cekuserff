# FF Checker — Task List

| ID | Judul | Modul | Prioritas | Dependensi |
|----|-------|-------|-----------|------------|
| T-01 | Setup Project Next.js | Infra | High | - | Done |
| T-02 | Implementasi Design System | Infra | High | T-01 | Done |
| T-03 | Types & Constants | Infra | High | T-01 | Done |
| T-04 | API Fetcher | Core | High | T-03 | Done |
| T-05 | Zustand Store | Core | High | T-03 | Done |
| T-06 | Custom Hooks | Core | High | T-04, T-05 | Done |
| T-07 | UI Atoms | Components | High | T-02 | Done |
| T-08 | Molecule Components | Components | High | T-07 | Done |
| T-09 | Home / Search Page | Pages | High | T-06, T-07, T-08 | Done |
| T-10 | Player Profile Page | Pages | High | T-06, T-07, T-08 | Done |
| T-11 | Compare Page | Pages | Mid | T-06, T-07, T-08 | Done |
| T-12 | Bookmarks Page | Pages | Mid | T-05, T-08 | Done |
| T-13 | History Page | Pages | Mid | T-05, T-08 | Done |
| T-14 | Settings Page | Pages | Low | T-05, T-07 | Done |
| T-15 | Share Card Feature | Feature | Mid | T-10 | Done |
| T-16 | Bookmark & Track Feature | Feature | Mid | T-05, T-10, T-12 | Done |
| T-17 | Deployment ke Vercel | Infra | Low | Semua | Pending |

---

## Detail Task

### T-01: Setup Project Next.js
- **Deskripsi:** Init Next.js 16 + TypeScript + Tailwind CSS 4 + folder struktur
- **Files:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/`, `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/types/`
- **Command:** `npx create-next-app@latest . --typescript --tailwind --eslint`
- **Status:** Todo

### T-02: Implementasi Design System
- **Deskripsi:** Set Tailwind config sesuai DESIGN.md (colors, fonts Inter via next/font, spacing, radius)
- **Files:** `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- **Status:** Todo

### T-03: Types & Constants
- **Deskripsi:** TypeScript interfaces (PlayerData, Bookmark, HistoryItem, Settings) + constants (API URL, limits, dll)
- **Files:** `src/types/index.ts`, `src/lib/constants.ts`
- **Status:** Todo

### T-04: API Fetcher
- **Deskripsi:** Function fetch player data dari Free Fire API eksternal + error handling
- **Files:** `src/lib/api.ts`
- **Status:** Todo

### T-05: Zustand Store
- **Deskripsi:** Global state: bookmarks, history, settings + persist middleware ke localStorage
- **Files:** `src/lib/store.ts`
- **Status:** Todo

### T-06: Custom Hooks
- **Deskripsi:** `usePlayer` (fetch + loading/error state), `useOnlineStatus` (polling 30s)
- **Files:** `src/hooks/usePlayer.ts`, `src/hooks/useOnlineStatus.ts`
- **Status:** Todo

### T-07: UI Atoms
- **Deskripsi:** Button (4 variants + 5 states), SearchInput (5 states), StatCard (3 variants), OnlineBadge (4 variants), RankProgress
- **Files:** `src/components/ui/Button.tsx`, `src/components/ui/SearchInput.tsx`, `src/components/ui/StatCard.tsx`, `src/components/ui/OnlineBadge.tsx`, `src/components/ui/RankProgress.tsx`
- **Status:** Todo

### T-08: Molecule Components
- **Deskripsi:** PlayerCard (Default + Compact + WithStat), CompareRow (progress bar + winner badge), BottomNav (4 tabs + active state)
- **Files:** `src/components/PlayerCard.tsx`, `src/components/CompareRow.tsx`, `src/components/BottomNav.tsx`
- **Status:** Todo

### T-09: Home / Search Page
- **Deskripsi:** Logo, SearchInput, QuickActions, RecentSearches — semua states (default, empty, loading, error)
- **Files:** `src/app/page.tsx`
- **Status:** Todo

### T-10: Player Profile Page
- **Deskripsi:** ProfileHeader, OnlineBadge, StatsRow, RankProgress, DetailStats, ActionButtons — skeleton loading + error state
- **Files:** `src/app/player/[id]/page.tsx`
- **Status:** Todo

### T-11: Compare Page
- **Deskripsi:** Dual UID input + CompareRow per stat + WinnerBadge + ResultSummary + Swap button
- **Files:** `src/app/compare/page.tsx`
- **Status:** Todo

### T-12: Bookmarks Page
- **Deskripsi:** List bookmark + search filter + trend indicator + empty state
- **Files:** `src/app/bookmarks/page.tsx`
- **Status:** Todo

### T-13: History Page
- **Deskripsi:** Time-grouped list + Clear All + empty state
- **Files:** `src/app/history/page.tsx`
- **Status:** Todo

### T-14: Settings Page
- **Deskripsi:** Theme toggle (dark/light/system), default server selector, clear cache, about
- **Files:** `src/app/settings/page.tsx`
- **Status:** Todo

### T-15: Share Card Feature
- **Deskripsi:** Komponen ShareCard (hidden) + html-to-image convert ke PNG + Web Share API / clipboard fallback
- **Files:** `src/components/ShareCard.tsx`, `src/lib/share.ts`
- **Status:** Todo

### T-16: Bookmark & Track Feature
- **Deskripsi:** Snapshot logic tiap buka profile bookmark + trend indicator (arrow naik/turun + delta)
- **Files:** `src/lib/tracker.ts`
- **Status:** Todo

### T-17: Deployment ke Vercel
- **Deskripsi:** Push ke GitHub, import ke Vercel, config custom domain (optional)
- **Files:** -
- **Status:** Todo
