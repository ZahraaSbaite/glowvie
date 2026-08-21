import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let payload: Record<string, string>;

  if (contentType.includes("application/json")) {
    payload = await req.json();
  } else {
    const form = await req.formData();
    payload = Object.fromEntries(form.entries()) as Record<string, string>;
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || "",
      subject: parsed.data.subject || "",
      message: parsed.data.message,
    },
  });

  // TODO: send via SMTP once configured (see .env.example) — for now, messages are
  // stored and visible in the admin dashboard under Messages.

  return NextResponse.json({ ok: true, id: message.id });
}
