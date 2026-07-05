import type { PlayerData } from "@/types";

export function PlayerProfileView({ data, uid }: { data: PlayerData; uid?: string }) {
  const displayUid = uid || data.uid;

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="glass-card-light relative overflow-hidden rounded-xl p-5">
        <div className="absolute -top-10 right-0 h-32 w-32 -z-10 blur-3xl bg-primary/10" />
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-primary-container bg-surface-variant p-1 text-xl font-bold text-primary">
              {data.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline-h1-mobile text-[18px] font-bold text-on-surface truncate">{data.name}</h1>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${data.isBanned ? "bg-error/20 text-error" : "bg-primary/10 text-primary"}`}>
                {data.isBanned ? "Banned" : "Aktif"}
              </span>
            </div>
            <p className="font-body-md text-[13px] text-on-surface-variant opacity-80">UID: {displayUid}</p>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-sm text-[11px] text-primary">{data.server}</span>
              {data.guild && <span className="font-label-sm text-[11px] text-on-surface-variant">Guild: {data.guild}</span>}
            </div>
            {data.signature && (
              <p className="mt-0.5 text-[11px] text-on-surface-variant italic opacity-70">"{data.signature}"</p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3">
        <StatBox label="Level" value={String(data.level)} />
        <StatBox label="EXP" value={data.exp.toLocaleString()} />
        <StatBox label="Rank Points" value={data.rankPoints.toLocaleString()} highlight />
        <StatBox label="CS Rank Points" value={data.csRankPoints.toLocaleString()} />
        <StatBox label="Max Rank" value={`#${data.maxRank}`} />
        <StatBox label="CS Max Rank" value={`#${data.csMaxRank}`} />
        <StatBox label="Likes" value={data.liked.toLocaleString()} />
        <StatBox label="Badges" value={String(data.badges)} />
      </section>

      {/* BR Stats */}
      {data.totalMatches > 0 && (
        <section className="glass-card rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">stadia_controller</span>
            <h3 className="font-headline-h3 text-[14px] font-semibold text-on-surface">Performa Battle Royale</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Matches" value={data.totalMatches.toLocaleString()} />
            <StatBox label="Wins" value={data.brWins.toLocaleString()} />
            <StatBox label="K/D" value={String(data.kd)} highlight />
            <StatBox label="Win Rate" value={`${data.brWinRate}%`} />
            <StatBox label="Kills" value={data.brKills.toLocaleString()} />
            <StatBox label="Deaths" value={data.brDeaths.toLocaleString()} />
            <StatBox label="Headshots" value={data.brHeadshots.toLocaleString()} />
            <StatBox label="HS Kills" value={data.brHeadshotKills.toLocaleString()} />
            <StatBox label="Damage" value={data.brDamage.toLocaleString()} />
            <StatBox label="Highest Kills" value={String(data.brHighestKills)} />
            <StatBox label="Revives" value={data.brRevives.toLocaleString()} />
            <StatBox label="Top N" value={data.brTopN.toLocaleString()} />
          </div>
        </section>
      )}

      {/* CS Stats */}
      {data.csMatches > 0 && (
        <section className="glass-card rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">sports_kabaddi</span>
            <h3 className="font-headline-h3 text-[14px] font-semibold text-on-surface">Performa Clash Squad</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Matches" value={data.csMatches.toLocaleString()} />
            <StatBox label="Wins" value={data.csWins.toLocaleString()} />
            <StatBox label="Kills" value={data.csKills.toLocaleString()} />
          </div>
        </section>
      )}

      {/* Rank Card */}
      <section className="glass-card rounded-xl border border-primary/20 p-5 rank-glow">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high p-2">
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-primary-container">
                {data.rank.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="font-headline-h2 text-[18px] font-semibold text-on-surface">{data.rank} Tier</h3>
              <p className="font-label-sm text-[11px] text-on-surface-variant">Skor Rank: {data.rankPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-label-sm text-[11px] uppercase text-on-surface-variant">Tier Selanjutnya</p>
            <p className="font-headline-h3 text-[14px] font-semibold text-primary">{getNextRank(data.rank)}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between px-1 text-xs text-on-surface-variant">
            <span>Progres ke {getNextRank(data.rank)}</span>
            <span>{data.rankMaxPoints > 0 ? Math.round((data.rankPoints / data.rankMaxPoints) * 100) : 100}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary-fixed-dim transition-all duration-1000"
              style={{ width: `${data.rankMaxPoints > 0 ? Math.min((data.rankPoints / data.rankMaxPoints) * 100, 100) : 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Guild Card */}
      {data.guild && (
        <section className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-lg">groups</span>
            <h3 className="font-headline-h3 text-[14px] font-semibold text-on-surface">Guild</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-label-sm text-[11px] text-on-surface-variant">Nama</p>
              <p className="font-body-md text-[13px] font-semibold text-on-surface">{data.guild}</p>
            </div>
            <div>
              <p className="font-label-sm text-[11px] text-on-surface-variant">Level</p>
              <p className="font-body-md text-[13px] font-semibold text-on-surface">{data.clanLevel}</p>
            </div>
            <div>
              <p className="font-label-sm text-[11px] text-on-surface-variant">Anggota</p>
              <p className="font-body-md text-[13px] font-semibold text-on-surface">{data.clanMembers} / {data.clanCapacity}</p>
            </div>
          </div>
        </section>
      )}

      {/* Profile Details */}
      <section className="glass-card overflow-hidden rounded-xl">
        <div className="border-b border-outline-variant bg-surface-container-high p-4">
          <h4 className="font-headline-h3 text-[14px] font-semibold text-on-surface">Detail Profil</h4>
        </div>
        <div className="divide-y divide-outline-variant">
          <DetailRow icon="calendar_month" label="Usia Akun" value={data.accountAge} />
          {data.accountCreatedAt && <DetailRow icon="calendar_today" label="Dibuat" value={data.accountCreatedAt} />}
          <DetailRow icon="schedule" label="Terakhir Aktif" value={data.lastActive} highlight />
          <DetailRow icon="stadia_controller" label="Rilis" value={data.releaseVersion || "N/A"} />
          {data.title && <DetailRow icon="badge" label="ID Title" value={`#${data.title}`} />}
          <DetailRow icon="credit_score" label="Skor Kredit" value={String(data.creditScore)} highlight />
          <DetailRow icon="diamond" label="Biaya Diamond" value={data.diamondCost > 0 ? String(data.diamondCost) : "N/A"} />
          <DetailRow icon="pet_supplies" label="Level Pet" value={data.petLevel > 0 ? `Lv.${data.petLevel}` : "Tidak Ada"} />
          <DetailRow icon="event" label="Season" value={data.seasonId ? `Season ${data.seasonId}` : "N/A"} />
          {data.primeLevel > 0 && <DetailRow icon="workspace_premium" label="Level Prime" value={`Level ${data.primeLevel}`} highlight />}
          {data.petId && <DetailRow icon="pets" label="ID Pet" value={data.petId} />}
          {data.weaponSkins.length > 0 && <DetailRow icon="military_tech" label="Skin Weapon" value={`${data.weaponSkins.length} terpasang`} />}
          {data.clothes.length > 0 && <DetailRow icon="checkroom" label="Outfit" value={`${data.clothes.length} item`} />}
          {data.skills.length > 0 && <DetailRow icon="psychology" label="Skill" value={`${data.skills.length} aktif`} />}
          {data.language && <DetailRow icon="language" label="Language" value={data.language.replace("Language_", "")} />}
          <DetailRow
            icon="gavel"
            label="Status Ban"
            value={data.isBanned ? `Banned (${data.banPeriod}h)` : "Bersih"}
            highlight={!data.isBanned}
            error={data.isBanned}
          />
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`glass-card flex flex-col justify-center rounded-xl p-3 ${highlight ? "border-l-4 border-l-primary-container" : ""}`}>
      <span className="font-label-sm mb-0.5 text-[11px] uppercase tracking-tight text-on-surface-variant">{label}</span>
      <span className={`font-display-stats text-[22px] font-bold ${highlight ? "text-primary-container" : "text-on-surface"}`}>{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, error }: { icon: string; label: string; value: string; highlight?: boolean; error?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-[13px]">{icon}</span>
        <span className="font-body-md text-[13px]">{label}</span>
      </div>
      <span className={`font-body-md text-[13px] font-bold ${error ? "text-error" : highlight ? "text-[#00D68F]" : "text-on-surface"}`}>
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
