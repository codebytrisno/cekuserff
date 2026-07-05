"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/usePlayer";
import { useStore } from "@/lib/store";

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

      // Background
      ctx.fillStyle = "#1d100c";
      ctx.fillRect(0, 0, W, H);

      // Helper
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

      // Avatar circle
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

      // Name & Status
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#f7ddd5";
      ctx.font = "bold 52px Inter, sans-serif";
      const nameW = ctx.measureText(displayData.name).width;
      ctx.fillText(displayData.name, 260, 110);

      // Status badge
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

      // UID
      ctx.textBaseline = "top";
      ctx.fillStyle = "#e1bfb5";
      ctx.font = "28px Inter, sans-serif";
      ctx.fillText(`UID: ${displayData.uid}`, 260, 175);

      // Server & Guild
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

      // Divider
      ctx.strokeStyle = "rgba(89,65,57,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 310);
      ctx.lineTo(W - 80, 310);
      ctx.stroke();

      // Stats grid
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

      // Extra info
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

      // Footer divider
      ctx.strokeStyle = "rgba(89,65,57,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 740);
      ctx.lineTo(W - 80, 740);
      ctx.stroke();

      // Footer
      ctx.fillStyle = "#ff6b35";
      ctx.font = "bold 32px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("CEKUSERFF", 80, 800);

      ctx.fillStyle = "#a98a80";
      ctx.font = "22px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("codebytrisno.vercel.app", W - 80, 800);

      // Convert to blob
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
      <div className="min-h-screen bg-background pb-24">
        <TopAppBar showBookmark showShare />
        <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
          <Skeleton />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopAppBar showBookmark showShare />
        <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
          <div className="mt-16 text-center">
            <p className="text-[16px] font-semibold text-error">{error}</p>
            <button onClick={() => search(uid)} className="mt-4 rounded-xl bg-primary-container px-6 py-3 text-[16px] font-semibold text-on-primary-container">
              Coba Lagi
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!displayData) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showBookmark showShare isBookmarked={isBookmarked} onBookmark={handleBookmark} onShare={handleShare} />

      <main className="mx-auto max-w-container-max space-y-6 px-4 pt-20">
        {/* Hero */}
        <section className="glass-card-light relative overflow-hidden rounded-xl p-6">
          <div className="absolute -top-10 right-0 h-32 w-32 -z-10 blur-3xl bg-primary/10" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-primary-container bg-surface-variant p-1 text-2xl font-bold text-primary">
                {displayData.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-h1-mobile text-[20px] font-bold text-on-surface truncate">{displayData.name}</h1>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${displayData.isBanned ? "bg-error/20 text-error" : "bg-primary/10 text-primary"}`}>
                  {displayData.isBanned ? "Banned" : "Aktif"}
                </span>
                {cached && (
                  <button onClick={handleRefresh} className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold text-primary-container/60 transition-colors hover:text-primary-container">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'wght' 500" }}>refresh</span>
                    Refresh
                  </button>
                )}
              </div>
              <p className="font-body-md text-[14px] text-on-surface-variant opacity-80">UID: {displayData.uid}</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-sm text-[12px] text-primary">{displayData.server}</span>
                {displayData.guild && <span className="font-label-sm text-[12px] text-on-surface-variant">Guild: {displayData.guild}</span>}
              </div>
              {displayData.signature && (
                <p className="mt-1 text-[12px] text-on-surface-variant italic opacity-70">"{displayData.signature}"</p>
              )}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBox label="Level" value={String(displayData.level)} />
          <StatBox label="EXP" value={displayData.exp.toLocaleString()} />
          <StatBox label="Rank Points" value={displayData.rankPoints.toLocaleString()} highlight />
          <StatBox label="CS Rank Points" value={displayData.csRankPoints.toLocaleString()} />
          <StatBox label="Max Rank" value={`#${displayData.maxRank}`} />
          <StatBox label="CS Max Rank" value={`#${displayData.csMaxRank}`} />
          <StatBox label="Likes" value={displayData.liked.toLocaleString()} />
          <StatBox label="Badges" value={String(displayData.badges)} />
        </section>

        {/* BR Stats */}
        {displayData.totalMatches > 0 && (
          <section className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">stadia_controller</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Performa Battle Royale</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
              <StatBox label="Matches" value={displayData.totalMatches.toLocaleString()} />
              <StatBox label="Wins" value={displayData.brWins.toLocaleString()} />
              <StatBox label="K/D" value={String(displayData.kd)} highlight />
              <StatBox label="Win Rate" value={`${displayData.brWinRate}%`} />
              <StatBox label="Kills" value={displayData.brKills.toLocaleString()} />
              <StatBox label="Deaths" value={displayData.brDeaths.toLocaleString()} />
              <StatBox label="Headshots" value={displayData.brHeadshots.toLocaleString()} />
              <StatBox label="HS Kills" value={displayData.brHeadshotKills.toLocaleString()} />
              <StatBox label="Damage" value={displayData.brDamage.toLocaleString()} />
              <StatBox label="Highest Kills" value={String(displayData.brHighestKills)} />
              <StatBox label="Revives" value={displayData.brRevives.toLocaleString()} />
              <StatBox label="Top N" value={displayData.brTopN.toLocaleString()} />
            </div>
          </section>
        )}

        {/* CS Stats */}
        {displayData.csMatches > 0 && (
          <section className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">sports_kabaddi</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Performa Clash Squad</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
              <StatBox label="Matches" value={displayData.csMatches.toLocaleString()} />
              <StatBox label="Wins" value={displayData.csWins.toLocaleString()} />
              <StatBox label="Kills" value={displayData.csKills.toLocaleString()} />
            </div>
          </section>
        )}

        {/* Rank Card */}
        <section className="glass-card rounded-xl border border-primary/20 p-6 rank-glow">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-high p-2">
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-container">
                  {displayData.rank.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-headline-h2 text-[20px] font-semibold text-on-surface">{displayData.rank} Tier</h3>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Skor Rank: {displayData.rankPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-[12px] uppercase text-on-surface-variant">Tier Selanjutnya</p>
              <p className="font-headline-h3 text-[16px] font-semibold text-primary">{getNextRank(displayData.rank)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between px-1 text-xs text-on-surface-variant">
              <span>Progres ke {getNextRank(displayData.rank)}</span>
              <span>{displayData.rankMaxPoints > 0 ? Math.round((displayData.rankPoints / displayData.rankMaxPoints) * 100) : 100}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary-fixed-dim transition-all duration-1000"
                style={{ width: `${displayData.rankMaxPoints > 0 ? Math.min((displayData.rankPoints / displayData.rankMaxPoints) * 100, 100) : 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Guild Card */}
        {displayData.guild && (
          <section className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">groups</span>
              <h3 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Guild</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Nama</p>
                <p className="font-body-md text-[14px] font-semibold text-on-surface">{displayData.guild}</p>
              </div>
              <div>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Level</p>
                <p className="font-body-md text-[14px] font-semibold text-on-surface">{displayData.clanLevel}</p>
              </div>
              <div>
                <p className="font-label-sm text-[12px] text-on-surface-variant">Anggota</p>
                <p className="font-body-md text-[14px] font-semibold text-on-surface">{displayData.clanMembers} / {displayData.clanCapacity}</p>
              </div>
            </div>
          </section>
        )}

        {/* Profile Details */}
        <section className="glass-card overflow-hidden rounded-xl">
          <div className="border-b border-outline-variant bg-surface-container-high p-4">
            <h4 className="font-headline-h3 text-[16px] font-semibold text-on-surface">Detail Profil</h4>
          </div>
          <div className="divide-y divide-outline-variant">
            <DetailRow icon="calendar_month" label="Usia Akun" value={displayData.accountAge} />
            {displayData.accountCreatedAt && <DetailRow icon="calendar_today" label="Dibuat" value={displayData.accountCreatedAt} />}
            <DetailRow icon="schedule" label="Terakhir Aktif" value={displayData.lastActive} highlight />
            <DetailRow icon="stadia_controller" label="Rilis" value={displayData.releaseVersion || "N/A"} />
            {displayData.title && <DetailRow icon="badge" label="ID Title" value={`#${displayData.title}`} />}
            <DetailRow icon="credit_score" label="Skor Kredit" value={String(displayData.creditScore)} highlight />
            <DetailRow icon="diamond" label="Biaya Diamond" value={displayData.diamondCost > 0 ? String(displayData.diamondCost) : "N/A"} />
            <DetailRow icon="pet_supplies" label="Level Pet" value={displayData.petLevel > 0 ? `Lv.${displayData.petLevel}` : "Tidak Ada"} />
            <DetailRow icon="event" label="Season" value={displayData.seasonId ? `Season ${displayData.seasonId}` : "N/A"} />
            {displayData.primeLevel > 0 && <DetailRow icon="workspace_premium" label="Level Prime" value={`Level ${displayData.primeLevel}`} highlight />}
            {displayData.petId && <DetailRow icon="pets" label="ID Pet" value={displayData.petId} />}
            {displayData.weaponSkins.length > 0 && <DetailRow icon="military_tech" label="Skin Weapon" value={`${displayData.weaponSkins.length} terpasang`} />}
            {displayData.clothes.length > 0 && <DetailRow icon="checkroom" label="Outfit" value={`${displayData.clothes.length} item`} />}
            {displayData.skills.length > 0 && <DetailRow icon="psychology" label="Skill" value={`${displayData.skills.length} aktif`} />}
            {displayData.language && <DetailRow icon="language" label="Language" value={displayData.language.replace("Language_", "")} />}
            <DetailRow
              icon="gavel"
              label="Status Ban"
              value={displayData.isBanned ? `Banned (${displayData.banPeriod}h)` : "Bersih"}
              highlight={!displayData.isBanned}
              error={displayData.isBanned}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-1 gap-4">
          <button onClick={() => router.push(`/compare?uid=${uid}`)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-container text-[16px] font-semibold text-on-primary-container transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">compare_arrows</span>
            Bandingkan dengan Stat Saya
          </button>
          <button onClick={handleShare} disabled={shared}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-variant text-[16px] font-semibold text-on-surface transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">share_reviews</span>
            Bagikan Kartu Profil
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`glass-card flex flex-col justify-center rounded-xl p-4 ${highlight ? "border-l-4 border-l-primary-container" : ""}`}>
      <span className="font-label-sm mb-1 text-[12px] uppercase tracking-tight text-on-surface-variant">{label}</span>
      <span className={`font-display-stats text-[28px] font-bold ${highlight ? "text-primary-container" : "text-on-surface"}`}>{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, error }: { icon: string; label: string; value: string; highlight?: boolean; error?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        <span className="font-body-md text-[14px]">{label}</span>
      </div>
      <span className={`font-body-md text-[14px] font-bold ${error ? "text-error" : highlight ? "text-[#00D68F]" : "text-on-surface"}`}>
        {value}
      </span>
    </div>
  );
}

function getNextRank(rank: string): string {
  const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"];
  const idx = ranks.indexOf(rank);
  if (idx === -1 || idx >= ranks.length - 1) return "MAX";
  return ranks[idx + 1];
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 w-full rounded-xl bg-surface-container-high" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-xl bg-surface-container-high" />)}
      </div>
      <div className="h-32 rounded-xl bg-surface-container-high" />
      <div className="h-48 rounded-xl bg-surface-container-high" />
    </div>
  );
}
