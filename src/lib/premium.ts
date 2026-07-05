"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PremiumTier = "none" | "weekly" | "monthly" | "lifetime";

interface PremiumStore {
  tier: PremiumTier;
  activatedAt: number | null;
  expiresAt: number | null;
  uid: string | null;
  activate: (params: { tier: PremiumTier; duration: number; uid: string }) => void;
  deactivate: () => void;
  isPremium: () => boolean;
}

export const usePremium = create<PremiumStore>()(
  persist(
    (set, get) => ({
      tier: "none",
      activatedAt: null,
      expiresAt: null,
      uid: null,

      activate: ({ tier, duration, uid }) => {
        const now = Date.now();
        set({
          tier,
          uid,
          activatedAt: now,
          expiresAt: duration > 0 ? now + duration * 24 * 60 * 60 * 1000 : null,
        });
      },

      deactivate: () => {
        set({ tier: "none", activatedAt: null, expiresAt: null, uid: null });
      },

      isPremium: () => {
        const state = get();
        if (state.tier === "lifetime") return true;
        if (state.tier === "none") return false;
        if (state.expiresAt && state.expiresAt < Date.now()) {
          set({ tier: "none", activatedAt: null, expiresAt: null });
          return false;
        }
        return true;
      },
    }),
    { name: "ff-checker-premium" },
  ),
);

export function useIsPremium() {
  const tier = usePremium((s) => s.tier);
  const expiresAt = usePremium((s) => s.expiresAt);
  if (tier === "lifetime") return true;
  if (tier === "none") return false;
  if (expiresAt && expiresAt < Date.now()) return false;
  return true;
}
