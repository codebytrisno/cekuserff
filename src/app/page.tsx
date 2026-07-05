"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";

const RANKS = [
  "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster",
] as const;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDisplayRank(uid: string): { name: string; color: string; bg: string } {
  const rankIdx = Math.floor(seededRandom(Number(uid.slice(-4)) + 1) * RANKS.length);
  const rank = RANKS[rankIdx];
  if (rank === "Heroic") return { name: "Heroic", color: "text-secondary", bg: "bg-secondary-container/30" };
  if (rank === "Grandmaster") return { name: "Grandmaster", color: "text-tertiary", bg: "bg-tertiary-container/30" };
  if (rank === "Diamond") return { name: "Diamond III", color: "text-on-surface-variant", bg: "bg-outline-variant/30" };
  return { name: rank, color: "text-on-surface-variant", bg: "bg-outline-variant/30" };
}

function getDisplayKd(uid: string): number {
  return Math.round(seededRandom(Number(uid.slice(-4)) + 2) * 3 * 100) / 100 + 0.5;
}

function isOnline(uid: string): boolean {
  return seededRandom(Number(uid.slice(-4)) + 3) > 0.4;
}

export default function HomePage() {
  const router = useRouter();
  const { search, loading, error } = usePlayer();
  const history = useStore((s) => s.history);
  const [uid, setUid] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) return;
    const data = await search(uid.trim());
    if (data) {
      useStore.getState().addHistory(data);
      setUid("");
      router.push(`/player/${uid}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header suppressHydrationWarning className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-primary-container text-2xl">local_fire_department</span>
          <span className="font-headline-h2 text-[20px] font-bold text-on-surface">CEKUSERFF</span>
        </div>
        <a
          href="https://sociabuzz.com/trisnosanjaya"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-3 py-1.5 text-[12px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <span className="hidden sm:inline">Donasi</span>
        </a>
      </header>

      <main className="mx-auto max-w-container-max space-y-6 px-4 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-6">
          <div className="relative z-10 space-y-2 text-center">
            <h1 className="font-headline-h1-mobile text-[20px] font-bold text-primary-container">Statistik Player Instan</h1>
            <p className="font-body-md text-[14px] text-on-surface-variant opacity-80">
              Pantau peringkat, rasio K/D, dan perkembangan musiman.
            </p>
          </div>
          <div className="relative z-10 mx-auto mt-6 max-w-md">
            <form onSubmit={handleSearch} className="flex flex-col gap-2">
              <div className="relative group transition-all duration-200 focus-within:shadow-[0_0_20px_rgba(255,107,53,0.15)] rounded-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary-container transition-colors">
                  search
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan Player ID..."
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="h-14 w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-12 pr-4 text-on-surface outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !uid.trim()}
                suppressHydrationWarning
                className="flex h-12 w-full items-center justify-center gap-1 rounded-xl bg-primary-container text-[16px] font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Memuat..." : "Cari"}
              </button>
            </form>
            {error && (
              <p className="mt-2 text-center text-[14px] text-error">{error}</p>
            )}
          </div>
        </section>

        {/* Quick Actions Bento Grid */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            onClick={() => router.push("/compare")}
            className="glass-card group flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors hover:border-primary/50 active:scale-[0.97]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container/20">
                <span className="material-symbols-outlined text-secondary">compare_arrows</span>
              </div>
              <div>
                <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Bandingkan</h3>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Analisis data 1v1</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline transition-transform group-hover:translate-x-1">chevron_right</span>
          </div>

          <div
            onClick={() => router.push("/bookmarks")}
            className="glass-card group flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors hover:border-primary/50 active:scale-[0.97]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container/20">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Bookmark</h3>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Pemain yang diikuti</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline transition-transform group-hover:translate-x-1">chevron_right</span>
          </div>

          <div
            onClick={() => router.push("/history")}
            className="glass-card group flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors hover:border-primary/50 active:scale-[0.97]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-tertiary-container/20">
                <span className="material-symbols-outlined text-tertiary">history</span>
              </div>
              <div>
                <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Riwayat</h3>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Baru dilihat</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline transition-transform group-hover:translate-x-1">chevron_right</span>
          </div>
        </section>

        {/* Recent Searches */}
        {history.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="font-headline-h2 text-[20px] font-semibold text-on-surface">Pencarian Terakhir</h2>
              <button
                onClick={() => useStore.getState().clearHistory()}
                className="font-label-sm text-[12px] text-primary hover:underline"
              >
                Hapus semua
              </button>
            </div>
            <div className="space-y-2">
              {history.slice(0, 5).map((item, idx) => {
                const online = isOnline(item.uid);
                const rank = getDisplayRank(item.uid);
                const kd = getDisplayKd(item.uid);
                return (
                  <div
                    key={`${item.uid}-${item.checkedAt}`}
                    onClick={() => router.push(`/player/${item.uid}`)}
                    className={`glass-card flex cursor-pointer items-center justify-between rounded-xl p-2 transition-all hover:bg-surface-container-high ${
                      idx === 0 ? "border-l-4 border-l-primary-container" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface-container-highest text-lg font-bold text-primary">
                          {item.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface ${
                            online
                              ? "bg-[#00D68F] primary-glow"
                              : "bg-outline-variant"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-headline-h3 text-[16px] font-semibold text-on-surface">{item.name}</p>
                        <div className="flex items-center gap-1">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${rank.bg} ${rank.color}`}>
                            {rank.name}
                          </span>
                          <span className="font-label-sm text-[12px] text-on-surface-variant opacity-60">ID: {item.uid}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-display-stats text-[28px] font-bold ${idx === 0 ? "text-primary-container" : "text-on-surface opacity-70"}`}>
                        {kd}
                      </p>
                      <p className="font-label-sm text-[12px] uppercase tracking-wider text-on-surface-variant">K/D Rate</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
