import type { PlayerData } from "@/types";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

export function PlayerProfileView({ data, uid }: { data: PlayerData; uid?: string }) {
  const displayUid = uid || data.uid;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-accent p-6 animate-slide-up"
        style={{ background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2" }}
      >
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="absolute top-0 right-0 h-40 w-40 bg-accent/10 blur-3xl rounded-full animate-morph" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative animate-elastic" style={{ animationDelay: "0.2s" }}>
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-accent bg-accent/15 text-2xl font-black text-accent animate-glow-breath">
              {data.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -inset-1 rounded-full border-2 border-accent/30 animate-pulse-ring" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-foreground text-shadow-single truncate animate-slide-up" style={{ animationDelay: "0.1s" }}>{data.name}</h1>
              {data.isBanned && (
                <span className="rounded-full border-2 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider animate-elastic border-accent bg-accent/15 text-accent" style={{ animationDelay: "0.3s" }}>
                  BANNED
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/50 animate-slide-up" style={{ animationDelay: "0.15s" }}>UID: {displayUid}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <span className="rounded-full border-2 border-quinary bg-quinary/15 px-3 py-0.5 text-[10px] font-black uppercase text-quinary">{data.server}</span>
              {data.guild && <span className="text-xs text-white/40">Guild: {data.guild}</span>}
            </div>
            {data.signature && (
              <p className="mt-1 text-xs text-white/30 italic animate-slide-up" style={{ animationDelay: "0.25s" }}>"{data.signature}"</p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatBox label="Level" value={String(data.level)} colorIndex={0} delay={0} />
        <StatBox label="EXP" value={data.exp.toLocaleString()} colorIndex={1} delay={1} />
        <StatBox label="Rank Points" value={data.rankPoints.toLocaleString()} colorIndex={2} highlight delay={2} />
        <StatBox label="CS Rank Points" value={data.csRankPoints.toLocaleString()} colorIndex={3} delay={3} />
        <StatBox label="Max Rank" value={`#${data.maxRank}`} colorIndex={4} delay={4} />
        <StatBox label="CS Max Rank" value={`#${data.csMaxRank}`} colorIndex={0} delay={5} />
        <StatBox label="Likes" value={data.liked.toLocaleString()} colorIndex={1} delay={6} />
        <StatBox label="Badges" value={String(data.badges)} colorIndex={2} delay={7} />
      </section>

      {/* BR Stats */}
      {data.totalMatches > 0 && (
        <section className="relative overflow-hidden rounded-3xl border-4 border-quaternary p-6 animate-card-entrance" style={{ animationDelay: "0.3s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #7B2FFF" }}
        >
          <div className="absolute inset-0 pattern-stripes opacity-15" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-quaternary text-xl animate-wiggle" style={{ fontVariationSettings: "'FILL' 1" }}>stadia_controller</span>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">PERFORMA BATTLE ROYALE</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Matches" value={data.totalMatches.toLocaleString()} colorIndex={0} delay={8} />
              <StatBox label="Wins" value={data.brWins.toLocaleString()} colorIndex={1} delay={9} />
              <StatBox label="K/D" value={String(data.kd)} colorIndex={2} highlight delay={10} />
              <StatBox label="Win Rate" value={`${data.brWinRate}%`} colorIndex={3} delay={11} />
              <StatBox label="Kills" value={data.brKills.toLocaleString()} colorIndex={4} delay={12} />
              <StatBox label="Deaths" value={data.brDeaths.toLocaleString()} colorIndex={0} delay={13} />
              <StatBox label="Headshots" value={data.brHeadshots.toLocaleString()} colorIndex={1} delay={14} />
              <StatBox label="HS Kills" value={data.brHeadshotKills.toLocaleString()} colorIndex={2} delay={15} />
              <StatBox label="Damage" value={data.brDamage.toLocaleString()} colorIndex={3} delay={16} />
              <StatBox label="Highest Kills" value={String(data.brHighestKills)} colorIndex={4} delay={17} />
              <StatBox label="Revives" value={data.brRevives.toLocaleString()} colorIndex={0} delay={18} />
              <StatBox label="Top N" value={data.brTopN.toLocaleString()} colorIndex={1} delay={19} />
            </div>
          </div>
        </section>
      )}

      {/* CS Stats */}
      {data.csMatches > 0 && (
        <section className="relative overflow-hidden rounded-3xl border-4 border-secondary p-6 animate-card-entrance" style={{ animationDelay: "0.4s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FFE600" }}
        >
          <div className="absolute inset-0 pattern-stripes-cyan opacity-15" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl animate-wiggle" style={{ fontVariationSettings: "'FILL' 1" }}>sports_kabaddi</span>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">PERFORMA CLASH SQUAD</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Matches" value={data.csMatches.toLocaleString()} colorIndex={0} delay={20} />
              <StatBox label="Wins" value={data.csWins.toLocaleString()} colorIndex={1} delay={21} />
              <StatBox label="Kills" value={data.csKills.toLocaleString()} colorIndex={2} delay={22} />
            </div>
          </div>
        </section>
      )}

      {/* Rank Card */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-tertiary p-6 animate-card-entrance" style={{ animationDelay: "0.5s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(255,230,0,0.3), 8px 8px 0 #FF3AF2" }}
      >
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-tertiary bg-tertiary/15 text-2xl font-black text-tertiary animate-scale-bounce" style={{ animationDelay: "0.6s" }}>
                {data.rank.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-xl font-black uppercase tracking-wider text-foreground">{data.rank} TIER</h3>
                <p className="text-xs text-white/50">Skor Rank: {data.rankPoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/40">TIER SELANJUTNYA</p>
              <p className="font-heading text-lg font-black uppercase text-quinary animate-glow-breath">{getNextRank(data.rank)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between px-1 text-xs font-bold text-white/50">
              <span>Progres ke {getNextRank(data.rank)}</span>
              <span>{data.rankMaxPoints > 0 ? Math.round((data.rankPoints / data.rankMaxPoints) * 100) : 100}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-accent via-tertiary to-secondary transition-all duration-1000 animate-glow-breath"
                style={{ width: `${data.rankMaxPoints > 0 ? Math.min((data.rankPoints / data.rankMaxPoints) * 100, 100) : 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guild Card */}
      {data.guild && (
        <section className="relative overflow-hidden rounded-3xl border-4 border-quinary p-6 animate-card-entrance" style={{ animationDelay: "0.6s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FF3AF2" }}
        >
          <div className="absolute inset-0 pattern-checker opacity-15" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-quinary text-xl animate-bounce-subtle" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">GUILD</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-stagger animate-stagger-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Nama</p>
                <p className="font-bold text-foreground">{data.guild}</p>
              </div>
              <div className="animate-stagger animate-stagger-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Level</p>
                <p className="font-bold text-foreground">{data.clanLevel}</p>
              </div>
              <div className="animate-stagger animate-stagger-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Anggota</p>
                <p className="font-bold text-foreground">{data.clanMembers} / {data.clanCapacity}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Profile Details */}
      <section className="overflow-hidden rounded-3xl border-4 border-accent animate-card-entrance"
        style={{ animationDelay: "0.7s", background: "rgba(45, 27, 78, 0.6)", backdropFilter: "blur(12px)", boxShadow: "8px 8px 0 #FFE600" }}
      >
        <div className="border-b-4 border-dashed border-accent bg-accent/10 px-6 py-4">
          <h4 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">DETAIL PROFIL</h4>
        </div>
        <div className="divide-y divide-white/10">
          <DetailRow icon="calendar_month" label="Usia Akun" value={data.accountAge} delay={0} />
          {data.accountCreatedAt && <DetailRow icon="calendar_today" label="Dibuat" value={data.accountCreatedAt} delay={1} />}
          <DetailRow icon="schedule" label="Terakhir Aktif" value={data.lastActive} highlight delay={2} />
          <DetailRow icon="stadia_controller" label="Rilis" value={data.releaseVersion || "N/A"} delay={3} />
          {data.title && <DetailRow icon="badge" label="ID Title" value={`#${data.title}`} delay={4} />}
          <DetailRow icon="credit_score" label="Skor Kredit" value={String(data.creditScore)} highlight delay={5} />
          <DetailRow icon="diamond" label="Biaya Diamond" value={data.diamondCost > 0 ? String(data.diamondCost) : "N/A"} delay={6} />
          <DetailRow icon="pet_supplies" label="Level Pet" value={data.petLevel > 0 ? `Lv.${data.petLevel}` : "Tidak Ada"} delay={7} />
          <DetailRow icon="event" label="Season" value={data.seasonId ? `Season ${data.seasonId}` : "N/A"} delay={8} />
          {data.primeLevel > 0 && <DetailRow icon="workspace_premium" label="Level Prime" value={`Level ${data.primeLevel}`} highlight delay={9} />}
          {data.petId && <DetailRow icon="pets" label="ID Pet" value={data.petId} delay={10} />}
          {data.weaponSkins.length > 0 && <DetailRow icon="military_tech" label="Skin Weapon" value={`${data.weaponSkins.length} terpasang`} delay={11} />}
          {data.clothes.length > 0 && <DetailRow icon="checkroom" label="Outfit" value={`${data.clothes.length} item`} delay={12} />}
          {data.skills.length > 0 && <DetailRow icon="psychology" label="Skill" value={`${data.skills.length} aktif`} delay={13} />}
          {data.language && <DetailRow icon="language" label="Language" value={data.language.replace("Language_", "")} delay={14} />}
          <DetailRow
            icon="gavel"
            label="Status Ban"
            value={data.isBanned ? `BANNED (${data.banPeriod}h)` : "BERSIH"}
            highlight={!data.isBanned}
            error={data.isBanned}
            delay={15}
          />
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, highlight, colorIndex = 0, delay = 0 }: { label: string; value: string; highlight?: boolean; colorIndex?: number; delay?: number }) {
  const color = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];
  return (
    <div
      className={`flex flex-col justify-center rounded-2xl border-2 p-3 animate-card-entrance transition-all ${highlight ? "tilt-3d" : "hover:scale-[1.03]"}`}
      style={{
        background: "rgba(45, 27, 78, 0.5)",
        borderColor: highlight ? color : "rgba(255,255,255,0.08)",
        animationDelay: `${0.1 + delay * 0.05}s`,
        boxShadow: highlight ? `0 0 15px ${color}30` : undefined,
      }}
    >
      <span className="text-[10px] font-black uppercase tracking-wider text-white/40">{label}</span>
      <span className={`font-display text-xl ${highlight ? "text-glow-magenta" : ""}`} style={{ color: highlight ? color : "white" }}>{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, error, delay = 0 }: { icon: string; label: string; value: string; highlight?: boolean; error?: boolean; delay?: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 animate-stagger transition-colors hover:bg-white/[0.02]" style={{ animationDelay: `${delay * 0.04}s` }}>
      <div className="flex items-center gap-2 text-white/50">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className={`text-sm font-black ${error ? "text-accent" : highlight ? "text-secondary" : "text-foreground"}`}>
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
