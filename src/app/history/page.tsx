"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function HistoryPage() {
  const router = useRouter();
  const authed = useAuthGuard();

  useEffect(() => {
    if (authed) {
      router.replace("/bookmarks?tab=history");
    }
  }, [router, authed]);

  return null;
}
