const MAYAR_API = "https://api.mayar.id/hl/v1";
const MAYAR_ENV = process.env.NEXT_PUBLIC_MAYAR_ENV || "sandbox";

function getBaseUrl() {
  return MAYAR_ENV === "production" ? MAYAR_API : "https://api.mayar.club/hl/v1";
}

function getHeaders() {
  const key = process.env.MAYAR_API_KEY;
  if (!key) return null;
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export interface MayarProduct {
  id: string;
  name: string;
  description: string;
  amount: number;
  link: string;
}

const PLANS = [
  {
    slug: "premium-weekly",
    name: "Premium Mingguan",
    description: "Akses premium selama 7 hari",
    amount: 5000,
    days: 7,
  },
  {
    slug: "premium-monthly",
    name: "Premium Bulanan",
    description: "Akses premium selama 30 hari",
    amount: 15000,
    days: 30,
  },
  {
    slug: "premium-lifetime",
    name: "Premium Lifetime",
    description: "Akses premium selamanya",
    amount: 50000,
    days: 0,
  },
] as const;

export function getPlans() {
  return PLANS;
}

export function formatPrice(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export async function createPaymentLink(
  plan: (typeof PLANS)[number],
  uid: string,
  redirectUrl?: string,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const headers = getHeaders();
  if (!headers) return { ok: false, error: "Mayar API key not configured" };

  try {
    const res = await fetch(`${getBaseUrl()}/invoice/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: `CEKUSERFF - ${plan.name}`,
        description: `${plan.description} untuk UID ${uid}`,
        items: [
          {
            quantity: 1,
            rate: plan.amount,
            description: plan.name,
          },
        ],
        redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/premium/success`,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        extraData: {
          uid,
          plan: plan.slug,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.messages || "Gagal membuat pembayaran" };

    return { ok: true, url: data.data?.url || data.data?.link };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function checkTransaction(invoiceId: string): Promise<{
  status: "paid" | "pending" | "expired" | "failed";
  plan?: string;
  uid?: string;
}> {
  const headers = getHeaders();
  if (!headers) return { status: "failed" };

  try {
    const res = await fetch(`${getBaseUrl()}/invoice/${invoiceId}`, { headers });
    const data = await res.json();
    if (!res.ok) return { status: "failed" };

    const inv = data.data;
    return {
      status: inv.status === "paid" ? "paid" : inv.status === "expired" ? "expired" : "pending",
      plan: inv.extraData?.plan,
      uid: inv.extraData?.uid,
    };
  } catch {
    return { status: "failed" };
  }
}
