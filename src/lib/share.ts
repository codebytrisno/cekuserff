import type { PlayerData } from "@/types";

export async function sharePlayerCard(data: PlayerData): Promise<boolean> {
  try {
    await navigator.share({
      title: `${data.name} - CEKUSERFF`,
      text: `🎮 ${data.name} | UID: ${data.uid}\n🏆 Rank: ${data.rank}\n💀 K/D: ${data.kd} | 🎯 HS: ${data.headshots}\n📊 WR: ${data.brWinRate}%\n\nCek di CEKUSERFF!`,
      url: `${window.location.origin}/player/${data.uid}`,
    });
    return true;
  } catch {
    return fallbackShare(data);
  }
}

async function fallbackShare(data: PlayerData): Promise<boolean> {
  const text = `🎮 CEKUSERFF\n\nPlayer: ${data.name}\nUID: ${data.uid}\nRank: ${data.rank}\nK/D: ${data.kd}\nHS: ${data.headshots}\nWR: ${data.brWinRate}%\n\n${window.location.origin}/player/${data.uid}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
