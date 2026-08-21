import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    // TODO: send via SMTP once configured (see .env.example) — for now, logged server-side,
    // same pattern as the contact form until real email delivery is wired up.
    console.log(`[password-reset] Reset link for ${user.email}: ${resetUrl}`);
  }

  // Always return the same generic response — never reveal whether an account exists.
  return NextResponse.json({ ok: true, message: "If an account exists for that email, a reset link has been sent." });
}
