"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-client";

interface Props {
  title?: string;
  showBookmark?: boolean;
  showShare?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
}

type PremiumInfo = {
  tier: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
};

const TIER_LABEL: Record<string, string> = {
  weekly: "Premium Mingguan",
  monthly: "Premium Bulanan",
  lifetime: "Premium Lifetime",
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TopAppBar({
  title = "CEKUSERFF",
  showBookmark,
  showShare,
  onBookmark,
  onShare,
  isBookmarked,
}: Props) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premium, setPremium] = useState<PremiumInfo | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const premiumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (premiumRef.current && !premiumRef.current.contains(e.target as Node)) setPremiumOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setPremium(null);
      return;
    }
    fetch("/api/user/premium")
      .then((r) => r.json())
      .then(setPremium)
      .catch(() => setPremium(null));
  }, [isAuthenticated, user]);

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.back()}
          className="active:scale-95 transition-transform text-on-surface"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="material-symbols-outlined text-primary-container text-2xl">local_fire_department</span>
        <span className="font-headline-h2 text-[20px] font-bold text-on-surface">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {showBookmark && (
          <button
            onClick={onBookmark}
            className="active:scale-95 transition-transform text-on-surface hover:opacity-80"
          >
            <span
              className="material-symbols-outlined"
              style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
          </button>
        )}
        {showShare && (
          <button
            onClick={onShare}
            className="active:scale-95 transition-transform text-on-surface hover:opacity-80"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        )}

        {isAuthenticated && user && (
          <div ref={premiumRef} className="relative">
            <button
              onClick={() => setPremiumOpen(!premiumOpen)}
              className="active:scale-95 transition-transform text-primary-container hover:opacity-80"
            >
              <span className={`material-symbols-outlined ${premium?.isActive ? "text-primary-container" : "text-on-surface-variant"}`}>
                workspace_premium
              </span>
            </button>
            {premiumOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high shadow-lg">
                <div className="border-b border-outline-variant/50 px-4 py-3 text-center">
                  <span className="material-symbols-outlined text-2xl text-primary-container">workspace_premium</span>
                  <p className="mt-1 text-sm font-semibold text-on-surface">STATUS PAKET</p>
                </div>
                {premium?.tier && premium.isActive ? (
                  <div className="space-y-2 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Tier</span>
                      <span className="text-sm font-semibold text-on-surface">
                        {TIER_LABEL[premium.tier] ?? premium.tier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Status</span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Diaktifkan</span>
                      <span className="text-sm text-on-surface">{fmtDate(premium.activatedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">Berakhir</span>
                      <span className="text-sm text-on-surface">
                        {premium.tier === "lifetime" ? "Selamanya" : fmtDate(premium.expiresAt)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-center">
                    <p className="text-sm text-on-surface-variant">Belum memiliki paket premium</p>
                    <button
                      onClick={() => { router.push("/premium"); setPremiumOpen(false); }}
                      className="mt-2 rounded-lg bg-primary-container px-3 py-1.5 text-xs font-semibold text-on-primary transition-colors hover:opacity-90"
                    >
                      Lihat Paket
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div ref={ref} className="relative">
          {isAuthenticated && user ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm font-bold text-primary-container transition-colors hover:bg-primary-container/30"
              >
                  {(user.name ?? user.email ?? "?").charAt(0)}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high shadow-lg">
                  <div className="border-b border-outline-variant/50 px-4 py-3">
                     <p className="text-sm font-semibold text-on-surface">{user.name ?? user.email}</p>
                    <p className="text-xs text-on-surface-variant">@{user.username ?? user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-on-surface transition-colors hover:bg-surface-container-higher"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-2 py-1.5 text-[11px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
