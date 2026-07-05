"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PremiumTier } from "./premium";
import { usePremium } from "./premium";

export interface ManagedUser {
  username: string;
  password: string;
  label: string;
  plan: PremiumTier;
  createdAt: number;
}

interface AdminStore {
  users: ManagedUser[];
  addUser: (user: ManagedUser) => boolean;
  removeUser: (username: string) => void;
  findByCredentials: (username: string, password: string) => ManagedUser | null;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      users: [],

      addUser: (user) => {
        const existing = get().users.find((u) => u.username === user.username);
        if (existing) return false;
        set({ users: [...get().users, user] });
        return true;
      },

      removeUser: (username) => {
        set({ users: get().users.filter((u) => u.username !== username) });
      },

      findByCredentials: (username, password) => {
        const user = get().users.find(
          (u) => u.username === username.toLowerCase().trim() && u.password === password
        );
        return user ?? null;
      },
    }),
    {
      name: "ff-checker-admin-users",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function activateManagedUser(managedUser: ManagedUser) {
  const plan = managedUser.plan;
  const durations: Record<string, number> = {
    weekly: 7,
    monthly: 30,
    lifetime: 0,
  };
  const duration = durations[plan] ?? 0;
  usePremium.getState().activate({ tier: plan, duration, uid: managedUser.username });
}
