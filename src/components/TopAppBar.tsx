"use client";

import { useRouter } from "next/navigation";

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

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b-4 border-accent bg-surface/90 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="active:scale-90 transition-transform text-foreground hover:text-accent"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        <span className="font-heading text-xl font-black uppercase tracking-wider text-foreground">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {showBookmark && (
          <button
            onClick={onBookmark}
            className="active:scale-90 transition-transform hover:text-accent text-foreground"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
          </button>
        )}
        {showShare && (
          <button
            onClick={onShare}
            className="active:scale-90 transition-transform hover:text-secondary text-foreground"
          >
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        )}
      </div>
    </header>
  );
}
