"use client";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const FF_BG = "https://freefiremobile-a.akamaihd.net/common/web_event/official2.ff.garena.all/img/20228/c94811b90b96aaa40c1274f96f35e850.jpg";

const FLOATING_ITEMS = [
  { icon: "shield", size: "text-2xl", pos: "top-[8%] left-[5%]", color: "#00F5D4", anim: "animate-float", delay: "0s", opacity: 45 },
  { icon: "gps_fixed", size: "text-xl", pos: "top-[5%] right-[12%]", color: "#7B2FFF", anim: "animate-float-reverse", delay: "0.8s", opacity: 38 },
  { icon: "sports_kabaddi", size: "text-2xl", pos: "top-[20%] left-[12%]", color: "#FF3AF2", anim: "animate-bounce-subtle", delay: "1.2s", opacity: 35 },
  { icon: "stadia_controller", size: "text-2xl", pos: "top-[18%] right-[5%]", color: "#FFE600", anim: "animate-float", delay: "0.4s", opacity: 40 },
  { icon: "trackpad", size: "text-3xl", pos: "top-[38%] left-[4%]", color: "#FF6B35", anim: "animate-wiggle", delay: "2s", opacity: 32 },
  { icon: "diamond", size: "text-2xl", pos: "top-[35%] right-[8%]", color: "#00F5D4", anim: "animate-float-reverse", delay: "1.5s", opacity: 42 },
  { icon: "military_tech", size: "text-xl", pos: "top-[50%] left-[10%]", color: "#7B2FFF", anim: "animate-float", delay: "0.6s", opacity: 30 },
  { icon: "workspace_premium", size: "text-xl", pos: "top-[48%] right-[3%]", color: "#FFE600", anim: "animate-bounce-subtle", delay: "2.2s", opacity: 35 },
  { icon: "groups", size: "text-2xl", pos: "top-[62%] left-[3%]", color: "#FF3AF2", anim: "animate-float-reverse", delay: "1s", opacity: 30 },
  { icon: "emoji_events", size: "text-2xl", pos: "top-[60%] right-[10%]", color: "#00F5D4", anim: "animate-wiggle", delay: "0.2s", opacity: 35 },
  { icon: "bolt", size: "text-2xl", pos: "top-[74%] left-[8%]", color: "#FF6B35", anim: "animate-float", delay: "1.8s", opacity: 38 },
  { icon: "nights_stay", size: "text-xl", pos: "top-[72%] right-[5%]", color: "#7B2FFF", anim: "animate-bounce-subtle", delay: "0.9s", opacity: 28 },
  { icon: "checkroom", size: "text-2xl", pos: "top-[84%] left-[5%]", color: "#FFE600", anim: "animate-float-reverse", delay: "1.4s", opacity: 32 },
  { icon: "psychology", size: "text-xl", pos: "top-[82%] right-[8%]", color: "#FF3AF2", anim: "animate-wiggle", delay: "0.5s", opacity: 30 },
  { icon: "star", size: "text-lg", pos: "top-[15%] left-[30%]", color: "#FFE600", anim: "animate-float", delay: "2.5s", opacity: 50 },
  { icon: "star", size: "text-lg", pos: "top-[25%] right-[25%]", color: "#00F5D4", anim: "animate-float-reverse", delay: "1.2s", opacity: 45 },
  { icon: "star", size: "text-sm", pos: "top-[55%] left-[2%]", color: "#FF3AF2", anim: "animate-float", delay: "0.8s", opacity: 55 },
  { icon: "star", size: "text-sm", pos: "top-[45%] right-[15%]", color: "#FF6B35", anim: "animate-float-reverse", delay: "2s", opacity: 50 },
];

function FFLogoSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m19.93 29.854l-2.261.76m2.319-3.212l-2.261.76m2.08-3.178l-2.261.76m2.233-3.177l-2.261.76m2.598 19.999v-9.054c-1.395-.287-2.56-.862-3.337-1.923h3.337V19.822c-.772.502-1.113.716-2.573.943-.27-6.365-.274-12.172 5.829-16.265.607 2.834 2.146 6.356 4.36 9.17v18.745h3.489c-.494.816-1.523 2.053-3.505 2.02V43.5" />
    </svg>
  );
}

function FFMaxLogoSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m21.981 24.499l-1.76.598m1.805-2.533l-1.76.599m1.62-2.506l-1.76.599m1.738-2.506l-1.76.599m2.022 15.776v-7.141c-1.086-.227-1.993-.68-2.597-1.517h2.597v-9.882c-.6.396-.866.565-2.003.744-.21-5.02-.213-9.6 4.537-12.829.473 2.236 1.67 5.014 3.394 7.233v14.786h2.715c-.384.644-1.185 1.62-2.727 1.593v7.15m2.04 1.589l4.406 6.648m0-6.648l-4.406 6.648m-16.57.001v-6.648l3.362 6.648l3.362-6.648V43.5m2.685 0l2.27-6.648l2.185 6.648m-3.698-2.244h2.942" />
    </svg>
  );
}

const CHARACTERS = [
  {
    src: "/images/ff-alok.png",
    pos: "left-0 top-[10%]",
    size: "h-[70vh] w-auto",
    opacity: 0.18,
    anim: "animate-float",
    delay: "0s",
    side: "left",
    flip: false,
  },
  {
    src: "/images/ff-kelly.png",
    pos: "right-0 top-[5%]",
    size: "h-[65vh] w-auto",
    opacity: 0.15,
    anim: "animate-float-reverse",
    delay: "1.5s",
    side: "right",
    flip: true,
  },
  {
    src: "/images/ff-jai.png",
    pos: "left-[8%] top-[55%]",
    size: "h-[45vh] w-auto",
    opacity: 0.14,
    anim: "animate-bounce-subtle",
    delay: "0.8s",
    side: "left",
    flip: false,
  },
  {
    src: "/images/ff-laura.png",
    pos: "right-[5%] top-[60%]",
    size: "h-[40vh] w-auto",
    opacity: 0.12,
    anim: "animate-float",
    delay: "2.2s",
    side: "right",
    flip: true,
  },
];

export function FFDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {/* Official Free Fire background */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{
        backgroundImage: `url(${FF_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }} />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{
        backgroundImage: `url(${FF_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        backgroundAttachment: "fixed",
        filter: "blur(4px)",
      }} />

      {/* Character silhouettes — fixed on edges */}
      {CHARACTERS.map((char, i) => (
        <div
          key={i}
          className={`absolute ${char.pos} ${char.anim} select-none`}
          style={{ animationDelay: char.delay, opacity: 0 }}
        >
          <img
            src={char.src}
            alt=""
            className={`${char.size} object-contain`}
            style={{
              opacity: char.opacity,
              transform: char.flip ? "scaleX(-1)" : undefined,
              filter: "grayscale(0.5) contrast(1.2) brightness(0.6)",
              imageRendering: "auto",
              transition: "opacity 0.3s",
            }}
            loading="lazy"
            onLoad={(e) => {
              const img = e.currentTarget;
              img.style.opacity = String(char.opacity);
            }}
          />
        </div>
      ))}

      {/* Gradient silhouette blobs */}
      <div className="absolute -top-[15%] -left-[5%] h-[70vh] w-[55vw] animate-morph opacity-[0.12]" style={{
        background: "radial-gradient(ellipse at 30% 50%, #FF6B35 0%, transparent 70%)",
        animationDuration: "18s",
      }} />
      <div className="absolute -bottom-[10%] -right-[10%] h-[80vh] w-[50vw] animate-morph opacity-[0.10]" style={{
        background: "radial-gradient(ellipse at 70% 50%, #7B2FFF 0%, transparent 70%)",
        animationDuration: "22s",
        animationDelay: "3s",
      }} />
      <div className="absolute top-[30%] left-[40%] h-[50vh] w-[40vw] animate-morph opacity-[0.08]" style={{
        background: "radial-gradient(ellipse at 50% 50%, #FF3AF2 0%, transparent 70%)",
        animationDuration: "20s",
        animationDelay: "1.5s",
      }} />

      {/* Free Fire Logo watermark — kanan atas */}
      <div className="absolute top-[50%] right-[-5%] -translate-y-1/2 opacity-[0.08]" style={{ animation: "spin-slow 40s linear infinite" }}>
        <FFLogoSVG className="w-[300px] h-[300px] text-accent" />
      </div>
      <div className="absolute top-[50%] left-[-5%] -translate-y-1/2 opacity-[0.06]" style={{ animation: "spin-slow 50s linear infinite reverse" }}>
        <FFMaxLogoSVG className="w-[250px] h-[250px] text-secondary" />
      </div>

      {/* FF Logo floating di pojok kanan bawah */}
      <div className="absolute bottom-[2%] right-[2%] flex items-center gap-2 opacity-[0.25] animate-float-reverse" style={{ animationDelay: "1s" }}>
        <FFLogoSVG className="w-8 h-8 text-accent" />
        <span className="font-heading text-xs font-black uppercase tracking-[0.2em] text-accent">Free Fire</span>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[400px] w-[400px]" style={{
        background: "radial-gradient(circle, rgba(255,107,53,0.14) 0%, transparent 60%)",
        animation: "morph-shape 14s ease-in-out infinite, float 10s ease-in-out infinite",
      }} />
      <div className="absolute bottom-[15%] left-[8%] h-[250px] w-[250px]" style={{
        background: "radial-gradient(circle, rgba(255,58,242,0.12) 0%, transparent 60%)",
        animation: "morph-shape 16s ease-in-out infinite 4s, float-reverse 12s ease-in-out infinite 2s",
      }} />
      <div className="absolute top-[20%] right-[5%] h-[200px] w-[200px]" style={{
        background: "radial-gradient(circle, rgba(0,245,212,0.10) 0%, transparent 60%)",
        animation: "morph-shape 12s ease-in-out infinite 2s, float 8s ease-in-out infinite 1s",
      }} />

      {/* Floating icons */}
      {FLOATING_ITEMS.map((item, i) => (
        <span
          key={i}
          className={`absolute ${item.size} ${item.pos} ${item.anim} select-none`}
          style={{
            color: item.color,
            opacity: item.opacity / 100,
            animationDelay: item.delay,
            filter: `drop-shadow(0 0 8px ${item.color}60)`,
            textShadow: `0 0 12px ${item.color}40`,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "inherit" }}>
            {item.icon}
          </span>
        </span>
      ))}

      {/* Fire particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`fp-${i}`}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${5 + i * 8}%`,
            top: `${88 + (i % 2) * 6}%`,
            background: ACCENT_COLORS[i % ACCENT_COLORS.length],
            boxShadow: `0 0 12px ${ACCENT_COLORS[i % ACCENT_COLORS.length]}b0`,
            animation: `particle-float ${2.5 + (i % 3) * 1.5}s ease-in-out ${i * 0.3}s infinite`,
            opacity: 0.5 + (i % 4) * 0.1,
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-48 h-48" style={{
        background: "linear-gradient(135deg, rgba(255,58,242,0.18) 0%, transparent 50%)",
      }} />
      <div className="absolute top-0 right-0 w-48 h-48" style={{
        background: "linear-gradient(225deg, rgba(0,245,212,0.18) 0%, transparent 50%)",
      }} />
      <div className="absolute bottom-0 left-0 w-48 h-48" style={{
        background: "linear-gradient(45deg, rgba(255,107,53,0.18) 0%, transparent 50%)",
      }} />
      <div className="absolute bottom-0 right-0 w-48 h-48" style={{
        background: "linear-gradient(-45deg, rgba(255,230,0,0.18) 0%, transparent 50%)",
      }} />

      {/* Scanning line effect */}
      <div className="absolute inset-0" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.003) 2px, rgba(255,255,255,0.003) 4px)",
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,13,26,0.5) 100%)",
      }} />
    </div>
  );
}