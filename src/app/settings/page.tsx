"use client";

import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { SERVERS } from "@/lib/constants";
import type { Settings } from "@/types";

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
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar />

      <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
        {/* Header */}
        <section className="mb-8">
          <h2 className="font-headline-h1-mobile mb-2 text-[20px] font-bold text-primary">Pengaturan</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant">Sesuaikan pengalaman gaming kompetitif kamu.</p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Theme Toggle */}
          <div className="glass-panel flex flex-col gap-4 rounded-xl p-4 orange-glow md:col-span-12">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold">Tema Visual</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-full border border-outline-variant bg-surface-container-lowest p-1">
              {[
                { value: "light" as const, label: "Terang", icon: "light_mode" },
                { value: "dark" as const, label: "Gelap", icon: "dark_mode" },
                { value: "system" as const, label: "Sistem", icon: "settings_brightness" },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => handleTheme(value)}
                  className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 font-label-sm text-[12px] transition-all ${
                    settings.theme === value
                      ? "bg-primary-container font-bold text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-variant/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Selector */}
          <div className="glass-panel flex flex-col justify-between rounded-xl p-4 orange-glow md:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                <h3 className="font-headline-h3 text-[16px] font-semibold">Server Bawaan</h3>
              </div>
              <span className="rounded bg-tertiary/10 px-2 py-1 font-label-sm text-[10px] uppercase tracking-wider text-tertiary">
                Koneksi Tercepat
              </span>
            </div>
            <div className="space-y-2">
              {SERVERS.slice(0, 3).map((server) => (
                <label
                  key={server}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary ${
                    settings.defaultServer === server
                      ? "border-primary bg-surface-container-high"
                      : "border-outline-variant bg-surface-container-high"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                    <span className="font-body-md text-[14px]">{server}</span>
                  </div>
                  <input
                    type="radio"
                    name="server"
                    value={server}
                    checked={settings.defaultServer === server}
                    onChange={() => handleServer(server)}
                    className="text-primary focus:ring-primary border-outline bg-transparent"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Clear Cache */}
          <div className="glass-panel flex flex-col rounded-xl p-4 orange-glow md:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cleaning_services</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold">Penyimpanan</h3>
            </div>
            <div className="flex flex-grow flex-col items-center justify-center py-6 text-center">
              <div className="font-display-stats mb-1 text-[28px] font-bold text-primary">
                {((bookmarks.length + history.length) * 0.5).toFixed(0)} MB
              </div>
              <div className="mb-6 font-label-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                Cache Terpakai
              </div>
              <button
                onClick={handleClearCache}
                className="w-full rounded-lg bg-secondary-container py-3 font-headline-h3 text-[16px] font-semibold text-on-secondary-container transition-all hover:opacity-90 active:scale-95"
              >
                Hapus Cache
              </button>
            </div>
            <p className="text-center font-label-sm text-[12px] italic text-on-surface-variant/60">
              Termasuk aset game sementara dan avatar pemain.
            </p>
          </div>

          {/* About App */}
          <div className="glass-panel relative overflow-hidden rounded-xl p-4 orange-glow md:col-span-12">
            <div className="pointer-events-none absolute -right-12 -top-12 opacity-10">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 700" }}>info</span>
            </div>
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold">Tentang CEKUSERFF</h3>
            </div>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
              <div className="space-y-2">
                <div className="font-label-sm text-[12px] uppercase text-primary">Versi</div>
                <div className="font-body-md text-[14px]">v1.0.0 (Stable Build)</div>
              </div>
              <div className="space-y-2">
                <div className="font-label-sm text-[12px] uppercase text-primary">Pengembang</div>
                <div className="font-body-md text-[14px]">Apex Systems Interactive</div>
              </div>
              <div className="space-y-2">
                <div className="font-label-sm text-[12px] uppercase text-primary">Status</div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00D68F] shadow-[0_0_8px_#00D68F]" />
                  <span className="font-body-md text-[14px] text-[#00D68F]">Server Aktif</span>
                </div>
              </div>
            </div>
            <hr className="my-6 border-outline-variant" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <a className="font-label-sm text-[12px] text-on-surface-variant underline underline-offset-4 hover:text-primary transition-colors" href="#">
                  Kebijakan Privasi
                </a>
                <a className="font-label-sm text-[12px] text-on-surface-variant underline underline-offset-4 hover:text-primary transition-colors" href="#">
                  Ketentuan Layanan
                </a>
              </div>
              <button className="flex items-center gap-2 font-label-sm text-[12px] text-on-surface-variant transition-colors hover:text-tertiary">
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
          <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-secondary-container to-primary-container p-4 text-on-primary-container transition-transform active:scale-[0.98]">
            <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <div>
                  <h3 className="font-headline-h2 mb-1 text-[20px] font-semibold">Dukung Kami</h3>
                  <p className="font-body-md text-[14px] opacity-90">
                    Donasi untuk mendukung pengembangan aplikasi ini.
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 font-headline-h3 text-[16px] font-semibold backdrop-blur-md transition-all hover:bg-white/20">
                <span className="material-symbols-outlined text-lg">coffee</span>
                Traktir Kopi
              </span>
            </div>
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/5" />
          </div>
        </a>

        {/* Bug Report Banner */}
        <div className="mt-6 relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary-container to-secondary-container p-4 text-on-primary-container">
          <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="font-headline-h2 mb-1 text-[20px] font-semibold">Menemukan Bug?</h3>
              <p className="font-body-md text-[14px] opacity-90">
                Laporkan masalah langsung ke tim teknis kami.
              </p>
            </div>
            <button className="relative z-10 rounded-full border border-white/20 bg-white/10 px-8 py-3 font-headline-h3 text-[16px] font-semibold backdrop-blur-md transition-all hover:bg-white/20">
              Kirim Laporan
            </button>
          </div>
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/5" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

// Empty
