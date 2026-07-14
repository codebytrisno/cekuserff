"use client";

import { useState, useCallback } from "react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/usePlayer";
import { UID_MIN_LENGTH, UID_MAX_LENGTH } from "@/lib/constants";
import type { PlayerData } from "@/types";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

export default function ComparePage() {
  const { search: fetchA, loading: loadingA, error: errorA } = usePlayer();
  const { search: fetchB, loading: loadingB, error: errorB } = usePlayer();

  const [uidA, setUidA] = useState("");
  const [uidB, setUidB] = useState("");
  const [playerA, setPlayerA] = useState<PlayerData | null>(null);
  const [playerB, setPlayerB] = useState<PlayerData | null>(null);
  const [showInput, setShowInput] = useState(true);

  const handleCompare = useCallback(async () => {
    const a = await fetchA(uidA);
    setPlayerA(a);
    if (!a) return;
    const b = await fetchB(uidB);
    setPlayerB(b);
    if (b) setShowInput(false);
  }, [uidA, uidB, fetchA, fetchB]);

  const handleNewCompare = () => {
    setShowInput(true);
    setPlayerA(null);
    setPlayerB(null);
  };

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
    <div className="min-h-screen bg-[#0D0D1A] pb-24 pattern-mesh">
      <TopAppBar />

      <main className="mx-auto max-w-container-max px-4 pt-20" style={{ background: "linear-gradient(180deg, #0D0D1A 0%, #1a1033 50%, #0D0D1A 100%)" }}>
        {/* Input Section */}
        {showInput && <section className="mb-6 mt-4">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <div className="relative w-full group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan UID Player 1"
                value={uidA}
                onChange={(e) => setUidA(e.target.value.replace(/\D/g, "").slice(0, UID_MAX_LENGTH))}
                className="input-maximal w-full rounded-3xl border-4 border-[#FF3AF2] bg-[#1a1033]/80 px-4 py-4 font-body-md text-[14px] text-white outline-none transition-all focus:border-[#00F5D4] focus:ring-2 focus:ring-[#00F5D4]/50 placeholder:text-white/40"
                style={{ boxShadow: "4px 4px 0 #FF3AF2" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-[12px] text-[#FF3AF2] font-bold uppercase tracking-wider">
                Player A
              </span>
            </div>
            <div className="vs-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#FFE600] z-10" style={{ boxShadow: "4px 4px 0 #FFE600, 8px 8px 0 #FF3AF2" }}>
              <span className="font-heading text-sm font-black italic uppercase text-white tracking-wider text-shadow-double">VS</span>
            </div>
            <div className="relative w-full group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Masukkan UID Player 2"
                value={uidB}
                onChange={(e) => setUidB(e.target.value.replace(/\D/g, "").slice(0, UID_MAX_LENGTH))}
                className="input-maximal w-full rounded-3xl border-4 border-[#00F5D4] bg-[#1a1033]/80 px-4 py-4 font-body-md text-[14px] text-white outline-none transition-all focus:border-[#FF3AF2] focus:ring-2 focus:ring-[#FF3AF2]/50 placeholder:text-white/40"
                style={{ boxShadow: "4px 4px 0 #00F5D4" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-sm text-[12px] text-[#00F5D4] font-bold uppercase tracking-wider">
                Player B
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              disabled={!isValidA || !isValidB || loadingA || loadingB}
              onClick={handleCompare}
              className="btn-primary flex-1 rounded-full bg-gradient-to-r from-[#FF3AF2] via-[#7B2FFF] to-[#00F5D4] py-4 font-black text-white uppercase tracking-wider shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50"
              style={{ boxShadow: "4px 4px 0 #FFE600, 8px 8px 0 #FF3AF2" }}
            >
              {loadingA || loadingB ? "Memuat..." : "Bandingkan Sekarang"}
            </button>
            {playerA && playerB && (
              <button
                onClick={handleSwap}
                className="btn-outline flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FFE600] bg-[#1a1033] transition-transform active:scale-[0.98]"
                style={{ boxShadow: "4px 4px 0 #FFE600" }}
              >
                <span className="material-symbols-outlined text-[#FFE600]">swap_horiz</span>
              </button>
            )}
          </div>
          {(errorA || errorB) && (
            <p className="mt-2 text-center text-[14px] text-[#FF3AF2] font-bold" style={{ textShadow: "0 0 10px #FF3AF2" }}>
              {errorA || errorB}
            </p>
          )}
        </section>}

        {/* Stats Comparison */}
        {playerA && playerB && (
          <section className="space-y-4">
            {/* Bandingkan Baru */}
            {!showInput && (
              <button
                onClick={handleNewCompare}
                className="btn-secondary flex w-full items-center justify-center gap-2 rounded-full border-4 border-dashed border-[#7B2FFF] bg-[#1a1033]/60 py-4 text-sm font-black uppercase tracking-wider text-[#7B2FFF] transition-all hover:border-[#FF3AF2] hover:text-[#FF3AF2] animate-slide-up"
                style={{ boxShadow: "4px 4px 0 #7B2FFF" }}
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Bandingkan Baru
              </button>
            )}

            {/* Player Header */}
            <div className="mb-base grid grid-cols-2 gap-3">
              <div className="glass-card flex items-center gap-3 rounded-3xl border-4 border-[#FF3AF2] p-3 rotate-[-1deg] animate-card-entrance shimmer-border" style={{ boxShadow: "6px 6px 0 #FF3AF2, 12px 12px 0 #7B2FFF", animationDelay: "0.1s" }}>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-4 border-[#FF3AF2] bg-[#FF3AF2]/20 text-lg font-black text-[#FF3AF2]">
                  {playerA.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading text-[15px] font-black uppercase tracking-wider text-white leading-none text-shadow-single">{playerA.name}</p>
                  <p className="font-label-sm text-[11px] text-[#FF3AF2] font-bold">ID: {playerA.uid}</p>
                </div>
              </div>
              <div className="glass-card flex items-center justify-end gap-3 rounded-3xl border-4 border-[#00F5D4] p-3 rotate-[1deg] text-right animate-card-entrance shimmer-border" style={{ boxShadow: "6px 6px 0 #00F5D4, 12px 12px 0 #FFE600", animationDelay: "0.2s" }}>
                <div className="text-right">
                  <p className="font-heading text-[15px] font-black uppercase tracking-wider text-white leading-none text-shadow-single">{playerB.name}</p>
                  <p className="font-label-sm text-[11px] text-[#00F5D4] font-bold">ID: {playerB.uid}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-4 border-[#00F5D4] bg-[#00F5D4]/20 text-lg font-black text-[#00F5D4]">
                  {playerB.name.charAt(0)}
                </div>
              </div>
            </div>

            {/* All Stat Sections */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


              {/* Section: Akurasi & Rank */}
              <SectionCard title="Akurasi & Rank" color="#FF3AF2" rotate="-rotate-1" pattern="pattern-dots" index={0}>
                <StatCompareRow
                  label="WIN RATE"
                  valueA={`${playerA.brWinRate}%`}
                  valueB={`${playerB.brWinRate}%`}
                  pctA={playerA.brWinRate}
                  pctB={playerB.brWinRate}
                  aWins={higher(playerA.brWinRate, playerB.brWinRate)}
                />
                <StatCompareRow
                  label="HEADSHOT %"
                  valueA={`${hsPct(playerA)}%`}
                  valueB={`${hsPct(playerB)}%`}
                  pctA={hsPctRaw(playerA)}
                  pctB={hsPctRaw(playerB)}
                  aWins={higher(hsPctRaw(playerA), hsPctRaw(playerB))}
                />
                <StatCompareRow
                  label="KILLS / MATCH"
                  valueA={fmt(perMatch(playerA.brKills, playerA.totalMatches))}
                  valueB={fmt(perMatch(playerB.brKills, playerB.totalMatches))}
                  pctA={pct(perMatch(playerA.brKills, playerA.totalMatches), 10)}
                  pctB={pct(perMatch(playerB.brKills, playerB.totalMatches), 10)}
                  aWins={higher(perMatch(playerA.brKills, playerA.totalMatches), perMatch(playerB.brKills, playerB.totalMatches))}
                />
                <StatCompareRow
                  label="LEVEL"
                  valueA={fmt(playerA.level)}
                  valueB={fmt(playerB.level)}
                  pctA={pct(playerA.level, 100)}
                  pctB={pct(playerB.level, 100)}
                  aWins={higher(playerA.level, playerB.level)}
                />
                <StatCompareRow
                  label="RANK POINTS"
                  valueA={playerA.rankPoints.toLocaleString()}
                  valueB={playerB.rankPoints.toLocaleString()}
                  pctA={pct(playerA.rankPoints, Math.max(playerA.rankPoints, playerB.rankPoints))}
                  pctB={pct(playerB.rankPoints, Math.max(playerA.rankPoints, playerB.rankPoints))}
                  aWins={higher(playerA.rankPoints, playerB.rankPoints)}
                />
                <StatCompareRow
                  label="MAX RANK"
                  valueA={`#${playerA.maxRank}`}
                  valueB={`#${playerB.maxRank}`}
                  pctA={pct(playerA.maxRank, Math.max(playerA.maxRank, playerB.maxRank))}
                  pctB={pct(playerB.maxRank, Math.max(playerA.maxRank, playerB.maxRank))}
                  aWins={lower(playerA.maxRank, playerB.maxRank)}
                />
                <StatCompareRow
                  label="CS RANK"
                  valueA={`#${playerA.csRank}`}
                  valueB={`#${playerB.csRank}`}
                  pctA={pct(playerA.csMaxRank - playerA.csRank, Math.max(playerA.csMaxRank, 1))}
                  pctB={pct(playerB.csMaxRank - playerB.csRank, Math.max(playerB.csMaxRank, 1))}
                  aWins={lower(playerA.csRank, playerB.csRank)}
                />
                <StatCompareRow
                  label="CS RANK POINTS"
                  valueA={playerA.csRankPoints.toLocaleString()}
                  valueB={playerB.csRankPoints.toLocaleString()}
                  pctA={pct(playerA.csRankPoints, Math.max(playerA.csRankPoints, playerB.csRankPoints))}
                  pctB={pct(playerB.csRankPoints, Math.max(playerA.csRankPoints, playerB.csRankPoints))}
                  aWins={higher(playerA.csRankPoints, playerB.csRankPoints)}
                />
                <StatCompareRow
                  label="CS MAX RANK"
                  valueA={`#${playerA.csMaxRank}`}
                  valueB={`#${playerB.csMaxRank}`}
                  pctA={pct(playerA.csMaxRank, Math.max(playerA.csMaxRank, playerB.csMaxRank))}
                  pctB={pct(playerB.csMaxRank, Math.max(playerA.csMaxRank, playerB.csMaxRank))}
                  aWins={lower(playerA.csMaxRank, playerB.csMaxRank)}
                />
              </SectionCard>

              {/* Section: Clash Squad */}
              {(playerA.csMatches > 0 || playerB.csMatches > 0) && (
                <SectionCard title="Clash Squad" color="#00F5D4" rotate="rotate-1" pattern="pattern-stripes" index={1}>
                  <StatCompareRow
                    label="MATCHES"
                    valueA={playerA.csMatches.toLocaleString()}
                    valueB={playerB.csMatches.toLocaleString()}
                    pctA={pct(playerA.csMatches, Math.max(playerA.csMatches, playerB.csMatches))}
                    pctB={pct(playerB.csMatches, Math.max(playerA.csMatches, playerB.csMatches))}
                    aWins={higher(playerA.csMatches, playerB.csMatches)}
                  />
                  <StatCompareRow
                    label="WINS"
                    valueA={playerA.csWins.toLocaleString()}
                    valueB={playerB.csWins.toLocaleString()}
                    pctA={pct(playerA.csWins, Math.max(playerA.csWins, playerB.csWins))}
                    pctB={pct(playerB.csWins, Math.max(playerA.csWins, playerB.csWins))}
                    aWins={higher(playerA.csWins, playerB.csWins)}
                  />
                  <StatCompareRow
                    label="KILLS"
                    valueA={playerA.csKills.toLocaleString()}
                    valueB={playerB.csKills.toLocaleString()}
                    pctA={pct(playerA.csKills, Math.max(playerA.csKills, playerB.csKills))}
                    pctB={pct(playerB.csKills, Math.max(playerA.csKills, playerB.csKills))}
                    aWins={higher(playerA.csKills, playerB.csKills)}
                  />
                  <StatCompareRow
                    label="WIN RATE"
                    valueA={`${csWr(playerA)}%`}
                    valueB={`${csWr(playerB)}%`}
                    pctA={csWrRaw(playerA)}
                    pctB={csWrRaw(playerB)}
                    aWins={higher(csWrRaw(playerA), csWrRaw(playerB))}
                  />
                </SectionCard>
              )}

              {/* Section: Profil */}
              <SectionCard title="Profil" color="#FFE600" rotate="-rotate-1" pattern="pattern-checker" index={2}>
                <StatCompareRow
                  label="LEVEL"
                  valueA={fmt(playerA.level)}
                  valueB={fmt(playerB.level)}
                  pctA={pct(playerA.level, 100)}
                  pctB={pct(playerB.level, 100)}
                  aWins={higher(playerA.level, playerB.level)}
                />
                <StatCompareRow
                  label="EXP"
                  valueA={playerA.exp.toLocaleString()}
                  valueB={playerB.exp.toLocaleString()}
                  pctA={pct(playerA.exp, Math.max(playerA.exp, playerB.exp))}
                  pctB={pct(playerB.exp, Math.max(playerA.exp, playerB.exp))}
                  aWins={higher(playerA.exp, playerB.exp)}
                />
                <StatCompareRow
                  label="LIKES"
                  valueA={playerA.liked.toLocaleString()}
                  valueB={playerB.liked.toLocaleString()}
                  pctA={pct(playerA.liked, Math.max(playerA.liked, playerB.liked))}
                  pctB={pct(playerB.liked, Math.max(playerA.liked, playerB.liked))}
                  aWins={higher(playerA.liked, playerB.liked)}
                />
                <StatCompareRow
                  label="BADGES"
                  valueA={fmt(playerA.badges)}
                  valueB={fmt(playerB.badges)}
                  pctA={pct(playerA.badges, Math.max(playerA.badges, playerB.badges))}
                  pctB={pct(playerB.badges, Math.max(playerA.badges, playerB.badges))}
                  aWins={higher(playerA.badges, playerB.badges)}
                />
                <StatCompareRow
                  label="CREDIT SCORE"
                  valueA={fmt(playerA.creditScore)}
                  valueB={fmt(playerB.creditScore)}
                  pctA={pct(playerA.creditScore, Math.max(playerA.creditScore, playerB.creditScore))}
                  pctB={pct(playerB.creditScore, Math.max(playerA.creditScore, playerB.creditScore))}
                  aWins={higher(playerA.creditScore, playerB.creditScore)}
                />
                <StatCompareRow
                  label="DIAMOND COST"
                  valueA={playerA.diamondCost > 0 ? playerA.diamondCost.toLocaleString() : "N/A"}
                  valueB={playerB.diamondCost > 0 ? playerB.diamondCost.toLocaleString() : "N/A"}
                  pctA={pct(playerA.diamondCost, Math.max(playerA.diamondCost, playerB.diamondCost))}
                  pctB={pct(playerB.diamondCost, Math.max(playerA.diamondCost, playerB.diamondCost))}
                  aWins={playerA.diamondCost > 0 && playerB.diamondCost > 0 ? higher(playerA.diamondCost, playerB.diamondCost) : false}
                />
                <StatCompareRow
                  label="PET LEVEL"
                  valueA={playerA.petLevel > 0 ? `Lv.${playerA.petLevel}` : "N/A"}
                  valueB={playerB.petLevel > 0 ? `Lv.${playerB.petLevel}` : "N/A"}
                  pctA={pct(playerA.petLevel, Math.max(playerA.petLevel, playerB.petLevel))}
                  pctB={pct(playerB.petLevel, Math.max(playerA.petLevel, playerB.petLevel))}
                  aWins={higher(playerA.petLevel, playerB.petLevel)}
                />
                <StatCompareRow
                  label="PRIME LEVEL"
                  valueA={playerA.primeLevel > 0 ? `Lv.${playerA.primeLevel}` : "N/A"}
                  valueB={playerB.primeLevel > 0 ? `Lv.${playerB.primeLevel}` : "N/A"}
                  pctA={pct(playerA.primeLevel, Math.max(playerA.primeLevel, playerB.primeLevel))}
                  pctB={pct(playerB.primeLevel, Math.max(playerA.primeLevel, playerB.primeLevel))}
                  aWins={higher(playerA.primeLevel, playerB.primeLevel)}
                />
                <TextCompareRow
                  label="AKUN DIBUAT"
                  valueA={playerA.accountCreatedAt || "N/A"}
                  valueB={playerB.accountCreatedAt || "N/A"}
                />
                <TextCompareRow
                  label="USIA AKUN"
                  valueA={playerA.accountAge}
                  valueB={playerB.accountAge}
                />
                <TextCompareRow
                  label="TERAKHIR MAIN"
                  valueA={playerA.lastActive}
                  valueB={playerB.lastActive}
                />
                <TextCompareRow
                  label="RILIS"
                  valueA={playerA.releaseVersion || "N/A"}
                  valueB={playerB.releaseVersion || "N/A"}
                />
                <TextCompareRow
                  label="SEASON"
                  valueA={playerA.seasonId ? `Season ${playerA.seasonId}` : "N/A"}
                  valueB={playerB.seasonId ? `Season ${playerB.seasonId}` : "N/A"}
                />
                <TextCompareRow
                  label="TITLE ID"
                  valueA={playerA.title ? `#${playerA.title}` : "N/A"}
                  valueB={playerB.title ? `#${playerB.title}` : "N/A"}
                />
              </SectionCard>

              {/* Section: Guild */}
              {(playerA.guild || playerB.guild) && (
                <SectionCard title="Guild" color="#FF6B35" rotate="rotate-1" pattern="pattern-dots" index={3}>
                  <TextCompareRow
                    label="NAMA"
                    valueA={playerA.guild || "-"}
                    valueB={playerB.guild || "-"}
                  />
                  <StatCompareRow
                    label="LEVEL"
                    valueA={fmt(playerA.clanLevel)}
                    valueB={fmt(playerB.clanLevel)}
                    pctA={pct(playerA.clanLevel, Math.max(playerA.clanLevel, playerB.clanLevel))}
                    pctB={pct(playerB.clanLevel, Math.max(playerA.clanLevel, playerB.clanLevel))}
                    aWins={higher(playerA.clanLevel, playerB.clanLevel)}
                  />
                  <StatBarCompare
                    label="ANGGOTA"
                    displayA={`${playerA.clanMembers}`}
                    displayB={`${playerB.clanMembers}`}
                    valueA={playerA.clanMembers}
                    valueB={playerB.clanMembers}
                    max={Math.max(playerA.clanCapacity, playerB.clanCapacity)}
                    aWins={higher(playerA.clanMembers, playerB.clanMembers)}
                  />
                  <TextCompareRow
                    label="KAPASITAS"
                    valueA={playerA.clanCapacity > 0 ? fmt(playerA.clanCapacity) : "-"}
                    valueB={playerB.clanCapacity > 0 ? fmt(playerB.clanCapacity) : "-"}
                  />
                </SectionCard>
              )}

              {/* Section: Status & Equipment */}
              <SectionCard title="Status & Equipment" color="#7B2FFF" rotate="-rotate-1" pattern="pattern-mesh" index={4}>
                <BoolCompareRow
                  label="ONLINE"
                  aTrue={playerA.online}
                  bTrue={playerB.online}
                />
                <BoolCompareRow
                  label="DALAM GAME"
                  aTrue={playerA.inGame}
                  bTrue={playerB.inGame}
                />
                <BoolCompareRow
                  label="BANNED"
                  aTrue={playerA.isBanned}
                  bTrue={playerB.isBanned}
                  bad
                />
                <StatCompareRow
                  label="WEAPON SKINS"
                  valueA={fmt(playerA.weaponSkins.length)}
                  valueB={fmt(playerB.weaponSkins.length)}
                  pctA={pct(playerA.weaponSkins.length, Math.max(playerA.weaponSkins.length, playerB.weaponSkins.length))}
                  pctB={pct(playerB.weaponSkins.length, Math.max(playerA.weaponSkins.length, playerB.weaponSkins.length))}
                  aWins={higher(playerA.weaponSkins.length, playerB.weaponSkins.length)}
                />
                <StatCompareRow
                  label="OUTFIT"
                  valueA={fmt(playerA.clothes.length)}
                  valueB={fmt(playerB.clothes.length)}
                  pctA={pct(playerA.clothes.length, Math.max(playerA.clothes.length, playerB.clothes.length))}
                  pctB={pct(playerB.clothes.length, Math.max(playerA.clothes.length, playerB.clothes.length))}
                  aWins={higher(playerA.clothes.length, playerB.clothes.length)}
                />
                <StatCompareRow
                  label="SKILLS"
                  valueA={fmt(playerA.skills.length)}
                  valueB={fmt(playerB.skills.length)}
                  pctA={pct(playerA.skills.length, Math.max(playerA.skills.length, playerB.skills.length))}
                  pctB={pct(playerB.skills.length, Math.max(playerA.skills.length, playerB.skills.length))}
                  aWins={higher(playerA.skills.length, playerB.skills.length)}
                />
                <TextCompareRow
                  label="SERVER"
                  valueA={playerA.server}
                  valueB={playerB.server}
                />
                <TextCompareRow
                  label="SIGNATURE"
                  valueA={playerA.signature ? `"${playerA.signature}"` : "-"}
                  valueB={playerB.signature ? `"${playerB.signature}"` : "-"}
                />
              </SectionCard>
            </div>

            {/* Winner Summary */}
            {winner && (
              <div className="glass-card mt-6 flex items-center justify-between rounded-3xl border-4 border-[#FFE600] p-5 rotate-[-1deg] animate-elastic shimmer-border" style={{ boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2, 24px 24px 0 #00F5D4" }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE600]/20" style={{ boxShadow: "0 0 20px #FFE60040" }}>
                    <span className="material-symbols-outlined text-3xl text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div>
                    <p className="font-heading text-[16px] font-black uppercase tracking-wider text-white leading-tight text-shadow-double">
                      {winner.text}
                    </p>
                    <p className="font-label-sm text-[12px] text-white/60">{winner.subtext}</p>
                  </div>
                </div>
                <div className="text-[#FFE600]">
                  <span className="material-symbols-outlined text-4xl" style={{ textShadow: "0 0 20px #FFE600" }}>trending_up</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Insights */}
        {playerA && playerB && (
          <section className="mt-xl grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="glass-card rounded-3xl border-4 border-[#FF3AF2] p-5 rotate-[1deg] pattern-stripes animate-card-entrance" style={{ boxShadow: "6px 6px 0 #FF3AF2, 12px 12px 0 #FFE600", animationDelay: "0.5s" }}>
              <h3 className="font-heading mb-3 text-[16px] font-black uppercase tracking-wider text-[#FF3AF2] text-shadow-single">Perbandingan Terbaru</h3>
              <div className="space-y-2">
                {[`${playerA.name} vs ${playerB.name}`, `${playerB.name} vs ${playerA.name}`].map((pair, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border-2 border-[#FF3AF2]/30 bg-[#1a1033] p-3"
                  >
                    <span className="font-body-md text-[14px] text-white font-semibold">{pair}</span>
                    <span className="material-symbols-outlined text-[#FF3AF2]">history</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-3xl border-4 border-[#00F5D4] p-5 -rotate-[1deg] pattern-dots animate-card-entrance" style={{ boxShadow: "6px 6px 0 #00F5D4, 12px 12px 0 #7B2FFF", animationDelay: "0.6s" }}>
              <h3 className="font-heading mb-3 text-[16px] font-black uppercase tracking-wider text-[#00F5D4] text-shadow-single">Wawasan Pro</h3>
              <p className="font-body-md text-[14px] text-white/60">
                {winner?.insight || "Bandingkan dua player untuk mendapatkan wawasan."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border-2 border-[#FF3AF2] bg-[#FF3AF2]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#FF3AF2]">
                  {playerA.kd > playerB.kd ? "AGGRESSIVE" : "TACTICAL"}
                </span>
                <span className="rounded-full border-2 border-[#00F5D4] bg-[#00F5D4]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#00F5D4]">
                  {hsPctRaw(playerA) > hsPctRaw(playerB) ? "SNIPER" : "SUPPORT"}
                </span>
                <span className="rounded-full border-2 border-[#FFE600] bg-[#FFE600]/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-[#FFE600]">
                  {playerA.online && !playerB.online ? "AKTIF" : playerB.online && !playerA.online ? "AKTIF" : "SEIMBANG"}
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

/* ─── Components ─── */

function SectionCard({ title, children, color = "#FF3AF2", rotate, pattern, index = 0 }: { title: string; children: React.ReactNode; color?: string; rotate?: string; pattern?: string; index?: number }) {
  return (
    <div className={`glass-card space-y-5 rounded-3xl border-4 p-5 ${rotate || ""} ${pattern || ""} animate-card-entrance tilt-3d`} style={{ borderColor: color, boxShadow: `8px 8px 0 ${color}, 16px 16px 0 ${color}30`, animationDelay: `${0.15 + index * 0.1}s` }}>
      <p className="font-heading text-xs font-black uppercase tracking-wider" style={{ color, textShadow: `0 0 20px ${color}40` }}>{title}</p>
      {children}
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
    <div className="py-1">
      <div className="mb-1 flex items-end justify-between">
        <div className="flex items-center gap-1">
          <span className="font-display text-[32px] font-black text-[#FF3AF2] text-shadow-single">{valueA}</span>
          {aWins && (
            <span className="material-symbols-outlined text-xl text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
        </div>
        <p className="font-heading text-[11px] font-black uppercase tracking-widest text-white/60">{label}</p>
        <div className="flex items-center gap-1">
          {!aWins && valueA !== valueB && (
            <span className="material-symbols-outlined text-xl text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
          <span className="font-display text-[32px] font-black text-white text-shadow-single">{valueB}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="stat-bar-container flex-1">
          <div className="h-full rounded-r-full bg-gradient-to-r from-[#FF3AF2] to-[#FF3AF2]/60" style={{ width: `${Math.min(pctA, 100)}%` }} />
        </div>
        <div className="stat-bar-container flex-1">
          <div className="ml-auto h-full rounded-l-full bg-gradient-to-l from-[#00F5D4] to-[#00F5D4]/60" style={{ width: `${Math.min(pctB, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

function BoolCompareRow({
  label,
  aTrue,
  bTrue,
  bad,
}: {
  label: string;
  aTrue: boolean;
  bTrue: boolean;
  bad?: boolean;
}) {
  return (
    <div className="py-1">
      <div className="mb-1 flex items-end justify-between">
        <div className="flex items-center gap-1">
          <span className={`material-symbols-outlined text-xl ${aTrue ? (bad ? "text-[#FF3AF2]" : "text-[#00F5D4]") : "text-white/30"}`}
            style={{ fontVariationSettings: "'FILL' 1", textShadow: aTrue ? (bad ? "0 0 10px #FF3AF2" : "0 0 10px #00F5D4") : "none" }}>
            {aTrue ? (bad ? "gpp_bad" : "check_circle") : "cancel"}
          </span>
          {!bad && aTrue && !bTrue && (
            <span className="material-symbols-outlined text-lg text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
        </div>
        <p className="font-heading text-[11px] font-black uppercase tracking-widest text-white/60">{label}</p>
        <div className="flex items-center gap-1">
          {!bad && bTrue && !aTrue && (
            <span className="material-symbols-outlined text-lg text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
          <span className={`material-symbols-outlined text-xl ${bTrue ? (bad ? "text-[#FF3AF2]" : "text-[#00F5D4]") : "text-white/30"}`}
            style={{ fontVariationSettings: "'FILL' 1", textShadow: bTrue ? (bad ? "0 0 10px #FF3AF2" : "0 0 10px #00F5D4") : "none" }}>
            {bTrue ? (bad ? "gpp_bad" : "check_circle") : "cancel"}
          </span>
        </div>
      </div>
    </div>
  );
}

function TextCompareRow({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: string;
  valueB: string;
}) {
  return (
    <div className="py-1">
      <div className="mb-1 flex items-end justify-between">
        <span className="font-body-md text-[14px] font-bold text-[#FF3AF2] truncate max-w-[40%]">{valueA}</span>
        <p className="font-heading text-[11px] font-black uppercase tracking-widest text-white/60">{label}</p>
        <span className="font-body-md text-[14px] font-bold text-white truncate max-w-[40%]">{valueB}</span>
      </div>
    </div>
  );
}

function StatBarCompare({
  label,
  displayA,
  displayB,
  valueA,
  valueB,
  max,
  aWins,
}: {
  label: string;
  displayA: string;
  displayB: string;
  valueA: number;
  valueB: number;
  max: number;
  aWins: boolean;
}) {
  return (
    <div className="py-1">
      <div className="mb-1 flex items-end justify-between">
        <div className="flex items-center gap-1">
          <span className="font-display text-[32px] font-black text-[#FF6B35] text-shadow-single">{displayA}</span>
          {aWins && (
            <span className="material-symbols-outlined text-xl text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
        </div>
        <p className="font-heading text-[11px] font-black uppercase tracking-widest text-white/60">{label}</p>
        <div className="flex items-center gap-1">
          {!aWins && valueA !== valueB && (
            <span className="material-symbols-outlined text-xl text-[#FFE600]" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 10px #FFE600" }}>
              emoji_events
            </span>
          )}
          <span className="font-display text-[32px] font-black text-white text-shadow-single">{displayB}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="stat-bar-container flex-1">
          <div className="h-full rounded-r-full bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/60" style={{ width: `${Math.min(pct(valueA, max), 100)}%` }} />
        </div>
        <div className="stat-bar-container flex-1">
          <div className="ml-auto h-full rounded-l-full bg-gradient-to-l from-[#7B2FFF] to-[#7B2FFF]/60" style={{ width: `${Math.min(pct(valueB, max), 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function fmt(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

function pct(val: number, max: number): number {
  if (max <= 0 || val <= 0) return 0;
  return Math.min((val / max) * 100, 100);
}

function higher(a: number, b: number): boolean {
  return a > b;
}

function lower(a: number, b: number): boolean {
  if (a === 0 && b === 0) return false;
  if (a === 0) return false;
  if (b === 0) return true;
  return a < b;
}

function hsPctRaw(p: PlayerData): number {
  return p.brKills > 0 ? (p.brHeadshots / p.brKills) * 100 : 0;
}

function hsPct(p: PlayerData): string {
  return hsPctRaw(p).toFixed(1);
}

function perMatch(val: number, matches: number): number {
  if (matches <= 0) return 0;
  return val / matches;
}

function csWrRaw(p: PlayerData): number {
  return p.csMatches > 0 ? (p.csWins / p.csMatches) * 100 : 0;
}

function csWr(p: PlayerData): string {
  return csWrRaw(p).toFixed(1);
}

/* ─── Winner Calculator ─── */

function getWinner(a: PlayerData, b: PlayerData): { text: string; subtext: string; insight: string } | null {
  const cats: Array<{ a: number; b: number; label: string; lowerBetter?: boolean }> = [
    { a: a.brWinRate, b: b.brWinRate, label: "Win Rate" },
    { a: hsPctRaw(a), b: hsPctRaw(b), label: "HS %" },
    { a: a.level, b: b.level, label: "Level" },
    { a: a.rankPoints, b: b.rankPoints, label: "Rank Points" },
    { a: a.maxRank === 0 ? 999 : a.maxRank, b: b.maxRank === 0 ? 999 : b.maxRank, label: "Max Rank", lowerBetter: true },
    { a: a.csRankPoints, b: b.csRankPoints, label: "CS RP" },
    { a: a.csRank === 0 ? 999 : a.csRank, b: b.csRank === 0 ? 999 : b.csRank, label: "CS Rank", lowerBetter: true },
    { a: a.exp, b: b.exp, label: "EXP" },
    { a: a.liked, b: b.liked, label: "Likes" },
    { a: a.badges, b: b.badges, label: "Badges" },
    { a: a.creditScore, b: b.creditScore, label: "Credit" },
    { a: a.petLevel, b: b.petLevel, label: "Pet" },
    { a: a.primeLevel, b: b.primeLevel, label: "Prime" },
    { a: a.weaponSkins.length, b: b.weaponSkins.length, label: "Skins" },
    { a: a.clothes.length, b: b.clothes.length, label: "Outfit" },
    { a: a.skills.length, b: b.skills.length, label: "Skills" },
    { a: a.seasonId, b: b.seasonId, label: "Season" },
  ];

  if (a.csMatches > 0 || b.csMatches > 0) {
    cats.push({ a: a.csMatches, b: b.csMatches, label: "CS Matches" });
    cats.push({ a: a.csWins, b: b.csWins, label: "CS Wins" });
    cats.push({ a: a.csKills, b: b.csKills, label: "CS Kills" });
  }

  let scoreA = 0, scoreB = 0, tie = 0;
  for (const c of cats) {
    if (c.a > c.b && !c.lowerBetter) scoreA++;
    else if (c.a < c.b && c.lowerBetter) scoreA++;
    else if (c.b > c.a && !c.lowerBetter) scoreB++;
    else if (c.b < c.a && c.lowerBetter) scoreB++;
    else if (c.a === c.b) tie++;
  }

  const total = cats.length - tie;

  if (scoreA > scoreB) {
    return {
      text: `${a.name} unggul ${scoreA}-${scoreB}`,
      subtext: `${a.name} menang di ${scoreA} dari ${total} kategori.`,
      insight: `${a.name} unggul secara keseluruhan dengan performa yang lebih dominan.`,
    };
  }
  if (scoreB > scoreA) {
    return {
      text: `${b.name} unggul ${scoreB}-${scoreA}`,
      subtext: `${b.name} menang di ${scoreB} dari ${total} kategori.`,
      insight: `${b.name} menunjukkan performa yang lebih solid secara keseluruhan.`,
    };
  }
  return {
    text: "Hasil imbang!",
    subtext: `${scoreA}-${scoreB} dari ${total} kategori.`,
    insight: "Kedua player memiliki performa yang sebanding. Fokus pada pelatihan situasional.",
  };
}
