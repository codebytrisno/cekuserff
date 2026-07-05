"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle, Crown } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00D68F]/20">
        <CheckCircle className="h-10 w-10 text-[#00D68F]" />
      </div>
      <Crown className="mb-4 h-8 w-8 text-primary-container" />
      <h1 className="text-2xl font-bold text-on-surface">Pembayaran Berhasil!</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Akun Premium Anda sudah aktif. Nikmati semua fitur tanpa batas!
      </p>
      <p className="mt-6 text-xs text-on-surface-variant/60">
        Mengarahkan ke halaman utama dalam 5 detik...
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
