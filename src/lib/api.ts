import type { PlayerData } from "@/types";
import { UID_REGEX } from "./constants";

export async function fetchPlayer(uid: string): Promise<PlayerData> {
  const cleanUid = uid.trim();

  if (!UID_REGEX.test(cleanUid)) {
    throw new Error("UID harus 8-12 digit angka");
  }

  const res = await fetch(`/api/player/${cleanUid}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Player tidak ditemukan");
    }
    if (res.status === 429) {
      throw new Error("Terlalu banyak request. Coba lagi nanti.");
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Gagal memuat data. Coba lagi.");
  }

  const data = await res.json();
  return data as PlayerData;
}
