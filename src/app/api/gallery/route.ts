import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const session = await getSession();
  const showAll = searchParams.get("all") === "1" && session?.role === "ADMIN";

  const images = await prisma.galleryImage.findMany({
    where: {
      ...(showAll ? {} : { isActive: true }),
      ...(category ? { category } : {}),
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const image = await prisma.galleryImage.create({
    data: {
      category: body.category,
      title: body.title || "",
      imageUrl: body.imageUrl || "",
      beforeUrl: body.beforeUrl || "",
      afterUrl: body.afterUrl || "",
      isBeforeAfter: Boolean(body.isBeforeAfter),
      consentConfirmed: Boolean(body.consentConfirmed),
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    },
  });
  return NextResponse.json(image, { status: 201 });
}
