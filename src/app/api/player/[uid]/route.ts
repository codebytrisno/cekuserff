import { NextResponse } from "next/server";

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
  if (points >= 1600) return 1800;
  if (points >= 1400) return 1600;
  return 1400;
}

function formatDate(ts: string): string {
  const date = new Date(parseInt(ts) * 1000);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatTimeAgo(ts: string): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - parseInt(ts);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j ago`;
  return `${Math.floor(diff / 86400)}h ago`;
}

function calcAccountAge(ts: string): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - parseInt(ts);
  const years = Math.floor(diff / (86400 * 365));
  if (years >= 1) return `${years} Year${years > 1 ? "s" : ""}`;
  const months = Math.floor(diff / (86400 * 30));
  if (months >= 1) return `${months} Month${months > 1 ? "s" : ""}`;
  const days = Math.floor(diff / 86400);
  return `${days} Day${days > 1 ? "s" : ""}`;
}

const REGIONS = ["sg", "ind", "br", "id", "bd", "pk"];

function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; ; i++) {
    const key = process.env[`FF_API_KEY${i === 1 ? "" : `_${i}`}` as keyof typeof process.env] as string | undefined;
    if (!key) break;
    keys.push(key);
  }
  return keys;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let body: any = null;
  for (const key of apiKeys) {
    for (const region of REGIONS) {
      const url = `https://developers.freefirecommunity.com/api/v1/info?uid=${uid}&region=${region}&key=${key}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      });
      if (res.ok) { body = await res.json(); break; }
      if (res.status === 500) break;
    }
    if (body) break;
  }

  if (!body) return NextResponse.json({ error: "Player tidak ditemukan" }, { status: 404 });

  const info = body.basicInfo;
  const clan = body.clanBasicInfo || {};
  const social = body.socialInfo || {};
  const pet = body.petInfo || {};
  const profile = body.profileInfo || {};
  const credit = body.creditScoreInfo || {};
  const diamond = body.diamondCostRes || {};
  const captain = body.captainBasicInfo || {};

  if (!info) return NextResponse.json({ error: "Player tidak ditemukan" }, { status: 404 });

  const points = info.rankingPoints || 0;

  let isBanned = false;
  let banPeriod = 0;
  for (const key of apiKeys) {
    try {
      const res = await fetch(
        `https://developers.freefirecommunity.com/api/v1/bancheck?uid=${uid}&key=${key}`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } },
      );
      if (res.ok) {
        const banData = await res.json();
        isBanned = banData?.data?.is_banned === 1;
        banPeriod = banData?.data?.period || 0;
        break;
      }
    } catch {}
  }

  let brKills = 0, brWins = 0, brMatches = 0, brDeaths = 0;
  let brHeadshots = 0, brHeadshotKills = 0, brDamage = 0;
  let brHighestKills = 0, brRevives = 0, brTopN = 0;
  let csKills = 0, csWins = 0, csMatches = 0;
  for (const key of apiKeys) {
    for (const region of REGIONS) {
      try {
        const url = `https://developers.freefirecommunity.com/api/v1/stats?uid=${uid}&region=${region}&key=${key}`;
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        });
        if (!res.ok) continue;
        const rawStats = await res.json();
        const d = rawStats?.data;
        if (!d) continue;
        for (const mode of [d.soloStats, d.duoStats, d.quadStats, d.solostats, d.duostats, d.quadstats]) {
          if (!mode) continue;
          brMatches += mode.gamesPlayed || mode.gamesplayed || 0;
          brWins += mode.wins || 0;
          brKills += mode.kills || 0;
          brDeaths += mode.detailedStats?.deaths || mode.detailedstats?.deaths || 0;
          brHeadshots += mode.detailedStats?.headshots || mode.detailedstats?.headshots || 0;
          brHeadshotKills += mode.detailedStats?.headshotKills || mode.detailedstats?.headshotkills || 0;
          brDamage += mode.detailedStats?.damage || mode.detailedstats?.damage || 0;
          brRevives += mode.detailedStats?.revives || mode.detailedstats?.revives || 0;
          brTopN += mode.detailedStats?.topNTimes || mode.detailedstats?.topNTimes || 0;
          const hk = mode.detailedStats?.highestKills || mode.detailedstats?.highestkills || 0;
          if (hk > brHighestKills) brHighestKills = hk;
        }
        if (d.csStats || d.csstats) {
          const cs = d.csStats || d.csstats;
          csMatches = cs.gamesPlayed || cs.gamesplayed || 0;
          csWins = cs.wins || 0;
          csKills = cs.kills || 0;
        }
        break;
      } catch {}
    }
    if (brMatches > 0) break;
  }

  const player = {
    uid,
    name: info.nickname || "Tidak Diketahui",
    level: info.level || 0,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.nickname || "FF")}`,
    guild: clan.clanName || null,
    server: REGION_MAP[info.region] || info.region || "Global",
    kd: brDeaths > 0 ? parseFloat((brKills / brDeaths).toFixed(2)) : brKills > 0 ? brKills : 0,
    wins: brWins,
    headshots: brHeadshots,
    kills: brKills,
    deaths: brDeaths,
    rank: getRank(points),
    rankPoints: points,
    rankMaxPoints: getRankMax(points),
    csRankPoints: info.csRankingPoints || 0,
    csRank: info.csRank || 0,
    csMaxRank: info.csMaxRank || 0,
    maxRank: info.maxRank || 0,
    totalMatches: brMatches,
    brWins, brKills, brDeaths,
    brHeadshots, brHeadshotKills, brDamage,
    brHighestKills, brRevives, brTopN,
    brWinRate: brMatches > 0 ? parseFloat(((brWins / brMatches) * 100).toFixed(1)) : 0,
    csMatches, csWins, csKills,
    accountAge: info.createAt ? calcAccountAge(info.createAt) : "Tidak Diketahui",
    accountCreatedAt: info.createAt ? formatDate(info.createAt) : null,
    lastActive: info.lastLoginAt ? formatTimeAgo(info.lastLoginAt) : "Unknown",
    online: false, inGame: false,
    isBanned, banPeriod,
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
    headPic: info.headPic || 0,
    clanLevel: clan.clanLevel || 0,
    clanMembers: clan.memberNum || 0,
    clanCapacity: clan.capacity || 0,
    primeLevel: captain.primePrivilegeDetail?.primeLevel || 0,
    weaponSkins: captain.weaponSkinShows || [],
    petId: String(pet.id || ""),
    avatarId: profile.avatarId || "",
    clothes: profile.clothes || [],
    skills: profile.equipedSkills || [],
  };

  return NextResponse.json(player);
}
