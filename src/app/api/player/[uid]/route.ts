import { NextResponse } from "next/server";
import { getProfile, getBRStats, getCSStats } from "@/lib/ff-api";

const REGION_MAP: Record<string, string> = {
  BD: "Bangladesh", IND: "India", BR: "Brazil",
  ID: "Indonesia", SG: "Singapore", PK: "Pakistan",
  VN: "Vietnam", TH: "Thailand", US: "United States",
  RU: "Russia", TW: "Taiwan", ME: "Middle East",
  CIS: "CIS",
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

function formatDate(ts: number | string): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatTimeAgo(ts: number | string): string {
  const diff = Math.floor(Date.now() / 1000) - Number(ts);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j ago`;
  return `${Math.floor(diff / 86400)}h ago`;
}

function calcAccountAge(ts: number | string): string {
  const diff = Math.floor(Date.now() / 1000) - Number(ts);
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

const ADENPEDIA_URL = "https://adenpedia.my.id/c5198248e9325989k123xc34910xfreefire192103sdhj34823490asdfi91238/info.php";

async function fetchFromAdenpedia(uid: string) {
  const res = await fetch(`${ADENPEDIA_URL}?uid=${uid}`, {
    signal: AbortSignal.timeout(10000),
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CEKUSERFF/1.0; +https://cekuserff.vercel.app)",
      "Accept": "application/json",
      "Referer": "https://adenpedia.my.id/",
    },
  });
  if (!res.ok) throw new Error("Adenpedia proxy returned " + res.status);
  return res.json();
}

function adenpediaToPlayerData(raw: any, uid: string) {
  const info = raw.basicInfo || {};
  const clan = raw.clanBasicInfo || {};
  const social = raw.socialInfo || {};
  const pet = raw.petInfo || {};
  const credit = raw.creditScoreInfo || {};
  const diamond = raw.diamondCostRes || {};
  const profileInfo = raw.profileInfo || {};

  return {
    uid,
    name: info.nickname || "Tidak Diketahui",
    level: info.level || 0,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.nickname || "FF")}`,
    guild: clan.clanName || null,
    server: REGION_MAP[info.region] || info.region || "Global",
    kd: 0,
    wins: 0,
    headshots: 0,
    kills: 0,
    deaths: 0,
    rank: getRank(info.rankingPoints || 0),
    rankPoints: info.rankingPoints || 0,
    rankMaxPoints: getRankMax(info.rankingPoints || 0),
    csRankPoints: info.csRankingPoints || 0,
    csRank: info.csRank || 0,
    csMaxRank: info.csMaxRank || 0,
    maxRank: info.maxRank || 0,
    totalMatches: 0,
    brWins: 0,
    brKills: 0,
    brDeaths: 0,
    brHeadshots: 0,
    brHeadshotKills: 0,
    brDamage: 0,
    brHighestKills: 0,
    brRevives: 0,
    brTopN: 0,
    brWinRate: 0,
    csMatches: 0,
    csWins: 0,
    csKills: 0,
    accountAge: info.createAt ? calcAccountAge(info.createAt) : "Tidak Diketahui",
    accountCreatedAt: info.createAt ? formatDate(info.createAt) : null,
    lastActive: info.lastLoginAt ? formatTimeAgo(info.lastLoginAt) : "Unknown",
    online: false,
    inGame: false,
    isBanned: false,
    banPeriod: 0,
    exp: info.exp || 0,
    liked: info.liked || 0,
    seasonId: info.seasonId || 0,
    creditScore: credit.creditScore || 0,
    diamondCost: diamond.diamondCost || 0,
    signature: social.signature || "",
    language: social.language || "",
    petLevel: pet.level || 0,
    badges: info.badgeCnt || 0,
    title: info.title || null,
    releaseVersion: info.releaseVersion || "",
    headPic: 0,
    clanLevel: clan.clanLevel || 0,
    clanMembers: clan.memberNum || 0,
    clanCapacity: clan.capacity || 0,
    primeLevel: (info.primeInfo && info.primeInfo.primeLevel) || 0,
    weaponSkins: info.weaponSkinShows || [],
    petId: String(pet.id || ""),
    avatarId: String(profileInfo.avatarId || ""),
    clothes: profileInfo.clothes || [],
    skills: profileInfo.equipedSkills || [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const cached = getCached(uid);
  if (cached) return NextResponse.json(cached);

  try {
    const [profile, brStats, csData] = await Promise.all([
      getProfile(uid).catch(() => null),
      getBRStats(uid).catch(() => null),
      getCSStats(uid).catch(() => null),
    ]);

    if (profile && profile.basicinfo) {
      const info = profile.basicinfo;
      const clan = profile.clanbasicinfo || {};
      const social = profile.socialinfo || {};
      const pet = profile.petinfo || {};
      const credit = profile.creditscoreinfo || {};
      const diamond = profile.diamondcostres || {};
      const captain = profile.captionbasicinfo || profile.captainbasicinfo || {};
      const profileInfo = profile.profileinfo || {};

      let brKills = 0, brWins = 0, brMatches = 0, brDeaths = 0;
      let brHeadshots = 0, brHeadshotKills = 0, brDamage = 0;
      let brHighestKills = 0, brRevives = 0, brTopN = 0;

      if (brStats) {
        for (const mode of [brStats.solo, brStats.duo, brStats.quad]) {
          if (!mode) continue;
          brMatches += mode.gamesplayed || 0;
          brWins += mode.wins || 0;
          brKills += mode.kills || 0;
          const ds = mode.detailedstats || mode.detailedStats || {};
          brDeaths += ds.deaths || 0;
          brHeadshots += ds.headshots || 0;
          brHeadshotKills += ds.headshotkills || ds.headshotKills || 0;
          brDamage += ds.damage || 0;
          brRevives += ds.revives || 0;
          brTopN += ds.topntimes || ds.topNTimes || 0;
          const hk = ds.highestkills || ds.highestKills || 0;
          if (hk > brHighestKills) brHighestKills = hk;
        }
      }

      let csMatches = 0, csWins = 0, csKills = 0;
      if (csData) {
        csMatches = csData.gamesplayed || 0;
        csWins = csData.wins || 0;
        csKills = csData.kills || 0;
      }

      const points = 0;

      const player = {
        uid,
        name: info.nickname || "Tidak Diketahui",
        level: info.level || 0,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.nickname || "FF")}`,
        guild: clan.clanname || null,
        server: REGION_MAP[info.region] || info.region || "Global",
        kd: brDeaths > 0 ? parseFloat((brKills / brDeaths).toFixed(2)) : brKills > 0 ? brKills : 0,
        wins: brWins,
        headshots: brHeadshots,
        kills: brKills,
        deaths: brDeaths,
        rank: getRank(points),
        rankPoints: points,
        rankMaxPoints: getRankMax(points),
        csRankPoints: 0,
        csRank: 0,
        csMaxRank: 0,
        maxRank: 0,
        totalMatches: brMatches,
        brWins,
        brKills,
        brDeaths,
        brHeadshots,
        brHeadshotKills,
        brDamage,
        brHighestKills,
        brRevives,
        brTopN,
        brWinRate: brMatches > 0 ? parseFloat(((brWins / brMatches) * 100).toFixed(1)) : 0,
        csMatches,
        csWins,
        csKills,
        accountAge: info.createat ? calcAccountAge(info.createat) : "Tidak Diketahui",
        accountCreatedAt: info.createat ? formatDate(info.createat) : null,
        lastActive: info.lastloginat ? formatTimeAgo(info.lastloginat) : "Unknown",
        online: false,
        inGame: false,
        isBanned: false,
        banPeriod: 0,
        exp: info.exp || 0,
        liked: info.liked || 0,
        seasonId: 0,
        creditScore: credit.creditscore || 0,
        diamondCost: diamond.diamondcost || 0,
        signature: social.signature || "",
        language: social.language || "",
        petLevel: pet.level || 0,
        badges: 0,
        title: null,
        releaseVersion: "",
        headPic: 0,
        clanLevel: clan.clanlevel || 0,
        clanMembers: clan.membernum || 0,
        clanCapacity: clan.capacity || 0,
        primeLevel: captain.primeprivilegedetail?.primelevel || 0,
        weaponSkins: [],
        petId: String(pet.id || ""),
        avatarId: String(profileInfo.avatarid || ""),
        clothes: profileInfo.clothes || [],
        skills: profileInfo.equipedskills || [],
      };

      setCache(uid, player);
      return NextResponse.json(player);
    }

    console.log("[fallback] Garena API failed, trying adenpedia proxy for", uid);
    const adenpediaData = await fetchFromAdenpedia(uid);
    if (!adenpediaData || !adenpediaData.basicInfo) {
      return NextResponse.json({ error: "Player tidak ditemukan" }, { status: 404 });
    }

    const player = adenpediaToPlayerData(adenpediaData, uid);
    setCache(uid, player);
    return NextResponse.json(player);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}