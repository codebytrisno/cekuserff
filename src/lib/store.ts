"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerData, Bookmark, HistoryItem, Settings, Store } from "@/types";
import { MAX_BOOKMARKS, MAX_HISTORY, DEFAULT_SERVER } from "./constants";

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      history: [],
      playerCache: {},
      settings: {
        theme: "dark",
        defaultServer: DEFAULT_SERVER,
      },

      addBookmark: (player: PlayerData) => {
        const { bookmarks } = get();
        if (bookmarks.length >= MAX_BOOKMARKS) return;
        if (bookmarks.some((b) => b.uid === player.uid)) return;

        const bookmark: Bookmark = {
          uid: player.uid,
          name: player.name,
          level: player.level,
          rank: player.rank,
          kd: player.kd,
          headshot: player.headshots,
          guild: player.guild,
          avatar: player.avatar,
          addedAt: Date.now(),
          lastCheckedAt: Date.now(),
          snapshots: [
            {
              kd: player.kd,
              rank: player.rank,
              rankPoints: player.rankPoints,
              headshot: player.headshots,
              recordedAt: Date.now(),
            },
          ],
        };

        set({
          bookmarks: [bookmark, ...bookmarks],
          playerCache: { ...get().playerCache, [player.uid]: player },
        });
      },

      removeBookmark: (uid: string) => {
        set({ bookmarks: get().bookmarks.filter((b) => b.uid !== uid) });
      },

      addHistory: (player: PlayerData) => {
        const { history } = get();
        const filtered = history.filter((h) => h.uid !== player.uid);
        const item: HistoryItem = {
          uid: player.uid,
          name: player.name,
          level: player.level,
          checkedAt: Date.now(),
        };
        set({
          history: [item, ...filtered].slice(0, MAX_HISTORY),
          playerCache: { ...get().playerCache, [player.uid]: player },
        });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      setPlayerCache: (uid: string, data: PlayerData) => {
        set({ playerCache: { ...get().playerCache, [uid]: data } });
      },

      updateSettings: (partial: Partial<Settings>) => {
        set({ settings: { ...get().settings, ...partial } });
      },
    }),
    {
      name: "ff-checker-storage",
    },
  ),
);
