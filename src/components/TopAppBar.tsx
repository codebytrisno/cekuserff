"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Props {
  title?: string;
  showBookmark?: boolean;
  showShare?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <a
          href="https://sociabuzz.com/trisnosanjaya"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg bg-primary-container/10 px-2 py-1 text-[11px] font-semibold text-primary-container transition-colors hover:bg-primary-container/20"
        >
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </a>
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

        <div ref={ref} className="relative">
          {isAuthenticated && user ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm font-bold text-primary-container transition-colors hover:bg-primary-container/30"
              >
                {user.label.charAt(0)}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high shadow-lg">
                  <div className="border-b border-outline-variant/50 px-4 py-3">
                    <p className="text-sm font-semibold text-on-surface">{user.label}</p>
                    <p className="text-xs text-on-surface-variant">@{user.username}</p>
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
              onClick={() => router.push("/auth")}
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
