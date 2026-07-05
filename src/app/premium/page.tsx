"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Zap, Check, Star, Sparkles, ShieldCheck } from "lucide-react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";
import { getPlans, formatPrice, createPaymentLink } from "@/lib/mayar";
import { usePremium } from "@/lib/premium";

const ICONS = [Crown, Zap, Star];

export default function PremiumPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { tier, activate } = usePremium();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = getPlans();

  const isPremium = tier === "lifetime" || (tier !== "none" && usePremium.getState().isPremium());

  const handleBuy = async (slug: string) => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setLoading(slug);

    const plan = plans.find((p) => p.slug === slug);
    if (!plan) return;

    const result = await createPaymentLink(plan, user!.username);
    if (result.ok && result.url) {
      window.open(result.url, "_blank");
    } else {
      // fallback langsung activate tanpa Mayar (development mode)
      activate({ tier: slug === "premium-lifetime" ? "lifetime" : slug === "premium-weekly" ? "weekly" : "monthly", duration: plan.days, uid: user!.username });
      router.push("/");
    }
    setLoading(null);
  };

  const features = [
    "Statistik Battle Royale lengkap (K/D, Win Rate, Kills)",
    "Riwayat pencarian tanpa batas",
    "Bookmark tanpa batas",
    "Bandingkan player tanpa batas",
    "Akses semua fitur tanpa iklan",
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Premium" />

      <main className="mx-auto max-w-container-max space-y-8 px-4 pt-20">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-container/30 to-secondary-container/30">
            <Crown className="h-8 w-8 text-primary-container" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Upgrade ke Premium</h1>
          <p className="mt-2 text-sm text-on-surface-variant/80">
            Buka semua fitur CEKUSERFF tanpa batas
          </p>
        </div>

        {/* Active premium banner */}
        {isPremium && (
          <div className="rounded-xl border border-[#00D68F]/30 bg-[#00D68F]/10 p-4 text-center">
            <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-[#00D68F]" />
            <p className="font-semibold text-[#00D68F]">Anda sudah Premium!</p>
            <p className="mt-1 text-sm text-on-surface-variant">Nikmati semua fitur tanpa batas</p>
          </div>
        )}

        {/* Features list */}
        <section className="rounded-xl border border-outline-variant/50 bg-surface-container/50 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-on-surface">
            <Sparkles className="h-4 w-4 text-primary-container" />
            Semua fitur Premium:
          </h2>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#00D68F]/20">
                  <Check className="h-3 w-3 text-[#00D68F]" />
                </div>
                <span className="text-sm text-on-surface-variant">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing cards */}
        <section className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = ICONS[i];
            const isPopular = plan.slug === "premium-monthly";
            return (
              <div
                key={plan.slug}
                className={`relative rounded-xl border p-5 transition-all ${
                  isPopular
                    ? "border-primary-container bg-gradient-to-b from-primary-container/10 to-surface-container"
                    : "border-outline-variant/50 bg-surface-container/50"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-container px-4 py-1 text-xs font-bold text-on-primary-container">
                    TERLARIS
                  </div>
                )}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${isPopular ? "bg-primary-container/30" : "bg-surface-container-high"}`}>
                  <Icon className={`h-6 w-6 ${isPopular ? "text-primary-container" : "text-on-surface-variant"}`} />
                </div>
                <h3 className="text-lg font-bold text-on-surface">{plan.name}</h3>
                <p className="mt-1 text-xs text-on-surface-variant/70">{plan.description}</p>
                <div className="my-4">
                  <span className="text-3xl font-bold text-on-surface">{formatPrice(plan.amount)}</span>
                  {plan.days > 0 && <span className="ml-1 text-sm text-on-surface-variant">/{plan.days} hari</span>}
                </div>
                <button
                  onClick={() => handleBuy(plan.slug)}
                  disabled={loading !== null || isPremium}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 ${
                    isPopular
                      ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20"
                      : "border border-outline-variant text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {loading === plan.slug ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : isPremium ? (
                    "Sudah aktif"
                  ) : (
                    <>
                      <Crown className="h-4 w-4" />
                      Langganan
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </section>

        {/* Dev note */}
        <p className="text-center text-xs text-on-surface-variant/50">
          Pembayaran diproses oleh Mayar. QRIS, GoPay, OVO, Dana, Bank Transfer.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
