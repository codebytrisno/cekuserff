import type { PlayerData } from "@/types";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const TINT = {
  pink: "#3A1D58",
  orange: "#3A204D",
  cyan: "#2A2856",
  yellow: "#3A2749",
} as const;

export function PlayerProfileView({ data, uid }: { data: PlayerData; uid?: string }) {
  const displayUid = uid || data.uid;

  return (
    <div className="space-y-6">
      {/* Hero Card — Pink */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-accent p-6 animate-card-entrance"
        style={{ background: TINT.pink, boxShadow: "8px 8px 0 #FFE600, 16px 16px 0 #FF3AF2" }}
      >
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative animate-elastic" style={{ animationDelay: "0.2s" }}>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-accent bg-accent/15 text-4xl font-black text-accent animate-glow-breath mx-auto">
              {data.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -inset-1 rounded-full border-2 border-accent/30 animate-pulse-ring" />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-center gap-2 flex-wrap animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-foreground text-shadow-single">
                {data.name}
              </h1>
              {data.isBanned && (
                <span className="rounded-full border-2 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider animate-elastic border-accent bg-accent/15 text-accent" style={{ animationDelay: "0.3s" }}>BANNED</span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/50 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              UID: <strong className="text-foreground">{displayUid}</strong>
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 flex-wrap animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <span className="rounded-full border-2 border-quinary bg-quinary/15 px-3 py-0.5 text-[10px] font-black uppercase text-quinary">{data.server}</span>
              {data.guild && <span className="text-xs text-white/40">Guild: {data.guild}</span>}
            </div>
          </div>

          {data.guild && (
            <div className="mt-5 w-full rounded-2xl border-2 border-quinary/30 p-4 animate-stagger" style={{ background: TINT.pink, animationDelay: "0.25s" }}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-quinary bg-quinary/15 text-xl font-black text-quinary animate-scale-bounce" style={{ animationDelay: "0.3s" }}>
                  {data.guild.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="font-heading text-base font-black uppercase tracking-wider text-foreground">{data.guild}</span>
                    <span className="text-xs font-bold text-tertiary">(Lv. {data.clanLevel})</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-white/50">
                    <span className="material-symbols-outlined text-sm text-quinary">shield_person</span>
                    <span>Kapten: {data.name}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs text-white/50">
                    <span className="material-symbols-outlined text-sm text-quinary">group</span>
                    <span>{data.clanMembers}/{data.clanCapacity} Member</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-tertiary">verified</span>
                      <span className="text-xs font-bold text-foreground">{data.badges}</span>
                    </div>
                    {data.primeLevel > 0 && (
                      <>
                        <span className="text-white/20">|</span>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-tertiary">workspace_premium</span>
                          <span className="text-xs text-white/50">Prime:</span>
                          <span className="text-xs font-bold text-tertiary">Level {data.primeLevel}</span>
                        </div>
                      </>
                    )}
                    <span className="text-white/20">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-white/50">Estimasi:</span>
                      <span className="text-xs font-bold text-tertiary">{estimatePrice(data)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 w-full grid grid-cols-2 gap-3">
            <InfoItem icon="bar_chart" label="Level" value={String(data.level)} colorIndex={0} delay={0} />
            <InfoItem icon="stars" label="EXP" value={data.exp.toLocaleString()} colorIndex={1} delay={1} />
            <InfoItem icon="favorite" label="Like" value={data.liked.toLocaleString()} colorIndex={2} delay={2} />
            <InfoItem icon="calendar_today" label="Dibuat pada" value={data.accountCreatedAt || data.accountAge} colorIndex={3} delay={3} small />
            <InfoItem icon="schedule" label="Terakhir Login" value={data.lastActive} colorIndex={4} delay={4} small />
            <InfoItem icon="public" label="Server" value={data.server} colorIndex={0} delay={5} />
          </div>

          {data.signature && (
            <div className="mt-4 w-full rounded-xl border-2 border-accent/20 p-3 animate-stagger text-center" style={{ background: TINT.pink, animationDelay: "0.3s" }}>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-1">Bio FreeFire</p>
              <p className="text-sm text-white/70 italic leading-relaxed">"{data.signature}"</p>
            </div>
          )}
        </div>
      </section>

      {/* BR Stats — Orange */}
      {data.totalMatches > 0 && (
        <section className="relative overflow-hidden rounded-3xl border-4 border-quaternary p-6 animate-card-entrance" style={{ animationDelay: "0.3s", background: TINT.orange, boxShadow: "8px 8px 0 #7B2FFF" }}>
          <div className="absolute inset-0 pattern-stripes opacity-15" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-quaternary text-xl animate-wiggle" style={{ fontVariationSettings: "'FILL' 1" }}>stadia_controller</span>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">PERFORMA BATTLE ROYALE</h3>
            </div>
            <div className="w-full grid grid-cols-3 gap-3">
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

      {/* CS Stats — Cyan */}
      {data.csMatches > 0 && (
        <section className="relative overflow-hidden rounded-3xl border-4 border-secondary p-6 animate-card-entrance" style={{ animationDelay: "0.4s", background: TINT.cyan, boxShadow: "8px 8px 0 #FFE600" }}>
          <div className="absolute inset-0 pattern-stripes-cyan opacity-15" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl animate-wiggle" style={{ fontVariationSettings: "'FILL' 1" }}>sports_kabaddi</span>
              <h3 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">PERFORMA CLASH SQUAD</h3>
            </div>
            <div className="w-full grid grid-cols-3 gap-3">
              <StatBox label="Matches" value={data.csMatches.toLocaleString()} colorIndex={0} delay={20} />
              <StatBox label="Wins" value={data.csWins.toLocaleString()} colorIndex={1} delay={21} />
              <StatBox label="Kills" value={data.csKills.toLocaleString()} colorIndex={2} delay={22} />
            </div>
          </div>
        </section>
      )}

      {/* Rank Card — Yellow */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-tertiary p-6 animate-card-entrance" style={{ animationDelay: "0.5s", background: TINT.yellow, boxShadow: "0 0 30px rgba(255,230,0,0.3), 8px 8px 0 #FF3AF2" }}>
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-tertiary bg-tertiary/15 text-2xl font-black text-tertiary animate-scale-bounce" style={{ animationDelay: "0.6s" }}>
              {data.rank.charAt(0)}
            </div>
            <div className="text-center">
              <h3 className="font-heading text-xl font-black uppercase tracking-wider text-foreground">{data.rank} TIER</h3>
              <p className="text-xs text-white/50">Skor Rank: {data.rankPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-white/40">TIER SELANJUTNYA</p>
            <p className="font-heading text-lg font-black uppercase text-quinary animate-glow-breath">{getNextRank(data.rank)}</p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between px-1 text-xs font-bold text-white/50">
              <span>Progres ke {getNextRank(data.rank)}</span>
              <span>{data.rankMaxPoints > 0 ? Math.round((data.rankPoints / data.rankMaxPoints) * 100) : 100}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-accent via-tertiary to-secondary transition-all duration-1000 animate-glow-breath"
                style={{ width: `${data.rankMaxPoints > 0 ? Math.min((data.rankPoints / data.rankMaxPoints) * 100, 100) : 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details — Pink */}
      <section className="overflow-hidden rounded-3xl border-4 border-accent animate-card-entrance"
        style={{ animationDelay: "0.7s", background: TINT.pink, boxShadow: "8px 8px 0 #FFE600" }}>
        <div className="border-b-4 border-dashed border-accent px-6 py-4 text-center" style={{ background: TINT.pink }}>
          <h4 className="font-heading text-lg font-black uppercase tracking-wider text-foreground">DETAIL PROFIL</h4>
        </div>
        <div className="divide-y divide-accent/15">
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
          <DetailRow icon="gavel" label="Status Ban" value={data.isBanned ? `BANNED (${data.banPeriod}h)` : "BERSIH"} highlight={!data.isBanned} error={data.isBanned} delay={15} />
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon, label, value, colorIndex = 0, delay = 0, small }: {
  icon: string; label: string; value: string; colorIndex?: number; delay?: number; small?: boolean;
}) {
  const color = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];
  return (
    <div className="flex flex-col items-center text-center gap-1 rounded-xl border-2 p-3 animate-stagger"
      style={{ background: TINT.pink, borderColor: color + "60", animationDelay: `${0.08 + delay * 0.04}s` }}>
      <span className="material-symbols-outlined text-lg" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-white/40">{label}</p>
        <p className={`font-bold text-foreground ${small ? "text-xs" : "text-sm"}`}>{value}</p>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight, colorIndex = 0, delay = 0 }: { label: string; value: string; highlight?: boolean; colorIndex?: number; delay?: number }) {
  const color = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];
  return (
    <div className="flex flex-col items-center text-center justify-center rounded-2xl border-2 p-3 animate-card-entrance transition-all"
      style={{ background: TINT.orange, borderColor: highlight ? color : color + "40", animationDelay: `${0.1 + delay * 0.05}s`, boxShadow: highlight ? `0 0 15px ${color}30` : undefined }}>
      <span className="text-[10px] font-black uppercase tracking-wider text-white/40">{label}</span>
      <span className={`font-display text-xl ${highlight ? "text-glow-magenta" : ""}`} style={{ color: highlight ? color : "white" }}>{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight, error, delay = 0 }: { icon: string; label: string; value: string; highlight?: boolean; error?: boolean; delay?: number }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-3 animate-stagger gap-1" style={{ animationDelay: `${delay * 0.04}s` }}>
      <div className="flex items-center gap-2 text-white/50">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className={`text-sm font-black ${error ? "text-accent" : highlight ? "text-secondary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function getNextRank(rank: string): string {
  const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"];
  const idx = ranks.indexOf(rank);
  if (idx === -1 || idx >= ranks.length - 1) return "MAX";
  return ranks[idx + 1];
}

function estimatePrice(data: PlayerData): string {
  const base = (data.level * 5000) + (data.primeLevel * 500000) + (data.badges * 10000) + (data.exp * 0.5);
  const formatted = Math.round(base).toLocaleString("id-ID");
  return `Rp${formatted}`;
}