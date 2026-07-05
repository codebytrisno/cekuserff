"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/usePlayer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { UID_MIN_LENGTH, UID_MAX_LENGTH } from "@/lib/constants";
import type { PlayerData } from "@/types";

export default function ComparePage() {
  const authed = useAuthGuard();
  const router = useRouter();
  const { search: fetchA, loading: loadingA, error: errorA } = usePlayer();
  const { search: fetchB, loading: loadingB, error: errorB } = usePlayer();

  const [uidA, setUidA] = useState("");
  const [uidB, setUidB] = useState("");
  const [playerA, setPlayerA] = useState<PlayerData | null>(null);
  const [playerB, setPlayerB] = useState<PlayerData | null>(null);

  const handleCompare = useCallback(async () => {
    const a = await fetchA(uidA);
    setPlayerA(a);
    if (!a) return;
    const b = await fetchB(uidB);
    setPlayerB(b);
  }, [uidA, uidB, fetchA, fetchB]);

  const handleSwap = () => {
    setUidA(uidB);
    setUidB(uidA);
    setPlayerA(playerB);
    setPlayerB(playerA);
  };

  const isValidA = uidA.trim().length >= UID_MIN_LENGTH && uidA.trim().length <= UID_MAX_LENGTH;
  const isValidB = uidB.trim().length >= UID_MIN_LENGTH && uidB.trim().length <= UID_MAX_LENGTH;

  const winner = playerA && playerB ? getWinner(playerA, playerB) : null;

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar />

      <main className="mx-auto max-w-container-max px-4 pt-20">
        {/* Input Section */}
        <section className="mb-6 mt-4">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <div className="relative w-full group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan UID Player 1"
                value={uidA}
                onChange={(e) => setUidA(e.target.value.replace(/\D/g, "").slice(0, UID_MAX_LENGTH))}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-4 font-body-md text-[14px] text-on-surface outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-[12px] text-on-surface-variant">
                Player A
              </span>
            </div>
            <div className="vs-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-surface shadow-lg z-10">
              <span className="text-sm font-bold italic text-white">VS</span>
            </div>
            <div className="relative w-full group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan UID Player 2"
                value={uidB}
                onChange={(e) => setUidB(e.target.value.replace(/\D/g, "").slice(0, UID_MAX_LENGTH))}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-4 font-body-md text-[14px] text-on-surface outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-[12px] text-on-surface-variant">
                Player B
              </span>
            </div>
          </div>
          <button
            disabled={!isValidA || !isValidB || loadingA || loadingB}
            onClick={handleCompare}
            className="mt-4 w-full rounded-xl bg-primary-container py-3 font-bold text-on-primary-container shadow-lg shadow-primary-container/20 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {loadingA || loadingB ? "Memuat..." : "Bandingkan Sekarang"}
          </button>
          {(errorA || errorB) && (
            <p className="mt-2 text-center text-[14px] text-error">
              {errorA || errorB}
            </p>
          )}
        </section>

        {/* Stats Comparison */}
        {playerA && playerB && (
          <section className="space-y-2">
            {/* Comparison Grid Header */}
            <div className="mb-base grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-highest text-sm font-bold text-primary">
                  {playerA.name.charAt(0)}
                </div>
                <div>
                  <p className="font-headline-h3 text-[16px] font-semibold text-on-surface leading-none">{playerA.name}</p>
                  <p className="font-label-sm text-[12px] text-on-surface-variant">ID: {playerA.uid}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 text-right">
                <div className="text-right">
                  <p className="font-headline-h3 text-[16px] font-semibold text-on-surface leading-none">{playerB.name}</p>
                  <p className="font-label-sm text-[12px] text-on-surface-variant">ID: {playerB.uid}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-secondary-container bg-surface-container-highest text-sm font-bold text-secondary">
                  {playerB.name.charAt(0)}
                </div>
              </div>
            </div>

            {/* Stat Rows */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-card space-y-5 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/60">Pertempuran</p>
                <StatCompareRow
                  label="K/D RATIO"
                  valueA={String(playerA.kd)}
                  valueB={String(playerB.kd)}
                  pctA={Math.min((playerA.kd / 10) * 100, 100)}
                  pctB={Math.min((playerB.kd / 10) * 100, 100)}
                  aWins={playerA.kd > playerB.kd}
                />
                <StatCompareRow
                  label="TOTAL KILLS"
                  valueA={playerA.kills.toLocaleString()}
                  valueB={playerB.kills.toLocaleString()}
                  pctA={Math.min((playerA.kills / Math.max(playerA.kills, playerB.kills)) * 100, 100)}
                  pctB={Math.min((playerB.kills / Math.max(playerA.kills, playerB.kills)) * 100, 100)}
                  aWins={playerA.kills > playerB.kills}
                />
                <StatCompareRow
                  label="TOTAL MATCHES"
                  valueA={playerA.totalMatches.toLocaleString()}
                  valueB={playerB.totalMatches.toLocaleString()}
                  pctA={Math.min((playerA.totalMatches / Math.max(playerA.totalMatches, playerB.totalMatches)) * 100, 100)}
                  pctB={Math.min((playerB.totalMatches / Math.max(playerA.totalMatches, playerB.totalMatches)) * 100, 100)}
                  aWins={playerA.totalMatches > playerB.totalMatches}
                />
                <StatCompareRow
                  label="DAMAGE"
                  valueA={playerA.brDamage.toLocaleString()}
                  valueB={playerB.brDamage.toLocaleString()}
                  pctA={Math.min((playerA.brDamage / Math.max(playerA.brDamage, playerB.brDamage)) * 100, 100)}
                  pctB={Math.min((playerB.brDamage / Math.max(playerA.brDamage, playerB.brDamage)) * 100, 100)}
                  aWins={playerA.brDamage > playerB.brDamage}
                />
                <StatCompareRow
                  label="HIGHEST KILLS"
                  valueA={String(playerA.brHighestKills)}
                  valueB={String(playerB.brHighestKills)}
                  pctA={Math.min((playerA.brHighestKills / Math.max(playerA.brHighestKills, playerB.brHighestKills)) * 100, 100)}
                  pctB={Math.min((playerB.brHighestKills / Math.max(playerA.brHighestKills, playerB.brHighestKills)) * 100, 100)}
                  aWins={playerA.brHighestKills > playerB.brHighestKills}
                />
              </div>

              <div className="glass-card space-y-5 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/60">Akurasi & Rank</p>
                <StatCompareRow
                  label="WIN RATE"
                  valueA={`${playerA.brWinRate}%`}
                  valueB={`${playerB.brWinRate}%`}
                  pctA={playerA.brWinRate}
                  pctB={playerB.brWinRate}
                  aWins={playerA.brWinRate > playerB.brWinRate}
                />
                <StatCompareRow
                  label="HEADSHOT %"
                  valueA={`${playerA.kills > 0 ? ((playerA.headshots / playerA.kills) * 100).toFixed(1) : 0}%`}
                  valueB={`${playerB.kills > 0 ? ((playerB.headshots / playerB.kills) * 100).toFixed(1) : 0}%`}
                  pctA={Math.min(playerA.kills > 0 ? (playerA.headshots / playerA.kills) * 100 : 0, 100)}
                  pctB={Math.min(playerB.kills > 0 ? (playerB.headshots / playerB.kills) * 100 : 0, 100)}
                  aWins={playerA.kills > 0 && playerB.kills > 0 ? (playerA.headshots / playerA.kills) > (playerB.headshots / playerB.kills) : playerA.headshots > playerB.headshots}
                />
                <StatCompareRow
                  label="LEVEL"
                  valueA={String(playerA.level)}
                  valueB={String(playerB.level)}
                  pctA={Math.min((playerA.level / 100) * 100, 100)}
                  pctB={Math.min((playerB.level / 100) * 100, 100)}
                  aWins={playerA.level > playerB.level}
                />
                <StatCompareRow
                  label="RANK POINTS"
                  valueA={String(playerA.rankPoints)}
                  valueB={String(playerB.rankPoints)}
                  pctA={Math.min((playerA.rankPoints / Math.max(playerA.rankPoints, playerB.rankPoints)) * 100, 100)}
                  pctB={Math.min((playerB.rankPoints / Math.max(playerA.rankPoints, playerB.rankPoints)) * 100, 100)}
                  aWins={playerA.rankPoints > playerB.rankPoints}
                />
                <StatCompareRow
                  label="CS RANK"
                  valueA={`#${playerA.csRank}`}
                  valueB={`#${playerB.csRank}`}
                  pctA={Math.min(((playerA.csMaxRank - playerA.csRank) / Math.max(playerA.csMaxRank, 1)) * 100, 100)}
                  pctB={Math.min(((playerB.csMaxRank - playerB.csRank) / Math.max(playerB.csMaxRank, 1)) * 100, 100)}
                  aWins={playerA.csRank > 0 && playerB.csRank > 0 ? playerA.csRank < playerB.csRank : playerA.csRankPoints > playerB.csRankPoints}
                />
              </div>
            </div>

            {/* Winner Summary */}
            {winner && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 text-primary-container">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div>
                    <p className="font-headline-h3 text-[16px] font-semibold text-on-surface leading-tight">
                      {winner.text}
                    </p>
                    <p className="font-label-sm text-[12px] text-on-surface-variant">{winner.subtext}</p>
                  </div>
                </div>
                <div className="text-primary-container">
                  <span className="material-symbols-outlined text-3xl">trending_up</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Insights */}
        {playerA && playerB && (
          <section className="mt-xl grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-headline-h3 mb-2 text-[16px] font-semibold text-on-surface">Perbandingan Terbaru</h3>
              <div className="space-y-2">
                {[`${playerA.name} vs ${playerB.name}`, `${playerB.name} vs ${playerA.name}`].map((pair, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface-container p-2"
                  >
                    <span className="font-body-md text-[14px]">{pair}</span>
                    <span className="material-symbols-outlined text-on-surface-variant">history</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-primary-container/30 bg-gradient-to-br from-primary-container/20 to-transparent p-4">
              <h3 className="font-headline-h3 mb-2 text-[16px] font-semibold text-on-surface">Wawasan Pro</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant">
                {winner?.insight || "Bandingkan dua player untuk mendapatkan wawasan."}
              </p>
              <div className="mt-4 flex gap-1">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {playerA.kd > playerB.kd ? "AGGRESSIVE" : "TACTICAL"}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {playerA.headshots > playerB.headshots ? "SNIPER" : "SUPPORT"}
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function StatCompareRow({
  label,
  valueA,
  valueB,
  pctA,
  pctB,
  aWins,
}: {
  label: string;
  valueA: string;
  valueB: string;
  pctA: number;
  pctB: number;
  aWins: boolean;
}) {
  return (
    <div>
      <div className="mb-xs flex items-end justify-between">
        <div className="flex items-center gap-1">
          <span className="font-display-stats text-[28px] font-bold text-primary">{valueA}</span>
          {aWins && (
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          )}
        </div>
        <p className="font-label-sm text-[12px] uppercase tracking-widest text-on-surface-variant">{label}</p>
        <div className="flex items-center gap-1">
          {!aWins && (
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          )}
          <span className="font-display-stats text-[28px] font-bold text-on-surface">{valueB}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="stat-bar-container flex-1">
          <div className="h-full rounded-r-full bg-primary-container" style={{ width: `${pctA}%` }} />
        </div>
        <div className="stat-bar-container flex-1">
          <div className="ml-auto h-full rounded-l-full bg-surface-variant" style={{ width: `${pctB}%` }} />
        </div>
      </div>
    </div>
  );
}

function getWinner(a: PlayerData, b: PlayerData): { text: string; subtext: string; insight: string } | null {
  const aHsPct = a.kills > 0 ? a.headshots / a.kills : 0;
  const bHsPct = b.kills > 0 ? b.headshots / b.kills : 0;

  const cats: Array<{ a: number; b: number; label: string }> = [
    { a: a.kd, b: b.kd, label: "K/D" },
    { a: a.kills, b: b.kills, label: "Kills" },
    { a: a.brWinRate, b: b.brWinRate, label: "Win Rate" },
    { a: aHsPct, b: bHsPct, label: "Headshot %" },
    { a: a.level, b: b.level, label: "Level" },
    { a: a.rankPoints, b: b.rankPoints, label: "Rank Points" },
    { a: a.brDamage, b: b.brDamage, label: "Damage" },
    { a: a.brHighestKills, b: b.brHighestKills, label: "Highest Kills" },
  ];

  let scoreA = 0, scoreB = 0;
  const diffs: string[] = [];
  for (const c of cats) {
    if (c.a > c.b) { scoreA++; diffs.push(`${c.label}: ${c.a > c.b ? c.a : c.b}`); }
    else if (c.b > c.a) { scoreB++; }
  }

  if (scoreA > scoreB) {
    return {
      text: `${a.name} unggul ${scoreA}-${scoreB}`,
      subtext: `${a.name} menang di ${scoreA} dari ${cats.length} kategori.`,
      insight: `${a.name} unggul dalam ${diffs.slice(0, 3).join(", ")}.`,
    };
  }
  if (scoreB > scoreA) {
    return {
      text: `${b.name} unggul ${scoreB}-${scoreA}`,
      subtext: `${b.name} menang di ${scoreB} dari ${cats.length} kategori.`,
      insight: `Analisis menunjukkan ${b.name} memiliki performa lebih konsisten secara keseluruhan.`,
    };
  }
  return {
    text: "Hasil imbang!",
    subtext: `${scoreA}-${scoreA} dari ${cats.length} kategori.`,
    insight: "Kedua player memiliki performa yang sebanding. Fokus pada pelatihan situasional.",
  };
}
