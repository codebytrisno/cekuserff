"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthStore, AuthUser } from "@/types";

const ACCOUNTS: Record<string, string> = {
  trisno: "admin123",
  dev: "dev123",
  owner: "owner123",
  kyy: "201307",
};

const PROFILES: Record<string, AuthUser> = {
  trisno: { username: "trisno", label: "Trisno" },
  dev: { username: "dev", label: "Developer" },
  owner: { username: "owner", label: "Owner" },
  kyy: { username: "kyy", label: "Kyy" },
};

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const key = username.toLowerCase().trim();
        if (ACCOUNTS[key] && ACCOUNTS[key] === password) {
          set({ user: PROFILES[key], isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "ff-checker-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
