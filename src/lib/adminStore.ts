"use client";

import { create } from "zustand";
import type { PremiumTier } from "./premium";
import { usePremium } from "./premium";

const STORAGE_KEY = "ff-checker-admin-users";

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

function loadUsers(): ManagedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users: ManagedUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: loadUsers(),

  addUser: (user) => {
    const users = get().users;
    if (users.find((u) => u.username === user.username)) return false;
    const updated = [...users, user];
    saveUsers(updated);
    set({ users: updated });
    return true;
  },

  removeUser: (username) => {
    const updated = get().users.filter((u) => u.username !== username);
    saveUsers(updated);
    set({ users: updated });
  },

  findByCredentials: (username, password) => {
    const key = username.toLowerCase().trim();

    // Always read fresh from localStorage to avoid stale state
    const users = loadUsers();
    if (users.length > 0) {
      set({ users });
    }

    const user = users.find(
      (u) => u.username === key && u.password === password
    );
    return user ?? null;
  },
}));

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
