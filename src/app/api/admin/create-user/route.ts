import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

function getExpiresAt(plan: string): Date | null {
  const durations: Record<string, number> = {
    weekly: 7,
    monthly: 30,
    lifetime: 0,
  };
  const days = durations[plan];
  if (days === 0) return null;
  if (!days) return null;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const label = (formData.get("label") as string) || username;
  const plan = (formData.get("plan") as string) || "monthly";

  if (!username?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let result;
  try {
    result = await auth.api.signUpEmail({
      body: {
        email: `${username.toLowerCase()}@ff-checker.local`,
        password,
        name: username,
        username,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal membuat user";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: result.user.id },
    data: {
      role: "user",
      label,
    },
  });

  await prisma.premium.create({
    data: {
      userId: result.user.id,
      tier: plan,
      expiresAt: getExpiresAt(plan),
    },
  });

  return NextResponse.json({ success: true });
}
