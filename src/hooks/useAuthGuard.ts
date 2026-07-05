"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function useAuthGuard() {
  const router = useRouter();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useAuth.persist.hasHydrated()) {
      setReady(true);
    } else {
      const unsub = useAuth.persist.onFinishHydration(() => setReady(true));
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, ready, router]);

  return isAuthenticated && ready;
}
