"use client";

import { useState, useCallback } from "react";
import type { PlayerData, PlayerState } from "@/types";
import { fetchPlayer } from "@/lib/api";

export function usePlayer() {
  const [state, setState] = useState<PlayerState>({
    data: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async (uid: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await fetchPlayer(uid);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, search, reset };
}
