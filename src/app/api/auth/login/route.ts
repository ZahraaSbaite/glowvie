import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signSession({ userId: user.id, role: user.role, fullName: user.fullName, email: user.email });
  const res = NextResponse.json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
