"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogIn, LogOut, Search, TrendingUp, Users, BarChart3, Bookmark, GitCompare, History, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/components/Toast";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

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

function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-primary-container text-2xl">local_fire_department</span>
          <span className="font-headline-h2 text-[20px] font-bold text-on-surface">CEKUSERFF</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://sociabuzz.com/trisnosanjaya"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-3 py-1.5 text-[12px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="hidden sm:inline">Donasi</span>
          </a>
          <button
            onClick={() => router.push("/auth")}
            className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-3 py-1.5 text-[12px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Masuk</span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.15),transparent_70%)]" />
          <div className="relative z-10 mx-auto max-w-container-max px-4 py-16 text-center sm:py-24">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/20">
              <Zap className="h-8 w-8 text-primary-container" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              Cek Statistik Player{' '}
              <span className="text-primary-container">Free Fire</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-on-surface-variant/80">
              Pantau peringkat, K/D ratio, headshot rate, dan perkembangan musiman hanya dengan memasukkan UID player.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => router.push("/auth")}
                className="flex h-12 items-center gap-2 rounded-xl bg-primary-container px-6 text-base font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Mulai Sekarang
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="flex h-12 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container px-6 text-base font-semibold text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98]"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-container-max px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-on-surface">Fitur Unggulan</h2>
            <p className="mt-2 text-sm text-on-surface-variant/80">
              Semua yang kamu butuhin buat tracking performa player
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search, label: "Cek UID Instan", desc: "Masukkan UID player dan dapatkan data statistik lengkap dalam hitungan detik.", color: "text-primary-container", bg: "bg-primary-container/20" },
              { icon: TrendingUp, label: "Tracking Real-time", desc: "Pantau perubahan rank, K/D, dan performa player secara berkala.", color: "text-secondary", bg: "bg-secondary-container/20" },
              { icon: GitCompare, label: "Bandingkan Player", desc: "Bandingkan statistik 2 player secara berdampingan untuk analisis 1v1.", color: "text-tertiary", bg: "bg-tertiary-container/20" },
              { icon: Bookmark, label: "Bookmark Player", desc: "Simpan player favorit dan pantau perkembangannya dari waktu ke waktu.", color: "text-primary-container", bg: "bg-primary-container/20" },
              { icon: History, label: "Riwayat Pencarian", desc: "Lihat kembali player yang pernah kamu cek dengan riwayat pencarian.", color: "text-secondary", bg: "bg-secondary-container/20" },
              { icon: BarChart3, label: "Stat Lengkap", desc: "Data lengkap mulai dari rank, K/D, headshot, win rate, sampai damage.", color: "text-tertiary", bg: "bg-tertiary-container/20" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-outline-variant/50 bg-surface-container/50 p-5 transition-all hover:border-primary-container/30 hover:bg-surface-container">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-on-surface">{f.label}</h3>
                <p className="mt-1 text-xs text-on-surface-variant/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-container-max px-4 pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-gradient-to-br from-surface-container via-surface-container-high to-surface-container p-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.1),transparent_60%)]" />
            <div className="relative z-10">
              <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-primary-container" />
              <h2 className="text-xl font-bold text-on-surface">Siap tracking performa player?</h2>
              <p className="mt-2 text-sm text-on-surface-variant/80">Masuk sekarang dan mulai pantau statistik player Free Fire</p>
              <button
                onClick={() => router.push("/auth")}
                className="mx-auto mt-6 flex h-12 items-center gap-2 rounded-xl bg-primary-container px-6 text-base font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Masuk Sekarang
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AppHome() {
  const router = useRouter();
  const { search, loading, error } = usePlayer();
  const history = useStore((s) => s.history);
  const { user, isAuthenticated, logout } = useAuth();
  const [uid, setUid] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(e.target as Node)) setAuthOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-container/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-container/30 to-secondary-container/30 border border-primary-container/20">
              <span className="material-symbols-outlined text-4xl text-primary-container animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-on-surface">Mencari Pemain</h3>
          <p className="mt-1 text-sm text-on-surface-variant/70">Menghubungi server Garena...</p>
          <div className="mt-6 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2.5 w-2.5 rounded-full bg-primary-container" style={{ animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-outline-variant/30">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-tertiary" style={{ animation: "barSlide 2s ease-in-out infinite", width: "40%" }} />
          </div>
          <div className="mt-8 space-y-3 text-left">
            {[
              { label: "Memvalidasi UID", done: true },
              { label: "Menghubungi server Garena", done: false, active: true },
              { label: "Mengambil data player", done: false },
              { label: "Memproses statistik", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step.done ? "bg-[#00D68F]/20 text-[#00D68F]" : step.active ? "bg-primary-container/20 text-primary-container" : "bg-outline-variant/20 text-outline-variant"
                }`}>
                  {step.done ? (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : step.active ? (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${step.done ? "text-[#00D68F]" : step.active ? "text-on-surface" : "text-on-surface-variant/50"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <style>{`@keyframes dotPulse{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}@keyframes barSlide{0%{transform:translateX(-100%)}50%{transform:translateX(250%)}100%{transform:translateX(-100%)}}`}</style>
        </div>
      )}

      <header suppressHydrationWarning className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-primary-container text-2xl">local_fire_department</span>
          <span className="font-headline-h2 text-[20px] font-bold text-on-surface">CEKUSERFF</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://sociabuzz.com/trisnosanjaya"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-3 py-1.5 text-[12px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="hidden sm:inline">Donasi</span>
          </a>

          <div ref={authRef} className="relative">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setAuthOpen(!authOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm font-bold text-primary-container transition-colors hover:bg-primary-container/30"
                >
                  {user.label.charAt(0)}
                </button>
                {authOpen && (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high shadow-lg">
                    <div className="border-b border-outline-variant/50 px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">{user.label}</p>
                      <p className="text-xs text-on-surface-variant">@{user.username}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setAuthOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-on-surface transition-colors hover:bg-surface-container-higher"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
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
                        {kd.toFixed(2)}
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

export default function HomePage() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useAuth.persist.hasHydrated()) {
      setReady(true);
    } else {
      const unsub = useAuth.persist.onFinishHydration(() => setReady(true));
      return unsub;
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <AppHome />;
}
