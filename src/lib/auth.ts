"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthStore, AuthUser } from "@/types";
import { useAdminStore, activateManagedUser } from "./adminStore";

const ACCOUNTS: Record<string, string> = {
  codebytrisno: "iCa.syG.1405",
};

const PROFILES: Record<string, AuthUser> = {
  codebytrisno: { username: "codebytrisno", label: "Admin" },
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

        const managed = useAdminStore.getState().findByCredentials(key, password);
        if (managed) {
          const label = managed.label || managed.username;
          set({ user: { username: managed.username, label }, isAuthenticated: true });
          activateManagedUser(managed);
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
