"use client";

import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { SERVERS } from "@/lib/constants";
import type { Settings } from "@/types";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const clearHistory = useStore((s) => s.clearHistory);
  const bookmarks = useStore((s) => s.bookmarks);
  const history = useStore((s) => s.history);
  const removeBookmark = useStore((s) => s.removeBookmark);

  const handleTheme = (theme: Settings["theme"]) => {
    updateSettings({ theme });
  };

  const handleServer = (defaultServer: string) => {
    updateSettings({ defaultServer });
  };

  const handleClearCache = () => {
    clearHistory();
    bookmarks.forEach((b) => removeBookmark(b.uid));
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] pb-24 pattern-dots">
      <TopAppBar />

      <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
        {/* Header */}
        <section className="mb-8 text-center animate-slide-up">
          <h2 className="font-heading text-[28px] font-black uppercase tracking-wider text-white text-shadow-double">
            Pengaturan
          </h2>
          <p className="mt-2 font-body-md text-[14px] text-white/60">
            Sesuaikan pengalaman gaming kompetitif kamu.
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Theme Toggle */}
          <div
            className="glass-card pattern-stripes flex flex-col gap-4 rounded-3xl border-4 p-6 md:col-span-12 rotate-1 animate-card-entrance shimmer-border"
            style={{ borderColor: ACCENT_COLORS[0], boxShadow: `8px 8px 0 ${ACCENT_COLORS[0]}, 16px 16px 0 ${ACCENT_COLORS[3]}`, animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FF3AF2] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
              <h3 className="font-heading text-[18px] font-black uppercase tracking-wider text-white text-shadow-single">Tema Visual</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-full border-4 border-[#FF3AF2] bg-[#1a1a2e] p-1">
              {[
                { value: "light" as const, label: "Terang", icon: "light_mode" },
                { value: "dark" as const, label: "Gelap", icon: "dark_mode" },
                { value: "system" as const, label: "Sistem", icon: "settings_brightness" },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => handleTheme(value)}
                  className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                    settings.theme === value
                      ? "btn-primary bg-[#FF3AF2] text-[#0D0D1A] shadow-[4px_4px_0_#FFE600]"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Selector */}
          <div
            className="glass-card flex flex-col justify-between rounded-3xl border-4 p-6 md:col-span-7 -rotate-1 animate-card-entrance"
            style={{ borderColor: ACCENT_COLORS[1], boxShadow: `8px 8px 0 ${ACCENT_COLORS[1]}, 16px 16px 0 ${ACCENT_COLORS[2]}`, animationDelay: "0.2s" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00F5D4] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                <h3 className="font-heading text-[18px] font-black uppercase tracking-wider text-white text-shadow-single">Server Bawaan</h3>
              </div>
              <span className="rounded-full bg-[#00F5D4]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#00F5D4]">
                Koneksi Tercepat
              </span>
            </div>
            <div className="space-y-2">
              {SERVERS.slice(0, 3).map((server) => (
                <label
                  key={server}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border-4 p-3 transition-colors ${
                    settings.defaultServer === server
                      ? "border-[#00F5D4] bg-[#00F5D4]/10"
                      : "border-white/10 bg-[#1a1a2e] hover:border-[#00F5D4]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-white/60">location_on</span>
                    <span className="text-[14px] text-white">{server}</span>
                  </div>
                  <input
                    type="radio"
                    name="server"
                    value={server}
                    checked={settings.defaultServer === server}
                    onChange={() => handleServer(server)}
                    className="accent-[#00F5D4]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Clear Cache */}
          <div
            className="glass-card flex flex-col rounded-3xl border-4 p-6 md:col-span-5 rotate-1 animate-card-entrance"
            style={{ borderColor: ACCENT_COLORS[2], boxShadow: `8px 8px 0 ${ACCENT_COLORS[2]}, 16px 16px 0 ${ACCENT_COLORS[4]}`, animationDelay: "0.3s" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFE600] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>cleaning_services</span>
              <h3 className="font-heading text-[18px] font-black uppercase tracking-wider text-white text-shadow-single">Penyimpanan</h3>
            </div>
            <div className="flex flex-grow flex-col items-center justify-center py-6 text-center">
              <div className="font-display text-[36px] font-black text-[#FFE600] text-shadow-double">
                {((bookmarks.length + history.length) * 0.5).toFixed(0)} MB
              </div>
              <div className="mb-6 text-[12px] font-black uppercase tracking-widest text-white/40">
                Cache Terpakai
              </div>
              <button
                onClick={handleClearCache}
                className="btn-secondary w-full rounded-full border-4 border-[#FFE600] bg-[#FFE600]/10 py-3 text-[16px] font-black uppercase tracking-wider text-[#FFE600] transition-all hover:bg-[#FFE600]/20 active:scale-95"
                style={{ boxShadow: `4px 4px 0 ${ACCENT_COLORS[2]}` }}
              >
                Hapus Cache
              </button>
            </div>
            <p className="text-center text-[12px] italic text-white/40">
              Termasuk aset game sementara dan avatar pemain.
            </p>
          </div>

          {/* About App */}
          <div
            className="glass-card pattern-checker relative overflow-hidden rounded-3xl border-4 p-6 md:col-span-12 -rotate-1 animate-card-entrance"
            style={{ borderColor: ACCENT_COLORS[3], boxShadow: `8px 8px 0 ${ACCENT_COLORS[3]}, 16px 16px 0 ${ACCENT_COLORS[0]}`, animationDelay: "0.4s" }}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 opacity-10">
              <span className="material-symbols-outlined text-[200px] text-[#FF6B35]" style={{ fontVariationSettings: "'wght' 700" }}>info</span>
            </div>
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FF6B35] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <h3 className="font-heading text-[18px] font-black uppercase tracking-wider text-white text-shadow-single">Tentang CEKUSERFF</h3>
            </div>
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2 rounded-2xl border-2 border-[#FF6B35]/30 bg-[#FF6B35]/5 p-4">
                <div className="text-[12px] font-black uppercase text-[#FF6B35]">Versi</div>
                <div className="text-[14px] text-white">v1.0.0 (Stable Build)</div>
              </div>
              <div className="space-y-2 rounded-2xl border-2 border-[#FF6B35]/30 bg-[#FF6B35]/5 p-4">
                <div className="text-[12px] font-black uppercase text-[#FF6B35]">Pengembang</div>
                <div className="text-[14px] text-white">Apex Systems Interactive</div>
              </div>
              <div className="space-y-2 rounded-2xl border-2 border-[#FF6B35]/30 bg-[#FF6B35]/5 p-4">
                <div className="text-[12px] font-black uppercase text-[#FF6B35]">Status</div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00D68F] shadow-[0_0_8px_#00D68F]" />
                  <span className="text-[14px] text-[#00D68F]">Server Aktif</span>
                </div>
              </div>
            </div>
            <hr className="my-6 border-2 border-[#FF6B35]/20" />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <a className="text-[12px] text-white/60 underline underline-offset-4 transition-colors hover:text-[#FF6B35]" href="#">
                  Kebijakan Privasi
                </a>
                <a className="text-[12px] text-white/60 underline underline-offset-4 transition-colors hover:text-[#FF6B35]" href="#">
                  Ketentuan Layanan
                </a>
              </div>
              <button className="flex items-center gap-2 text-[12px] text-white/60 transition-colors hover:text-[#FF6B35]">
                Periksa Pembaruan <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Donation Card */}
        <a
          href="https://sociabuzz.com/trisnosanjaya"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <div
            className="glass-card relative w-full overflow-hidden rounded-3xl border-4 border-[#7B2FFF] p-6 transition-transform active:scale-[0.98] rotate-1 animate-card-entrance shimmer-border"
            style={{ boxShadow: `8px 8px 0 ${ACCENT_COLORS[4]}, 16px 16px 0 ${ACCENT_COLORS[0]}`, animationDelay: "0.5s" }}
          >
            <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7B2FFF]/20 border-2 border-[#7B2FFF]">
                  <span className="material-symbols-outlined text-[28px] text-[#7B2FFF]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <div>
                  <h3 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-double mb-1">Dukung Kami</h3>
                  <p className="text-[14px] text-white/60">
                    Donasi untuk mendukung pengembangan aplikasi ini.
                  </p>
                </div>
              </div>
              <span className="btn-primary flex items-center gap-2 rounded-full border-4 border-[#7B2FFF] bg-[#7B2FFF] px-8 py-3 text-[16px] font-black uppercase tracking-wider text-[#0D0D1A] backdrop-blur-md transition-all hover:bg-[#9B4FFF]">
                <span className="material-symbols-outlined text-lg">coffee</span>
                Traktir Kopi
              </span>
            </div>
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#7B2FFF]/10" />
          </div>
        </a>

        {/* Bug Report Banner */}
        <div
          className="glass-card mt-6 relative w-full overflow-hidden rounded-3xl border-4 border-[#FF3AF2] p-6 -rotate-1 animate-card-entrance"
          style={{ boxShadow: `8px 8px 0 ${ACCENT_COLORS[0]}, 16px 16px 0 ${ACCENT_COLORS[1]}`, animationDelay: "0.6s" }}
        >
          <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="font-heading text-[22px] font-black uppercase tracking-wider text-white text-shadow-double mb-1">Menemukan Bug?</h3>
              <p className="text-[14px] text-white/60">
                Laporkan masalah langsung ke tim teknis kami.
              </p>
            </div>
            <button className="btn-secondary relative z-10 rounded-full border-4 border-[#FF3AF2] bg-[#FF3AF2]/10 px-8 py-3 text-[16px] font-black uppercase tracking-wider text-[#FF3AF2] backdrop-blur-md transition-all hover:bg-[#FF3AF2]/20">
              Kirim Laporan
            </button>
          </div>
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#FF3AF2]/10" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
