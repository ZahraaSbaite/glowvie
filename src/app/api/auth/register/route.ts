import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const { fullName, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const user = await prisma.user.create({
    data: { fullName, email, phone, passwordHash: await hashPassword(password), role: "CLIENT" },
  });

  const token = await signSession({ userId: user.id, role: "CLIENT", fullName: user.fullName, email: user.email });
  const res = NextResponse.json({ user: { id: user.id, fullName: user.fullName, email: user.email } }, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
