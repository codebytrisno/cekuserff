import { NextResponse } from "next/server";

const UA = "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36";
const REGIONS = ["id", "ind"];
const REGION_MAP: Record<string, string> = {
  BD: "Bangladesh", IND: "India", BR: "Brazil",
  ID: "Indonesia", SG: "Singapore", PK: "Pakistan",
};

function getRank(points: number): string {
  if (points >= 2600) return "Grandmaster";
  if (points >= 2200) return "Heroic";
  if (points >= 2000) return "Diamond";
  if (points >= 1800) return "Platinum";
  if (points >= 1600) return "Gold";
  if (points >= 1400) return "Silver";
  return "Bronze";
}

function getRankMax(points: number): number {
  if (points >= 2600) return points;
  if (points >= 2200) return 2600;
  if (points >= 2000) return 2200;
  if (points >= 1800) return 2000;
  if (points >= 1400) return 1600;
  return 1400;
}

function formatDate(ts: string): string {
  return new Date(parseInt(ts) * 1000).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatTimeAgo(ts: string): string {
  const diff = Math.floor(Date.now() / 1000) - parseInt(ts);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j ago`;
  return `${Math.floor(diff / 86400)}h ago`;
}

function calcAccountAge(ts: string): string {
  const diff = Math.floor(Date.now() / 1000) - parseInt(ts);
  const years = Math.floor(diff / (86400 * 365));
  if (years >= 1) return `${years} Year${years > 1 ? "s" : ""}`;
  const months = Math.floor(diff / (86400 * 30));
  if (months >= 1) return `${months} Month${months > 1 ? "s" : ""}`;
  const days = Math.floor(diff / 86400);
  return `${days} Day${days > 1 ? "s" : ""}`;
}

const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 300_000;

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
  if (cache.size > 200) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
}

// ── HL Gaming API ──────────────────────────────────────────
interface HLAccountInfo {
  AccountName: string; AccountLevel: number; AccountEXP: number;
  AccountLikes: number; AccountRegion: string; AccountCreateTime: string;
  AccountLastLogin: string; BrRankPoint: number; BrMaxRank: number;
  CsRankPoint: number; CsRank: number; CsMaxRank: number;
  AccountAvatarId: number; AccountBPBadges: number;
  ReleaseVersion: string; AccountSeasonId: number;
  Title?: number; DiamondCost?: number;
}
interface HLResponse { result: { AccountInfo: HLAccountInfo; GuildInfo?: any; petInfo?: any; socialinfo?: any; creditScoreInfo?: any; captainBasicInfo?: any; AccountProfileInfo?: any } }

async function fetchHL(uid: string): Promise<HLResponse["result"] | null> {
  const useruid = process.env.HL_USERUID;
  const apikey = process.env.HL_API_KEY;
  if (!useruid || !apikey) return null;

  for (const region of REGIONS) {
    try {
      const url = `https://proapis.hlgamingofficial.com/main/games/freefire/account/api?sectionName=AllData&PlayerUid=${uid}&region=${region}&useruid=${useruid}&api=${apikey}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data: HLResponse = await res.json();
      if (data?.result?.AccountInfo) return data.result;
    } catch {}
  }
  return null;
}

// ── Free Fire Community API ────────────────────────────────
function isQuotaExceeded(res: Response): boolean {
  return res.status === 429;
}

async function tryKey(uid: string, path: string, region: string, key: string): Promise<{ ok: boolean; quotaExceeded: boolean; notFound: boolean; data?: any }> {
  // header auth
  const hdr = `https://developers.freefirecommunity.com/api/v1/${path}?uid=${uid}&region=${region}`;
  const r1 = await fetch(hdr, { headers: { "User-Agent": UA, Accept: "application/json", "x-api-key": key } }).catch(() => null);
  if (r1?.ok) return { ok: true, quotaExceeded: false, notFound: false, data: await r1.json() };
  if (r1 && isQuotaExceeded(r1)) return { ok: false, quotaExceeded: true, notFound: false };
  if (r1?.status === 404) return { ok: false, quotaExceeded: false, notFound: true };

  // query param fallback (kalo header auth gak didukung)
  if (r1?.status === 403) {
    const qry = `https://developers.freefirecommunity.com/api/v1/${path}?uid=${uid}&region=${region}&key=${key}`;
    const r2 = await fetch(qry, { headers: { "User-Agent": UA, Accept: "application/json" } }).catch(() => null);
    if (r2?.ok) return { ok: true, quotaExceeded: false, notFound: false, data: await r2.json() };
    if (r2 && isQuotaExceeded(r2)) return { ok: false, quotaExceeded: true, notFound: false };
    if (r2?.status === 404) return { ok: false, quotaExceeded: false, notFound: true };
  }
  return { ok: false, quotaExceeded: false, notFound: false };
}

// ── GET ─────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const cached = getCached(uid);
  if (cached) return NextResponse.json(cached);

  const apiKeys = getApiKeys();

  // 1. Free Fire Community API dengan key rotation
  if (apiKeys.length > 0) {
    let infoData: any = null;
    let usedKey = "";

    let notFound = false;
    for (const key of apiKeys) {
      for (const region of REGIONS) {
        const r = await tryKey(uid, "info", region, key);
        if (r.ok) { infoData = r.data; usedKey = key; break; }
        if (r.notFound) { notFound = true; break; }
        if (r.quotaExceeded) break;
      }
      if (infoData || notFound) break;
    }

    if (notFound) return NextResponse.json({ error: "Player tidak ditemukan" }, { status: 404 });

    if (infoData?.basicInfo) {
      const info = infoData.basicInfo;
      const clan = infoData.clanBasicInfo || {};
      const socialHL = infoData.socialInfo || {};
      const pet = infoData.petInfo || {};
      const profile = infoData.profileInfo || {};
      const credit = infoData.creditScoreInfo || {};
      const diamond = infoData.diamondCostRes || {};
      const captain = infoData.captainBasicInfo || {};
      const points = info.rankingPoints || 0;

      // ban + stats pake key yang sama (sudah terverifikasi work)
      const [banResult, statsData] = await Promise.all([
        (async () => {
          for (const useHeader of [true, false]) {
            const url = useHeader ? `https://developers.freefirecommunity.com/api/v1/bancheck?uid=${uid}` : `https://developers.freefirecommunity.com/api/v1/bancheck?uid=${uid}&key=${usedKey}`;
            const h: Record<string, string> = { "User-Agent": UA };
            if (useHeader) h["x-api-key"] = usedKey;
            const res = await fetch(url, { headers: h }).catch(() => null);
            if (res?.ok) { const d = await res.json(); return { isBanned: d?.data?.is_banned === 1, banPeriod: d?.data?.period || 0 }; }
          }
          return { isBanned: false, banPeriod: 0 };
        })(),
        (async () => {
          for (const region of REGIONS) {
            const r = await tryKey(uid, "stats", region, usedKey);
            if (r.ok) {
              const d = r.data?.data;
              if (!d) break;
              let brKills = 0, brWins = 0, brMatches = 0, brDeaths = 0, brHeadshots = 0, brHeadshotKills = 0, brDamage = 0, brHighestKills = 0, brRevives = 0, brTopN = 0, csKills = 0, csWins = 0, csMatches = 0;
              for (const mode of [d.soloStats, d.duoStats, d.quadStats, d.solostats, d.duostats, d.quadstats]) {
                if (!mode) continue;
                brMatches += mode.gamesPlayed || mode.gamesplayed || 0; brWins += mode.wins || 0; brKills += mode.kills || 0;
                brDeaths += mode.detailedStats?.deaths || mode.detailedstats?.deaths || 0;
                brHeadshots += mode.detailedStats?.headshots || mode.detailedstats?.headshots || 0;
                brHeadshotKills += mode.detailedStats?.headshotKills || mode.detailedstats?.headshotkills || 0;
                brDamage += mode.detailedStats?.damage || mode.detailedstats?.damage || 0;
                brRevives += mode.detailedStats?.revives || mode.detailedstats?.revives || 0;
                brTopN += mode.detailedStats?.topNTimes || mode.detailedstats?.topNTimes || 0;
                const hk = mode.detailedStats?.highestKills || mode.detailedstats?.highestkills || 0;
                if (hk > brHighestKills) brHighestKills = hk;
              }
              if (d.csStats || d.csstats) { const cs = d.csStats || d.csstats; csMatches = cs.gamesPlayed || cs.gamesplayed || 0; csWins = cs.wins || 0; csKills = cs.kills || 0; }
              return { brKills, brWins, brMatches, brDeaths, brHeadshots, brHeadshotKills, brDamage, brHighestKills, brRevives, brTopN, csKills, csWins, csMatches };
            }
            if (r.quotaExceeded) break;
          }
          return {};
        })(),
      ]);

      const { isBanned, banPeriod } = banResult;
      const { brKills = 0, brWins = 0, brMatches = 0, brDeaths = 0, brHeadshots = 0, brHeadshotKills = 0, brDamage = 0, brHighestKills = 0, brRevives = 0, brTopN = 0, csKills = 0, csWins = 0, csMatches = 0 } = statsData;

      const player = {
        uid,
        name: info.nickname || "Tidak Diketahui",
        level: info.level || 0,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.nickname || "FF")}`,
        guild: clan.clanName || null,
        server: REGION_MAP[info.region] || info.region || "Global",
        kd: brDeaths > 0 ? parseFloat((brKills / brDeaths).toFixed(2)) : brKills > 0 ? brKills : 0,
        wins: brWins, headshots: brHeadshots, kills: brKills, deaths: brDeaths,
        rank: getRank(points), rankPoints: points, rankMaxPoints: getRankMax(points),
        csRankPoints: info.csRankingPoints || 0, csRank: info.csRank || 0, csMaxRank: info.csMaxRank || 0, maxRank: info.maxRank || 0,
        totalMatches: brMatches, brWins, brKills, brDeaths,
        brHeadshots, brHeadshotKills, brDamage, brHighestKills, brRevives, brTopN,
        brWinRate: brMatches > 0 ? parseFloat(((brWins / brMatches) * 100).toFixed(1)) : 0,
        csMatches, csWins, csKills,
        accountAge: info.createAt ? calcAccountAge(info.createAt) : "Tidak Diketahui",
        accountCreatedAt: info.createAt ? formatDate(info.createAt) : null,
        lastActive: info.lastLoginAt ? formatTimeAgo(info.lastLoginAt) : "Unknown",
        online: false, inGame: false, isBanned, banPeriod,
        exp: info.exp || 0, liked: info.liked || 0, seasonId: info.seasonId || 0,
        creditScore: credit.creditScore || 0, diamondCost: diamond.diamondCost || 0,
        signature: socialHL.signature || "", language: socialHL.language || "",
        petLevel: pet.level || 0, badges: info.badgeCnt || 0, title: info.title || null,
        releaseVersion: info.releaseVersion || "", headPic: info.headPic || 0,
        clanLevel: clan.clanLevel || 0, clanMembers: clan.memberNum || 0, clanCapacity: clan.capacity || 0,
        primeLevel: captain.primePrivilegeDetail?.primeLevel || 0, weaponSkins: captain.weaponSkinShows || [],
        petId: String(pet.id || ""), avatarId: profile.avatarId || "",
        clothes: profile.clothes || [], skills: profile.equipedSkills || [],
      };
      setCache(uid, player);
      return NextResponse.json(player);
    }
  }

  // 2. Fallback: HL Gaming API (account info only)
  const hl = await fetchHL(uid);
  if (hl) {
    const info = hl.AccountInfo;
    const guild = hl.GuildInfo || {};
    const pet = hl.petInfo || {};
    const social = hl.socialinfo || {};
    const credit = hl.creditScoreInfo || {};
    const captain = hl.captainBasicInfo || {};

    const player = {
      uid,
      name: info.AccountName || "Tidak Diketahui",
      level: info.AccountLevel || 0,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.AccountName || "FF")}`,
      guild: guild.GuildName || null,
      server: REGION_MAP[info.AccountRegion] || info.AccountRegion || "Global",
      kd: 0, kills: 0, deaths: 0, wins: 0,
      headshots: 0, brHeadshots: 0, brHeadshotKills: 0,
      brDamage: 0, brHighestKills: 0, brRevives: 0, brTopN: 0,
      totalMatches: 0, brWins: 0, brKills: 0, brDeaths: 0,
      brWinRate: 0,
      csMatches: 0, csWins: 0, csKills: 0,
      rank: getRank(info.BrRankPoint || 0),
      rankPoints: info.BrRankPoint || 0,
      rankMaxPoints: getRankMax(info.BrRankPoint || 0),
      csRankPoints: info.CsRankPoint || 0,
      csRank: info.CsRank || 0,
      csMaxRank: info.CsMaxRank || 0,
      maxRank: info.BrMaxRank || 0,
      exp: info.AccountEXP || 0,
      liked: info.AccountLikes || 0,
      accountAge: info.AccountCreateTime ? calcAccountAge(info.AccountCreateTime) : "Tidak Diketahui",
      accountCreatedAt: info.AccountCreateTime ? formatDate(info.AccountCreateTime) : null,
      lastActive: info.AccountLastLogin ? formatTimeAgo(info.AccountLastLogin) : "Unknown",
      online: false, inGame: false,
      isBanned: false, banPeriod: 0,
      seasonId: info.AccountSeasonId || 0,
      creditScore: credit.creditScore || 0,
      diamondCost: info.DiamondCost || 0,
      signature: social.AccountSignature || "",
      language: social.AccountLanguage || "",
      petLevel: pet.level || 0,
      badges: info.AccountBPBadges || 0,
      title: info.Title || null,
      releaseVersion: info.ReleaseVersion || "",
      headPic: info.AccountAvatarId || 0,
      clanLevel: guild.GuildLevel || 0,
      clanMembers: guild.GuildMember || 0,
      clanCapacity: guild.GuildCapacity || 0,
      primeLevel: captain.primePrivilegeDetail?.primeLevel || 0,
      weaponSkins: captain.EquippedWeapon || [],
      petId: String(pet.id || ""),
      avatarId: String(info.AccountAvatarId || ""),
      clothes: hl.AccountProfileInfo?.EquippedOutfit || [],
      skills: hl.AccountProfileInfo?.EquippedSkills || [],
    };
    setCache(uid, player);
    return NextResponse.json(player);
  }

  return NextResponse.json({ error: "Server sibuk, coba lagi nanti" }, { status: 503 });
}

function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; ; i++) {
    const key = process.env[`FF_API_KEY${i === 1 ? "" : `_${i}`}` as keyof typeof process.env] as string | undefined;
    if (!key) break;
    keys.push(key);
  }
  return keys;
}
