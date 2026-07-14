"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

export default function BookmarksPage() {
  return (
    <Suspense fallback={null}>
      <BookmarksContent />
    </Suspense>
  );
}

function BookmarksContent() {
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

  return (
    <div className="min-h-screen bg-[#0D0D1A] pb-24">
      <TopAppBar />

      <main className="mx-auto max-w-container-max min-h-screen px-4 pt-20">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-3 p-1 animate-slide-up">
          <button
            onClick={() => handleTabChange("bookmarks")}
            className={`flex-1 rounded-full py-3 font-heading text-[16px] font-black uppercase tracking-wider transition-all border-4 ${
              activeTab === "bookmarks"
                ? "border-[#FF3AF2] bg-[#FF3AF2]/15 text-[#FF3AF2] shadow-[4px_4px_0_#00F5D4]"
                : "border-[#FFE600]/30 text-white/60 hover:border-[#FFE600] hover:text-[#FFE600]"
            }`}
          >
            Bookmark
          </button>
          <button
            onClick={() => handleTabChange("history")}
            className={`flex-1 rounded-full py-3 font-heading text-[16px] font-black uppercase tracking-wider transition-all border-4 ${
              activeTab === "history"
                ? "border-[#00F5D4] bg-[#00F5D4]/15 text-[#00F5D4] shadow-[4px_4px_0_#FF3AF2]"
                : "border-[#FFE600]/30 text-white/60 hover:border-[#FFE600] hover:text-[#FFE600]"
            }`}
          >
            Riwayat
          </button>
        </div>

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <section className="space-y-4 pattern-dots">
            {bookmarks.length > 0 && (
              <div className="relative mb-6 w-full group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF3AF2] transition-colors group-focus-within:text-[#00F5D4] text-xl">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari pemain tersimpan..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-maximal w-full rounded-full border-4 border-[#FFE600]/40 bg-[#1A1A2E] py-3 pl-14 pr-6 font-body text-[14px] text-white outline-none transition-all placeholder:text-white/40 focus:border-[#FF3AF2] focus:shadow-[4px_4px_0_#FFE600]"
                />
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((b, idx) => {
                  const trend = getTrend(b);
                  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                  return (
                    <div
                      key={b.uid}
                      onClick={() => router.push(`/player/${b.uid}`)}
                      className="glass-card flex cursor-pointer items-center justify-between rounded-3xl border-4 p-5 transition-all hover:scale-[1.02] active:scale-[0.98] animate-card-entrance tilt-3d"
                      style={{
                        borderColor: accent,
                        boxShadow: `8px 8px 0 ${ACCENT_COLORS[(idx + 1) % ACCENT_COLORS.length]}, 16px 16px 0 ${ACCENT_COLORS[(idx + 2) % ACCENT_COLORS.length]}`,
                        animationDelay: `${0.05 + idx * 0.08}s`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 bg-[#1A1A2E] text-lg font-black font-heading uppercase"
                            style={{ borderColor: accent, color: accent }}
                          >
                            {b.name.charAt(0)}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0D0D1A] ${
                              Math.random() > 0.5
                                ? "bg-[#00F5D4]"
                                : "bg-white/20"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-heading text-[16px] font-black uppercase tracking-wider text-white">{b.name}</h3>
                          <span
                            className="inline-block rounded-full px-3 py-1 font-heading text-[11px] font-black uppercase tracking-wider border-2 mt-1"
                            style={{ borderColor: accent, color: accent, backgroundColor: `${accent}15` }}
                          >
                            {b.rank}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${trend === "up" ? "text-[#00F5D4]" : trend === "down" ? "text-[#FF3AF2]" : "text-white/40"}`}>
                          {trend === "up" && (
                            <span className="text-lg">▲</span>
                          )}
                          {trend === "down" && (
                            <span className="text-lg">▼</span>
                          )}
                          <span className="font-display text-[14px] font-black" style={{ color: trend === "up" ? "#00F5D4" : trend === "down" ? "#FF3AF2" : "white" }}>
                            {b.kd}
                          </span>
                        </div>
                        <span className="font-heading text-[11px] font-black uppercase tracking-wider text-white/40">K/D Ratio</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : bookmarks.length > 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center pattern-mesh">
                <span className="text-7xl mb-4">🔍</span>
                <h2 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-double">Bookmark tidak ditemukan</h2>
                <p className="mt-3 max-w-xs font-body text-[14px] text-white/60">
                  Tidak ada hasil yang cocok dengan pencarianmu.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center pattern-dots">
                <span className="text-8xl mb-6">🔖</span>
                <h2 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-triple">Belum ada bookmark</h2>
                <p className="mt-3 max-w-xs font-body text-[14px] text-white/60">
                  Cari pemain dan tekan ikon bookmark untuk menyimpannya di sini.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="btn-primary mt-6 rounded-full border-4 border-[#FF3AF2] bg-[#FF3AF2]/20 px-8 py-3 font-heading text-[14px] font-black uppercase tracking-wider text-[#FF3AF2] shadow-[4px_4px_0_#00F5D4] transition-all hover:bg-[#FF3AF2]/30 hover:shadow-[6px_6px_0_#00F5D4] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Cari Player
                </button>
              </div>
            )}
          </section>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <section className="space-y-6 pattern-stripes">
            {history.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-double animate-slide-up">Riwayat Pencarian</h2>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 rounded-full border-4 border-[#FF3AF2]/40 bg-[#FF3AF2]/10 px-5 py-2 font-heading text-[12px] font-black uppercase tracking-wider text-[#FF3AF2] transition-all hover:bg-[#FF3AF2]/20 hover:border-[#FF3AF2] shadow-[3px_3px_0_#FFE600] hover:shadow-[4px_4px_0_#FFE600]"
                  >
                    <span className="text-base">🗑️</span>
                    Hapus Semua
                  </button>
                </div>
                <div className="space-y-6">
                  {historyGroups.map((group, gIdx) => (
                    <div key={group.label}>
                      <h3 className="mb-4 px-2 font-heading text-[12px] font-black uppercase tracking-[0.2em] text-white/40">
                        {group.label}
                      </h3>
                      <div className="space-y-3">
                        {group.items.map((item, iIdx) => {
                          const accent = ACCENT_COLORS[(gIdx + iIdx) % ACCENT_COLORS.length];
                          return (
                            <div
                              key={`${item.uid}-${item.checkedAt}`}
                              onClick={() => router.push(`/player/${item.uid}`)}
                              className="glass-card flex cursor-pointer items-center gap-4 rounded-3xl border-4 p-3 transition-all hover:scale-[1.01] active:scale-[0.99] animate-card-entrance"
                              style={{
                                borderColor: accent,
                                boxShadow: `4px 4px 0 ${ACCENT_COLORS[(gIdx + iIdx + 1) % ACCENT_COLORS.length]}`,
                                animationDelay: `${0.05 + iIdx * 0.06}s`,
                              }}
                            >
                              <div
                                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 bg-[#1A1A2E] text-base font-black font-heading uppercase"
                                style={{ borderColor: accent, color: accent }}
                              >
                                {item.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate font-heading text-[15px] font-black uppercase tracking-wider text-white">{item.name}</h4>
                                <p className="font-heading text-[11px] font-black uppercase tracking-wider text-white/40 mt-0.5">UID: {item.uid}</p>
                              </div>
                              <span className="pr-3 font-display text-[12px] font-black text-white/40">
                                {formatTime(item.checkedAt)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center pattern-checker">
                <span className="text-8xl mb-6">⏳</span>
                <h2 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-triple">Belum ada riwayat</h2>
                <p className="mt-3 max-w-xs font-body text-[14px] text-white/60">
                  Setiap UID yang dicari akan muncul di sini.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="btn-secondary mt-6 rounded-full border-4 border-[#00F5D4] bg-[#00F5D4]/20 px-8 py-3 font-heading text-[14px] font-black uppercase tracking-wider text-[#00F5D4] shadow-[4px_4px_0_#FFE600] transition-all hover:bg-[#00F5D4]/30 hover:shadow-[6px_6px_0_#FFE600] active:translate-x-1 active:translate-y-1 active:shadow-none"
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
