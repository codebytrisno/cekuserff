"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown } from "lucide-react";

const tabs = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/compare", label: "Bandingkan", icon: "compare_arrows" },
  { href: "/premium", label: "Premium", icon: "premium" },
  { href: "/bookmarks", label: "Bookmark", icon: "bookmark" },
  { href: "/history", label: "Riwayat", icon: "history" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full rounded-t-xl border-t border-outline-variant bg-surface-container/90 px-2 pb-2 shadow-[0_-4px_12px_rgba(255,107,53,0.1)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                isActive
                  ? "rounded-full bg-primary/10 px-4 py-1 font-bold text-primary-container"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {tab.icon === "premium" ? (
                <Crown className={`h-6 w-6 ${isActive ? "text-primary-container" : "text-primary-container/70"}`} />
              ) : (
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
              )}
              <span className="font-label-sm text-[12px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <a
        href="https://codebytrisno.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block pb-1 text-center text-[11px] font-semibold tracking-wider text-primary-container/60 transition-colors hover:text-primary-container"
      >
        CodeByTrisno
      </a>
    </nav>
  );
}
