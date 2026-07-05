import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, password, secret } = await request.json();

    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const existing = await prisma.user.findFirst({ where: { role: "admin" } });
    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: `${username.toLowerCase()}@ff-checker.local`,
        password,
        name: username,
        username,
      },
    });

    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "admin", label: "Admin" },
    });

    return NextResponse.json({ success: true, userId: result.user.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
