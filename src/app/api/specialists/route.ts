import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    const specialists = await prisma.specialist.findMany({
      orderBy: { name: "asc" },
      include: { services: { select: { serviceId: true } } },
    });
    return NextResponse.json(
      specialists.map((s) => ({ ...s, serviceIds: s.services.map((x) => x.serviceId), services: undefined }))
    );
  }

  const specialists = await prisma.specialist.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return NextResponse.json(specialists);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const specialist = await prisma.specialist.create({
    data: {
      name: body.name,
      title: body.title || "",
      bio: body.bio || "",
      email: body.email || "",
      phone: body.phone || "",
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(specialist, { status: 201 });
}
