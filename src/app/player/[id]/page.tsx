"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { PlayerProfileView } from "@/components/PlayerProfileView";
import { toast } from "@/components/Toast";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.id as string;

  const { data, loading, error, search } = usePlayer();
  const bookmarks = useStore((s) => s.bookmarks);
  const addBookmark = useStore((s) => s.addBookmark);
  const removeBookmark = useStore((s) => s.removeBookmark);
  const playerCache = useStore((s) => s.playerCache);
  const setPlayerCache = useStore((s) => s.setPlayerCache);
  const [shared, setShared] = useState(false);
  const [cached, setCached] = useState(false);

  const isBookmarked = bookmarks.some((b) => b.uid === uid);

  useEffect(() => {
    if (playerCache[uid] && !data && !loading && !error) {
      setCached(true);
      return;
    }
    if (!playerCache[uid]) {
      setCached(false);
      search(uid).then((d) => { if (d) setPlayerCache(uid, d); });
    }
  }, [uid]);

  useEffect(() => {
    if (error) toast("error", error);
  }, [error]);

  const handleRefresh = async () => {
    setCached(false);
    const d = await search(uid);
    if (d) setPlayerCache(uid, d);
  };

  const displayData = playerCache[uid] || data;

  const handleBookmark = () => {
    if (!displayData) return;
    if (isBookmarked) removeBookmark(uid);
    else addBookmark(displayData);
  };

  const handleShare = async () => {
    if (!displayData) return;
    setShared(true);
    try {
      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#1d100c";
      ctx.fillRect(0, 0, W, H);

      const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      const avatarX = 80, avatarY = 100, avatarR = 90;
      ctx.beginPath();
      ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = "#352722";
      ctx.fill();
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = "#ff6b35";
      ctx.font = "bold 72px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayData.name.charAt(0), avatarX + avatarR, avatarY + avatarR);

      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#f7ddd5";
      ctx.font = "bold 52px Inter, sans-serif";
      const nameW = ctx.measureText(displayData.name).width;
      ctx.fillText(displayData.name, 260, 110);

      const statusBg = displayData.isBanned ? "rgba(147,0,10,0.2)" : "rgba(255,107,53,0.1)";
      const statusColor = displayData.isBanned ? "#ffb4ab" : "#ff6b35";
      const statusText = displayData.isBanned ? "Banned" : "Active";
      ctx.font = "bold 24px Inter, sans-serif";
      const sw = ctx.measureText(statusText).width;
      roundRect(260 + nameW + 20, 115, sw + 32, 36, 8);
      ctx.fillStyle = statusBg;
      ctx.fill();
      ctx.fillStyle = statusColor;
      ctx.textBaseline = "middle";
      ctx.fillText(statusText, 260 + nameW + 36, 133);

      ctx.textBaseline = "top";
      ctx.fillStyle = "#e1bfb5";
      ctx.font = "28px Inter, sans-serif";
      ctx.fillText(`UID: ${displayData.uid}`, 260, 175);

      ctx.font = 'bold 24px Inter, sans-serif';
      const serverW = ctx.measureText(displayData.server).width;
      roundRect(260, 220, serverW + 24, 34, 6);
      ctx.fillStyle = "#41312c";
      ctx.fill();
      ctx.fillStyle = "#ff6b35";
      ctx.textBaseline = "middle";
      ctx.fillText(displayData.server, 272, 237);

      if (displayData.guild) {
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e1bfb5";
        ctx.font = "24px Inter, sans-serif";
        ctx.fillText(`Guild: ${displayData.guild}`, 260 + serverW + 44, 237);
      }

      ctx.strokeStyle = "rgba(89,65,57,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 310);
      ctx.lineTo(W - 80, 310);
      ctx.stroke();

      const stats = [
        { label: "Level", value: String(displayData.level) },
        { label: "Rank", value: displayData.rank, highlight: true },
        { label: "K/D", value: String(displayData.kd), highlight: true },
        { label: "Rank Points", value: displayData.rankPoints.toLocaleString() },
        { label: "Likes", value: displayData.liked.toLocaleString() },
        { label: "Badges", value: String(displayData.badges) },
      ];

      const cols = 3, gap = 20, cellW = (W - 160 - gap * (cols - 1)) / cols;
      stats.forEach((s, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 80 + col * (cellW + gap);
        const y = 350 + row * 140;

        roundRect(x, y, cellW, 120, 16);
        ctx.fillStyle = s.highlight ? "#2a1c18" : "#2a1c18";
        ctx.fill();

        if (s.highlight) {
          ctx.fillStyle = "#ff6b35";
          ctx.fillRect(x, y, 6, 120);
        }

        ctx.fillStyle = "#e1bfb5";
        ctx.font = "20px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(s.label.toUpperCase(), x + cellW / 2, y + 20);

        ctx.fillStyle = s.highlight ? "#ff6b35" : "#f7ddd5";
        ctx.font = "bold 44px Inter, sans-serif";
        ctx.textBaseline = "bottom";
        ctx.fillText(s.value, x + cellW / 2, y + 110);
      });

      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#e1bfb5";
      ctx.font = "24px Inter, sans-serif";

      const extras: string[] = [`EXP: ${displayData.exp.toLocaleString()}`];
      if (displayData.guild) extras.push(`Guild Lv.${displayData.clanLevel}`);
      if (displayData.accountAge) extras.push(displayData.accountAge);
      if (displayData.releaseVersion) extras.push(displayData.releaseVersion);

      let extraX = 80;
      extras.forEach((e, i) => {
        if (i > 0) {
          ctx.fillStyle = "#594139";
          ctx.fillText("•", extraX, 660);
          extraX += ctx.measureText("•").width + 16;
        }
        ctx.fillStyle = "#e1bfb5";
        ctx.fillText(e, extraX, 660);
        extraX += ctx.measureText(e).width + 16;
      });

      ctx.strokeStyle = "rgba(89,65,57,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 740);
      ctx.lineTo(W - 80, 740);
      ctx.stroke();

      ctx.fillStyle = "#ff6b35";
      ctx.font = "bold 32px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("CEKUSERFF", 80, 800);

      ctx.fillStyle = "#a98a80";
      ctx.font = "22px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("codebytrisno.vercel.app", W - 80, 800);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9));
      if (blob) {
        const file = new File([blob], `${displayData.uid}-profile.jpg`, { type: "image/jpeg" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `${displayData.name} - CEKUSERFF`, files: [file] });
          setShared(false);
          return;
        }
      }

      await navigator.share({
        title: `${displayData.name} - CEKUSERFF`,
        text: `Cek stat ${displayData.name} di CEKUSERFF!\nRank: ${displayData.rank} | Level: ${displayData.level}`,
        url: window.location.href,
      });
    } catch {}
    setShared(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] pb-24 pattern-dots">
        <TopAppBar showBookmark showShare />
        <main className="mx-auto max-w-container-max px-4 pt-20">
          <LoadingAnimation />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] pb-24 pattern-dots">
        <TopAppBar showBookmark showShare />
        <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
          <div className="mt-16 text-center">
            <div className="glass-card rounded-3xl border-4 border-[#FF3AF2] p-8 text-center" style={{ boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2" }}>
              <span className="material-symbols-outlined mb-4 text-6xl text-[#FF3AF2]">error</span>
              <p className="font-heading text-lg font-black uppercase tracking-wider text-white text-shadow-single">{error}</p>
              <button onClick={() => search(uid)} className="btn-primary mt-6 rounded-full border-4 border-[#00F5D4] bg-[#00F5D4] px-8 py-3 font-black uppercase tracking-wider text-[#0D0D1A] transition-all hover:scale-105 active:scale-95" style={{ boxShadow: "4px 4px 0 #7B2FFF, 8px 8px 0 #FF3AF2" }}>
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!displayData) return null;

  return (
    <div className="min-h-screen bg-[#0D0D1A] pb-32 pattern-dots">
      <TopAppBar showBookmark showShare isBookmarked={isBookmarked} onBookmark={handleBookmark} onShare={handleShare} />

      <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
        <PlayerProfileView data={displayData} uid={uid} />

        <section className="grid grid-cols-1 gap-4">
          <button onClick={() => router.push(`/compare?uid=${uid}`)}
            className="btn-primary flex h-14 items-center justify-center gap-3 rounded-full border-4 border-[#FFE600] bg-[#FFE600] font-black uppercase tracking-wider text-[#0D0D1A] transition-all hover:scale-105 active:scale-95"
            style={{ boxShadow: "4px 4px 0 #FF6B35, 8px 8px 0 #FF3AF2" }}
          >
            <span className="material-symbols-outlined text-xl">compare_arrows</span>
            Bandingkan dengan Stat Saya
          </button>
          <button onClick={handleShare} disabled={shared}
            className="btn-secondary flex h-14 items-center justify-center gap-3 rounded-full border-4 border-[#7B2FFF] bg-transparent font-black uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95"
            style={{ boxShadow: "4px 4px 0 #FF3AF2, 8px 8px 0 #00F5D4" }}
          >
            <span className="material-symbols-outlined text-xl">share_reviews</span>
            Bagikan Kartu Profil
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}


function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: ACCENT_COLORS[i % ACCENT_COLORS.length],
              animation: `particle-float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#FF3AF2]/20" />
        <div className="absolute inset-[-8px] rounded-3xl border-2 border-[#FF3AF2]/30 animate-pulse-ring" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[#FF3AF2] bg-gradient-to-br from-[#FF3AF2]/30 to-[#7B2FFF]/30 animate-glow-breath" style={{ boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2" }}>
          <span className="material-symbols-outlined text-5xl text-[#FF3AF2] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
        </div>
      </div>

      <h3 className="font-heading text-xl font-black uppercase tracking-wider text-white text-shadow-double animate-neon-flicker">Mencari Pemain</h3>
      <p className="mt-2 text-sm text-white/60 animate-pulse">Menghubungi server Garena...</p>

      <div className="mt-8 flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3.5 w-3.5 rounded-full"
            style={{
              backgroundColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
              animation: `loadingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              boxShadow: `0 0 8px ${ACCENT_COLORS[i % ACCENT_COLORS.length]}60`,
            }}
          />
        ))}
      </div>

      <div className="mt-8 h-2 w-60 overflow-hidden rounded-full border border-white/10 bg-white/5">
        <div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${ACCENT_COLORS[0]}, ${ACCENT_COLORS[1]}, ${ACCENT_COLORS[2]}, ${ACCENT_COLORS[3]}, ${ACCENT_COLORS[4]})`,
            animation: "loadingBar 2s ease-in-out infinite",
            width: "40%",
            boxShadow: "0 0 12px rgba(255,58,242,0.5)",
          }}
        />
      </div>

      <div className="mt-8 space-y-4 text-left w-full max-w-sm">
        {[
          { label: "Memvalidasi UID", done: true },
          { label: "Menghubungi server Garena", done: false, active: true },
          { label: "Mengambil data player", done: false },
          { label: "Memproses statistik", done: false },
        ].map((step, i) => (
          <div key={i} className="glass-card flex items-center gap-4 rounded-2xl border-2 border-white/10 p-4 animate-stagger transition-all" style={{ borderColor: step.done ? "#00F5D4" : step.active ? "#FF3AF2" : "rgba(255,255,255,0.1)", animationDelay: `${i * 0.12}s` }}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black transition-all ${
              step.done
                ? "border-2 border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4]"
                : step.active
                  ? "border-2 border-[#FF3AF2] bg-[#FF3AF2]/20 text-[#FF3AF2] animate-pulse-ring"
                  : "border-2 border-white/20 bg-white/5 text-white/40"
            }`}>
              {step.done ? (
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              ) : step.active ? (
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#FF3AF2]" />
              ) : (
                <span className="text-xs">{i + 1}</span>
              )}
            </div>
            <span className={`text-sm font-semibold ${
              step.done
                ? "text-[#00F5D4]"
                : step.active
                  ? "text-white"
                  : "text-white/40"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes loadingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(250%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
