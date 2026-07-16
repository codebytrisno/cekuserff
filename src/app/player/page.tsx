"use client";

import { useState, useEffect, useRef } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PlayerProfileView } from "@/components/PlayerProfileView";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const SLIDES = [
  {
    icon: "local_fire_department",
    title: "CEK PROFILE PLAYER",
    subtitle: "Cek statistik lengkap Free Fire",
    gradient: "from-accent via-quinary to-secondary",
  },
  {
    icon: "stadia_controller",
    title: "BATTLE ROYALE & CS",
    subtitle: "K/D, Win Rate, Headshot & lainnya",
    gradient: "from-tertiary via-quaternary to-accent",
  },
];

const PLAYLIST = [
  { title: "Sesi Potret", artist: "Ari Lesmana", src: "https://adenpedia.my.id/sound/musik01.mp3" },
  { title: "Aku Milikmu", artist: "Dewa 19", src: "https://adenpedia.my.id/sound/musik02.mp3" },
  { title: "Dan", artist: "Sheila On 7", src: "https://adenpedia.my.id/sound/musik03.mp3" },
  { title: "Hujan", artist: "Utopia", src: "https://adenpedia.my.id/sound/musik04.mp3" },
  { title: "Jangan Paksa Rindu", artist: "Ifan Seventeen", src: "https://adenpedia.my.id/sound/musik05.mp3" },
  { title: "Bersenja Gurau", artist: "Raim Laode", src: "https://adenpedia.my.id/sound/musik06.mp3" },
  { title: "Di Akhir Perang", artist: "Nadin Amizah", src: "https://adenpedia.my.id/sound/musik07.mp3" },
  { title: "Anything", artist: "Adrianne Lenker", src: "https://adenpedia.my.id/sound/musik08.mp3" },
  { title: "Iris", artist: "Goo Goo Dolls", src: "https://adenpedia.my.id/sound/musik09.mp3" },
  { title: "The Winner Takes It All", artist: "ABBA", src: "https://adenpedia.my.id/sound/musik10.mp3" },
];

export default function PlayerPage() {
  const { data, loading, error, search } = usePlayer();
  const [uid, setUid] = useState("");
  const [searched, setSearched] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const sliderTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    sliderTimer.current = setInterval(() => {
      setSlideIdx((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(sliderTimer.current);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      setSongIdx((i) => {
        const next = (i + 1) % PLAYLIST.length;
        setTimeout(() => playSong(next), 100);
        return i;
      });
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
    else audioRef.current.pause();
  }, [playing, songIdx]);

  const playSong = (idx: number) => {
    if (!audioRef.current) return;
    setSongIdx(idx);
    setCurrentTime(0);
    audioRef.current.src = PLAYLIST[idx].src;
    audioRef.current.load();
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = PLAYLIST[songIdx].src;
        audioRef.current.load();
      }
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const goToSlide = (idx: number) => {
    setSlideIdx(idx);
    clearInterval(sliderTimer.current);
    sliderTimer.current = setInterval(() => {
      setSlideIdx((i) => (i + 1) % SLIDES.length);
    }, 5000);
  };

  const handleSearch = async () => {
    if (!uid.trim()) return;
    setSearched(true);
    const result = await search(uid.trim());
    if (result) {
      useStore.getState().addHistory(result);
    }
    if (error) {
      toast("error", error);
    }
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="mx-auto max-w-[720px] space-y-6 px-4 pt-20">

        {/* Banner Slider */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-white/10 animate-slide-up"
          style={{ background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FF3AF2, 16px 16px 0 #FFE600" }}
        >
          <div className="relative h-44 overflow-hidden">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center transition-all duration-700 ${
                  i === slideIdx ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-30 pattern-dots" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
                <span className="material-symbols-outlined relative z-10 text-4xl animate-bounce-subtle" style={{ fontVariationSettings: "'FILL' 1", color: ACCENT_COLORS[i] }}>
                  {slide.icon}
                </span>
                <h2 className={`relative z-10 font-heading text-xl font-black uppercase tracking-wider bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                  {slide.title}
                </h2>
                <p className="relative z-10 text-sm text-white/60">{slide.subtitle}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 pb-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === slideIdx ? "w-8 bg-accent shadow-[0_0_8px_rgba(255,58,242,0.6)]" : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Search Card */}
        <section className="relative overflow-hidden rounded-3xl border-4 border-accent p-6 animate-card-entrance"
          style={{ background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2" }}
        >
          <div className="absolute inset-0 pattern-dots opacity-15" />
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-foreground text-shadow-double">
                🔍 Cek Akun FF
              </h1>
              <p className="mt-1 text-xs text-white/50 font-bold tracking-wider">
                Developer : CodeByTrisno
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors">
                  search
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan UID (maksimal 11 digit)"
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="input-maximal pl-12"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !uid.trim()}
                className="btn-primary flex h-14 w-full items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    MEMUAT...
                  </span>
                ) : (
                  "Cek Profile"
                )}
              </button>
            </div>

            {error && !loading && (
              <div className="mt-4 rounded-xl border-2 border-accent/30 bg-accent/10 p-3 text-center">
                <p className="text-sm font-bold text-accent">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Result Area */}
        {loading && (
          <section className="rounded-3xl border-4 border-quinary p-8 text-center animate-card-entrance"
            style={{ background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FF3AF2" }}
          >
            <div className="pattern-mesh absolute inset-0 opacity-30" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                <div className="absolute inset-[-8px] rounded-3xl border-2 border-accent/30 animate-pulse-ring" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-accent bg-accent/10 animate-glow-breath" style={{ boxShadow: "0 0 30px rgba(255,58,242,0.3)" }}>
                  <span className="material-symbols-outlined text-4xl text-accent animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_top</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground text-shadow-single">Mengambil Data</h3>
                <p className="mt-1 text-sm text-white/50 animate-pulse">Menghubungi server Garena...</p>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-3 w-3 rounded-full" style={{ background: ACCENT_COLORS[i], animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`, boxShadow: `0 0 8px ${ACCENT_COLORS[i]}60` }} />
                ))}
              </div>
              <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-accent via-secondary to-tertiary" style={{ animation: "barSlide 2s ease-in-out infinite", width: "40%", boxShadow: "0 0 12px rgba(255,58,242,0.5)" }} />
              </div>
            </div>
          </section>
        )}

        {!loading && data && (
          <PlayerProfileView data={data} uid={uid || data.uid} />
        )}

        {!loading && !data && !error && searched && (
          <section className="rounded-3xl border-4 border-white/10 p-8 text-center animate-card-entrance"
            style={{ background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)" }}
          >
            <span className="material-symbols-outlined text-5xl text-white/20" style={{ fontVariationSettings: "'FILL' 1" }}>person_off</span>
            <p className="mt-3 font-heading text-lg font-black uppercase tracking-wider text-white/40">Player tidak ditemukan</p>
          </section>
        )}

        {/* Music Playlist */}
        <section className="overflow-hidden rounded-3xl border-4 border-secondary animate-card-entrance"
          style={{ animationDelay: "0.3s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FFE600" }}
        >
          <div className="absolute inset-0 pattern-dots-secondary opacity-15" />
          <div className="relative z-10">
            <div className="border-b-4 border-dashed border-secondary/40 bg-secondary/10 px-6 py-4">
              <h2 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">🎵 Free Fire Vibes Playlist</h2>
            </div>

            <div className="px-4 pt-4">
              <div className={`rounded-xl border-2 border-secondary/30 bg-secondary/10 p-3 text-center text-sm font-bold text-secondary transition-all ${playing ? "opacity-100" : "opacity-0"}`}
                style={{ display: playing || currentTime > 0 ? "block" : "none" }}
              >
                Sedang diputar: {PLAYLIST[songIdx].title} - {PLAYLIST[songIdx].artist}
              </div>
            </div>

            <div className="px-4 pb-2 max-h-80 overflow-y-auto">
              {PLAYLIST.map((song, i) => (
                <div
                  key={i}
                  onClick={() => playSong(i)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all hover:bg-white/[0.06] ${
                    i === songIdx ? "bg-secondary/15 border border-secondary/30" : ""
                  }`}
                >
                  <span className={`w-6 text-center text-sm font-black ${
                    i === songIdx ? "text-secondary" : "text-white/40"
                  }`}>
                    {i === songIdx && playing ? (
                      <span className="inline-flex items-center gap-[2px]">
                        <span className="h-3 w-[2px] bg-secondary animate-[barSlide_0.6s_ease-in-out_infinite_alternate]" />
                        <span className="h-4 w-[2px] bg-secondary animate-[barSlide_0.4s_ease-in-out_infinite_alternate]" />
                        <span className="h-2 w-[2px] bg-secondary animate-[barSlide_0.5s_ease-in-out_infinite_alternate]" />
                      </span>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${i === songIdx ? "text-secondary" : "text-foreground"}`}>{song.title}</p>
                    <p className="text-xs text-white/50 truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-4 py-4 border-t-4 border-dashed border-secondary/40 bg-secondary/5">
              <button onClick={() => playSong((songIdx - 1 + PLAYLIST.length) % PLAYLIST.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 text-white/70 hover:border-secondary hover:text-secondary transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">skip_previous</span>
              </button>
              <button onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-secondary bg-secondary/15 text-secondary hover:bg-secondary/25 transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {playing ? "pause" : "play_arrow"}
                </span>
              </button>
              <button onClick={() => playSong((songIdx + 1) % PLAYLIST.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 text-white/70 hover:border-secondary hover:text-secondary transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">skip_next</span>
              </button>

              <div className="flex-1 mx-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    if (audioRef.current && duration) {
                      audioRef.current.currentTime = pct * duration;
                    }
                  }}
                >
                  <div className="h-full rounded-full bg-secondary transition-all duration-200"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-white/40">volume_up</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.75"
                  onChange={(e) => { if (audioRef.current) audioRef.current.volume = parseFloat(e.target.value); }}
                  className="w-20 accent-accent h-1"
                />
              </div>

              <span className="text-xs font-bold text-white/50 min-w-[40px] text-right">{formatTime(currentTime)}</span>
            </div>
          </div>
          <audio ref={audioRef} preload="none" />
        </section>

      </main>
      <BottomNav />
    </div>
  );
}