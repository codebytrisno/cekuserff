"use client";

const SHAPES = [
  { emoji: "✨", size: "text-3xl", pos: "top-[6%] left-[4%]", anim: "animate-float", delay: "0s", opacity: 15 },
  { emoji: "🚀", size: "text-4xl", pos: "top-[12%] right-[6%]", anim: "animate-bounce-subtle", delay: "1s", opacity: 18 },
  { emoji: "⭐", size: "text-2xl", pos: "top-[28%] left-[2%]", anim: "animate-float-reverse", delay: "0.5s", opacity: 12 },
  { emoji: "💥", size: "text-3xl", pos: "top-[48%] right-[3%]", anim: "animate-float", delay: "2s", opacity: 14 },
  { emoji: "🌟", size: "text-2xl", pos: "top-[68%] left-[5%]", anim: "animate-wiggle", delay: "1.5s", opacity: 10 },
  { emoji: "⚡", size: "text-3xl", pos: "top-[22%] right-[2%]", anim: "animate-float-reverse", delay: "0.8s", opacity: 16 },
  { emoji: "🔥", size: "text-2xl", pos: "top-[58%] left-[3%]", anim: "animate-bounce-subtle", delay: "1.2s", opacity: 13 },
  { emoji: "💎", size: "text-xl", pos: "top-[38%] right-[5%]", anim: "animate-float", delay: "0.3s", opacity: 11 },
  { emoji: "🎯", size: "text-2xl", pos: "top-[82%] left-[6%]", anim: "animate-float-reverse", delay: "0.7s", opacity: 9 },
  { emoji: "🏆", size: "text-3xl", pos: "top-[72%] right-[4%]", anim: "animate-wiggle", delay: "1.8s", opacity: 14 },
  { emoji: "🎮", size: "text-2xl", pos: "top-[88%] right-[2%]", anim: "animate-float", delay: "2.2s", opacity: 8 },
  { emoji: "👑", size: "text-xl", pos: "top-[42%] left-[1%]", anim: "animate-bounce-subtle", delay: "0.4s", opacity: 12 },
  { emoji: "🌀", size: "text-3xl", pos: "top-[15%] left-[12%]", anim: "animate-spin-slow", delay: "0s", opacity: 6 },
  { emoji: "💫", size: "text-2xl", pos: "top-[55%] right-[8%]", anim: "animate-float-reverse", delay: "1.6s", opacity: 10 },
  { emoji: "🔮", size: "text-xl", pos: "top-[32%] right-[1%]", anim: "animate-float", delay: "2.5s", opacity: 7 },
  { emoji: "❄️", size: "text-2xl", pos: "top-[78%] left-[2%]", anim: "animate-wiggle", delay: "0.9s", opacity: 8 },
];

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <span
          key={i}
          className={`absolute ${s.size} ${s.pos} ${s.anim} select-none`}
          style={{
            animationDelay: s.delay,
            opacity: s.opacity / 100,
            filter: `blur(${i % 3 === 0 ? 1 : 0}px)`,
          }}
        >
          {s.emoji}
        </span>
      ))}
      {/* Glowing orbs */}
      <div
        className="absolute top-[20%] left-[10%] h-32 w-32 rounded-full animate-morph"
        style={{
          background: "radial-gradient(circle, rgba(255,58,242,0.08) 0%, transparent 70%)",
          animation: "morph-shape 12s ease-in-out infinite, float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[60%] right-[8%] h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 70%)",
          animation: "morph-shape 15s ease-in-out infinite 2s, float 10s ease-in-out infinite 1s",
        }}
      />
    </div>
  );
}
