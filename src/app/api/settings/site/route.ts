import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { address, phone, whatsapp, email, instagramUrl, facebookUrl, mapEmbedUrl }
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      address: body.address ?? undefined,
      phone: body.phone ?? undefined,
      whatsapp: body.whatsapp ?? undefined,
      email: body.email ?? undefined,
      instagramUrl: body.instagramUrl ?? undefined,
      facebookUrl: body.facebookUrl ?? undefined,
      mapEmbedUrl: body.mapEmbedUrl ?? undefined,
    },
    create: {
      id: "singleton",
      address: body.address || "",
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      email: body.email || "",
      instagramUrl: body.instagramUrl || "",
      facebookUrl: body.facebookUrl || "",
      mapEmbedUrl: body.mapEmbedUrl || "",
    },
  });
  return NextResponse.json(settings);
}
