"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function BookmarksPage() {
  return (
    <Suspense fallback={null}>
      <BookmarksContent />
    </Suspense>
  );
}

function BookmarksContent() {
  const authed = useAuthGuard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">(
    (searchParams.get("tab") as "bookmarks" | "history") || "bookmarks"
  );

  const bookmarks = useStore((s) => s.bookmarks);
  const history = useStore((s) => s.history);
  const clearHistory = useStore((s) => s.clearHistory);
  const [query, setQuery] = useState("");

  const filtered = bookmarks.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.uid.includes(query),
  );

  const historyGroups = groupByTime(history);

  const handleTabChange = useCallback((tab: "bookmarks" | "history") => {
    setActiveTab(tab);
    setQuery("");
  }, []);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar />

      <main className="mx-auto max-w-container-max min-h-screen px-4 pt-20">
        {/* Tab Navigation */}
        <div className="mb-6 flex rounded-full border border-outline-variant bg-surface-container-low p-1">
          <button
            onClick={() => handleTabChange("bookmarks")}
            className={`flex-1 rounded-full py-2 font-headline-h3 text-[16px] font-semibold transition-all ${
              activeTab === "bookmarks"
                ? "bg-primary/10 text-primary-container"
                : "text-on-surface-variant"
            }`}
          >
            Bookmark
          </button>
          <button
            onClick={() => handleTabChange("history")}
            className={`flex-1 rounded-full py-2 font-headline-h3 text-[16px] font-semibold transition-all ${
              activeTab === "history"
                ? "bg-primary/10 text-primary-container"
                : "text-on-surface-variant"
            }`}
          >
            Riwayat
          </button>
        </div>

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <section className="space-y-4">
            {bookmarks.length > 0 && (
              <div className="relative mb-6 w-full group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary-container">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari pemain tersimpan..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container py-2 pl-12 pr-4 font-body-md text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((b) => {
                  const trend = getTrend(b);
                  return (
                    <div
                      key={b.uid}
                      onClick={() => router.push(`/player/${b.uid}`)}
                      className="glass-card flex cursor-pointer items-center justify-between rounded-xl p-4 transition-all hover:border-primary-container/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-highest text-base font-bold text-primary">
                            {b.name.charAt(0)}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface ${
                              Math.random() > 0.5
                                ? "bg-[#00D68F]"
                                : "bg-on-surface-variant/40"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">{b.name}</h3>
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-label-sm text-[12px] uppercase tracking-wider text-primary">
                            {b.rank}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${trend === "up" ? "text-[#00D68F]" : trend === "down" ? "text-error" : "text-on-surface-variant"}`}>
                          {trend === "up" && (
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                          )}
                          {trend === "down" && (
                            <span className="material-symbols-outlined text-[18px]">trending_down</span>
                          )}
                          <span className="font-display-stats text-[12px] font-bold">{b.kd}</span>
                        </div>
                        <span className="font-label-sm text-[12px] text-on-surface-variant">K/D Ratio</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : bookmarks.length > 0 ? (
              <div className="py-20 text-center">
                <p className="text-on-surface-variant">Bookmark tidak ditemukan</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 h-48 w-48 opacity-40">
                  <span className="material-symbols-outlined text-[120px] text-on-surface-variant">bookmark</span>
                </div>
                <h2 className="font-headline-h2 text-[20px] font-semibold text-on-surface">Belum ada bookmark</h2>
                <p className="mt-sm max-w-xs font-body-md text-[14px] text-on-surface-variant">
                  Cari pemain dan tekan ikon bookmark untuk menyimpannya di sini.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 rounded-xl bg-primary-container px-6 py-3 font-semibold text-on-primary-container"
                >
                  Cari Player
                </button>
              </div>
            )}
          </section>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <section className="space-y-6">
            {history.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-h2 text-[20px] font-semibold text-on-surface">Riwayat Pencarian</h2>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 rounded-lg px-4 py-2 font-label-sm text-[12px] text-error transition-colors hover:bg-error/10"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                    Hapus Semua
                  </button>
                </div>
                <div className="space-y-6">
                  {historyGroups.map((group) => (
                    <div key={group.label}>
                      <h3 className="mb-4 px-base font-label-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                        {group.label}
                      </h3>
                      <div className="space-y-2">
                        {group.items.map((item) => (
                          <div
                            key={`${item.uid}-${item.checkedAt}`}
                            onClick={() => router.push(`/player/${item.uid}`)}
                            className="glass-card flex cursor-pointer items-center gap-4 rounded-xl p-2 transition-all hover:bg-surface-container-high"
                          >
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-surface-container-highest text-sm font-bold text-primary">
                              {item.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate font-headline-h3 text-[16px] font-semibold text-on-surface">{item.name}</h4>
                              <p className="font-label-sm text-[12px] text-on-surface-variant">UID: {item.uid}</p>
                            </div>
                            <span className="pr-4 font-label-sm text-[12px] text-on-surface-variant/60">
                              {formatTime(item.checkedAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 h-48 w-48 opacity-40">
                  <span className="material-symbols-outlined text-[120px] text-on-surface-variant">history</span>
                </div>
                <h2 className="font-headline-h2 text-[20px] font-semibold text-on-surface">Belum ada riwayat</h2>
                <p className="mt-sm max-w-xs font-body-md text-[14px] text-on-surface-variant">
                  Setiap UID yang dicari akan muncul di sini.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 rounded-xl bg-primary-container px-6 py-3 font-semibold text-on-primary-container"
                >
                  Cari Player
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function getTrend(b: { snapshots: Array<{ kd: number }> }): "up" | "down" | null {
  if (b.snapshots.length < 2) return null;
  const latest = b.snapshots[b.snapshots.length - 1].kd;
  const prev = b.snapshots[b.snapshots.length - 2].kd;
  if (latest > prev) return "up";
  if (latest < prev) return "down";
  return null;
}

function groupByTime(items: Array<{ checkedAt: number; name: string; uid: string }>) {
  const now = Date.now();
  const today: typeof items = [];
  const yesterday: typeof items = [];
  const thisWeek: typeof items = [];
  const older: typeof items = [];

  for (const item of items) {
    const diff = now - item.checkedAt;
    if (diff < 86400000) today.push(item);
    else if (diff < 172800000) yesterday.push(item);
    else if (diff < 604800000) thisWeek.push(item);
    else older.push(item);
  }

  const result: Array<{ label: string; items: typeof items }> = [];
  if (today.length) result.push({ label: "Hari ini", items: today });
  if (yesterday.length) result.push({ label: "Kemarin", items: yesterday });
  if (thisWeek.length) result.push({ label: "Minggu ini", items: thisWeek });
  if (older.length) result.push({ label: "Lainnya", items: older });
  return result;
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Kemarin";
  return `${days}h lalu`;
}
