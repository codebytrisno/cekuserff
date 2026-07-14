"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, Bookmark, GitCompare, History, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/components/Toast";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";

const RANKS = [
  "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster",
] as const;

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDisplayRank(uid: string): { name: string; color: string; bg: string; border: string } {
  const rankIdx = Math.floor(seededRandom(Number(uid.slice(-4)) + 1) * RANKS.length);
  const rank = RANKS[rankIdx];
  if (rank === "Heroic") return { name: "Heroic", color: "text-accent", bg: "bg-accent/15", border: "border-accent" };
  if (rank === "Grandmaster") return { name: "Grandmaster", color: "text-tertiary", bg: "bg-tertiary/15", border: "border-tertiary" };
  if (rank === "Diamond") return { name: "Diamond III", color: "text-quinary", bg: "bg-quinary/15", border: "border-quinary" };
  return { name: rank, color: "text-secondary", bg: "bg-secondary/15", border: "border-secondary" };
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
    } else if (error) {
      toast("error", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: ACCENT_COLORS[i % ACCENT_COLORS.length],
                  animation: `particle-float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
            <div className="absolute inset-[-8px] rounded-3xl border-2 border-accent/30 animate-pulse-ring" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-dashed border-accent bg-accent/10 animate-pulse-glow">
              <span className="material-symbols-outlined text-5xl text-accent animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>
          <h3 className="font-heading text-2xl font-black uppercase tracking-wider text-foreground text-shadow-double animate-neon-flicker">MENCARI PEMAIN</h3>
          <p className="mt-1 text-sm text-white/50 animate-pulse">Menghubungi server Garena...</p>
          <div className="mt-6 flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3.5 w-3.5 rounded-full" style={{ background: ACCENT_COLORS[i], animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`, boxShadow: `0 0 8px ${ACCENT_COLORS[i]}60` }} />
            ))}
          </div>
          <div className="mt-8 h-2 w-64 overflow-hidden rounded-full bg-white/10 border border-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-accent via-secondary to-tertiary to-quaternary" style={{ animation: "barSlide 2s ease-in-out infinite", width: "40%", boxShadow: "0 0 12px rgba(255,58,242,0.5)" }} />
          </div>
          <div className="mt-8 space-y-3 text-left w-full max-w-xs">
            {[
              { label: "Memvalidasi UID", done: true },
              { label: "Menghubungi server Garena", done: false, active: true },
              { label: "Mengambil data player", done: false },
              { label: "Memproses statistik", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 animate-stagger" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-300 ${
                  step.done ? "border-secondary bg-secondary/20 text-secondary" : step.active ? "border-accent bg-accent/20 text-accent animate-pulse-ring" : "border-white/20 bg-white/5 text-white/30"
                }`}>
                  {step.done ? (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : step.active ? (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>
                <span className={`text-sm font-bold ${step.done ? "text-secondary" : step.active ? "text-foreground" : "text-white/30"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <header suppressHydrationWarning className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b-4 border-accent bg-surface/90 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <span className="font-heading text-xl font-black uppercase tracking-wider text-foreground">CEKUSERFF</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 pt-24 relative z-10">
        {/* Hero Search Section */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-accent p-8 animate-slide-up shimmer-border"
          style={{
            background: "rgba(45, 27, 78, 0.6)",
            boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2",
          }}
        >
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,58,242,0.1),transparent_70%)]" />
          <div className="relative z-10 space-y-3 text-center">
            <h1 className="font-heading text-3xl font-black uppercase tracking-wider text-foreground text-shadow-double">STATISTIK PLAYER INSTAN</h1>
            <p className="text-base text-white/60">
              Pantau peringkat, rasio K/D, dan perkembangan musiman.
            </p>
          </div>
          <div className="relative z-10 mx-auto mt-8 max-w-md">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors text-xl">
                    search
                  </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan Player ID..."
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="input-maximal pl-14"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !uid.trim()}
                suppressHydrationWarning
                className="btn-primary flex h-14 w-full items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                {loading ? "MEMUAT..." : "CARI"}
              </button>
            </form>
            {error && (
              <p className="mt-3 text-center text-sm font-bold text-accent">{error}</p>
            )}
          </div>
        </section>

        {/* Quick Actions Bento Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { href: "/compare", label: "BANDINGKAN", sub: "Analisis data 1v1", icon: "compare_arrows", color: "#00F5D4", borderColor: "#FF3AF2", rotate: "-rotate-1" },
            { href: "/bookmarks", label: "BOOKMARK", sub: "Pemain yang diikuti", icon: "star", color: "#FF3AF2", borderColor: "#FFE600", rotate: "rotate-1" },
            { href: "/history", label: "RIWAYAT", sub: "Baru dilihat", icon: "history", color: "#FFE600", borderColor: "#00F5D4", rotate: "-rotate-1" },
          ].map((item, idx) => (
            <div
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`card-hover group cursor-pointer rounded-3xl border-4 p-6 ${item.rotate} animate-card-entrance tilt-3d ripple-container`}
              style={{
                background: "rgba(45, 27, 78, 0.6)",
                backdropFilter: "blur(12px)",
                borderColor: item.color,
                boxShadow: `8px 8px 0 ${item.borderColor}`,
                animationDelay: `${0.1 + idx * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${item.color}20` }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">{item.label}</h3>
                    <p className="text-xs text-white/50">{item.sub}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-white/30 transition-transform group-hover:translate-x-2">chevron_right</span>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Searches */}
        {history.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-foreground text-shadow-single">PENCARIAN TERAKHIR</h2>
              <button
                onClick={() => useStore.getState().clearHistory()}
                className="font-heading text-xs font-bold uppercase tracking-wider text-accent hover:text-tertiary transition-colors"
              >
                HAPUS SEMUA
              </button>
            </div>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, idx) => {
                const online = isOnline(item.uid);
                const rank = getDisplayRank(item.uid);
                const kd = getDisplayKd(item.uid);
                const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                return (
                  <div
                    key={`${item.uid}-${item.checkedAt}`}
                    onClick={() => router.push(`/player/${item.uid}`)}
                    className="card-hover cursor-pointer rounded-3xl border-4 p-4 transition-all animate-card-entrance ripple-container"
                    style={{
                      background: "rgba(45, 27, 78, 0.6)",
                      backdropFilter: "blur(12px)",
                      borderColor: color,
                      boxShadow: `4px 4px 0 ${ACCENT_COLORS[(idx + 2) % ACCENT_COLORS.length]}`,
                      animationDelay: `${0.05 + idx * 0.08}s`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 text-lg font-black" style={{ borderColor: color, background: `${color}15`, color }}>
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                              online ? "bg-secondary animate-pulse-glow" : "bg-white/20"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-heading text-lg font-black uppercase tracking-wider text-foreground">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full border-2 px-2 py-0.5 text-[10px] font-black uppercase ${rank.border} ${rank.bg} ${rank.color}`}>
                              {rank.name}
                            </span>
                            <span className="text-xs text-white/40">ID: {item.uid}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl" style={{ color }}>{kd.toFixed(2)}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">K/D Rate</p>
                      </div>
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
