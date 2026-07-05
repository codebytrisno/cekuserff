"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/usePlayer";
import { UID_MIN_LENGTH, UID_MAX_LENGTH } from "@/lib/constants";
import type { PlayerData } from "@/types";

export default function ComparePage() {
  const router = useRouter();
  const { search: fetchA, loading: loadingA, error: errorA } = usePlayer();
  const { search: fetchB, loading: loadingB, error: errorB } = usePlayer();

  const [uidA, setUidA] = useState("");
  const [uidB, setUidB] = useState("");
  const [playerA, setPlayerA] = useState<PlayerData | null>(null);
  const [playerB, setPlayerB] = useState<PlayerData | null>(null);

  const handleCompare = useCallback(async () => {
    const [a, b] = await Promise.all([fetchA(uidA), fetchB(uidB)]);
    setPlayerA(a);
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
            <div className="glass-card space-y-6 rounded-xl p-4">
              <StatCompareRow
                label="K/D RATIO"
                valueA={String(playerA.kd)}
                valueB={String(playerB.kd)}
                pctA={(playerA.kd / 10) * 100}
                pctB={(playerB.kd / 10) * 100}
                aWins={playerA.kd > playerB.kd}
              />
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
                valueA={`${playerA.headshots}%`}
                valueB={`${playerB.headshots}%`}
                pctA={playerA.headshots}
                pctB={playerB.headshots}
                aWins={playerA.headshots > playerB.headshots}
              />
              <StatCompareRow
                label="LEVEL"
                valueA={String(playerA.level)}
                valueB={String(playerB.level)}
                pctA={(playerA.level / 100) * 100}
                pctB={(playerB.level / 100) * 100}
                aWins={playerA.level > playerB.level}
              />
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
  let scoreA = 0;
  let scoreB = 0;

  if (a.kd > b.kd) scoreA++;
  else if (b.kd > a.kd) scoreB++;

  if (a.headshots > b.headshots) scoreA++;
  else if (b.headshots > a.headshots) scoreB++;

  if (a.brWinRate > b.brWinRate) scoreA++;
  else if (b.brWinRate > a.brWinRate) scoreB++;

  if (a.level > b.level) scoreA++;
  else if (b.level > a.level) scoreB++;

  if (scoreA > scoreB) {
    return {
      text: `${a.name} unggul di ${scoreA} kategori`,
      subtext: "Performa keseluruhan lebih stabil.",
      insight: `${a.name} memiliki rasio K/D ${Math.round(Math.abs(a.kd - b.kd) * 100) / 100} lebih tinggi dari rata-rata. Fokus pada pertempuran jarak menengah.`,
    };
  }
  if (scoreB > scoreA) {
    return {
      text: `${b.name} unggul di ${scoreB} kategori`,
      subtext: "Performa keseluruhan lebih stabil.",
      insight: `${b.name} memiliki rasio K/D ${Math.round(Math.abs(b.kd - a.kd) * 100) / 100} lebih tinggi dari rata-rata. Fokus pada pertempuran jarak menengah.`,
    };
  }
  return {
    text: "Hasil imbang!",
    subtext: "Kedua player memiliki performa yang setara.",
    insight: "Kedua player memiliki statistik yang sebanding. Fokus pada pelatihan situasional.",
  };
}
