import type { PlayerData, Bookmark, Snapshot } from "@/types";

export function updateBookmarkSnapshot(
  bookmark: Bookmark,
  fresh: PlayerData,
): { updated: Bookmark; trend: "up" | "down" | null } {
  const newSnapshot: Snapshot = {
    kd: fresh.kd,
    rank: fresh.rank,
    rankPoints: fresh.rankPoints,
    headshot: fresh.headshots,
    recordedAt: Date.now(),
  };

  const lastKd = bookmark.snapshots.length > 0
    ? bookmark.snapshots[bookmark.snapshots.length - 1].kd
    : fresh.kd;

  const trend = fresh.kd > lastKd ? "up" : fresh.kd < lastKd ? "down" : null;

  const updated: Bookmark = {
    ...bookmark,
    name: fresh.name,
    level: fresh.level,
    rank: fresh.rank,
    kd: fresh.kd,
    headshot: fresh.headshots,
    guild: fresh.guild,
    avatar: fresh.avatar,
    lastCheckedAt: Date.now(),
    snapshots: [...bookmark.snapshots, newSnapshot].slice(-10),
  };

  return { updated, trend };
}
