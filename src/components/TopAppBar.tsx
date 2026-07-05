"use client";

import { useRouter } from "next/navigation";

interface Props {
  title?: string;
  showBookmark?: boolean;
  showShare?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
  backHref?: string;
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
      </div>
    </header>
  );
}
