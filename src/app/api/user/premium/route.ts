import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const premium = await prisma.premium.findUnique({
    where: { userId: session.user.id },
  });

  if (!premium) {
    return NextResponse.json({ tier: null, isActive: false });
  }

  const now = new Date();
  const isActive =
    premium.tier === "lifetime" ||
    (premium.expiresAt && premium.expiresAt > now);

  return NextResponse.json({
    tier: premium.tier,
    activatedAt: premium.activatedAt.toISOString(),
    expiresAt: premium.expiresAt?.toISOString() ?? null,
    isActive,
  });
}
