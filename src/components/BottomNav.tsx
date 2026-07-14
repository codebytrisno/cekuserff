"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const TABS = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/compare", label: "Bandingkan", icon: "compare_arrows" },
  { href: "/bookmarks", label: "Bookmark", icon: "bookmark" },
  { href: "/history", label: "Riwayat", icon: "history" },
];

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35"];

function RippleEffect({ color }: { color: string }) {
  return (
    <span
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <span
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          animation: "ripple-out 0.6s ease-out forwards",
        }}
      />
    </span>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 z-50 w-full border-t-4 border-accent bg-surface/95 px-2 pb-2 shadow-[0_-4px_20px_rgba(255,58,242,0.3)] backdrop-blur-xl animate-slide-up"
      style={{ borderRadius: "24px 24px 0 0", animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <div className="flex h-20 items-center justify-around">
        {TABS.map((tab, i) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-4 py-2 transition-all duration-300 active:scale-90 overflow-hidden ${
                isActive
                  ? "font-black uppercase tracking-widest scale-105"
                  : "opacity-50 hover:opacity-90 hover:scale-105"
              }`}
              style={isActive ? {
                color: color,
                textShadow: `0 0 12px ${color}60`,
                background: `${color}15`,
              } : { color: "white" }}
            >
              {isActive && (
                <span
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full animate-scale-bounce"
                  style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
                />
              )}
              <span
                className="material-symbols-outlined text-2xl transition-all duration-300"
                style={isActive ? {
                  fontVariationSettings: "'FILL' 1",
                  filter: `drop-shadow(0 0 6px ${color}50)`,
                } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider transition-all duration-300">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <a
        href="https://codebytrisno.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block pb-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] gradient-text transition-colors hover:animate-scale-bounce"
      >
        CodeByTrisno
      </a>
    </nav>
  );
}
