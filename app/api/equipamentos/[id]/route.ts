import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const equipment = await prisma.equipment.findUnique({
    where: { id: params.id },
    include: { owner: { select: { id: true, name: true, city: true, phone: true } } },
  });

  if (!equipment) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ equipment });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const equipment = await prisma.equipment.findUnique({ where: { id: params.id } });
  if (!equipment || equipment.ownerId !== user.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, category, dailyPrice, city, imageUrl, active } = body ?? {};

  const updated = await prisma.equipment.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(dailyPrice !== undefined ? { dailyPrice: Number(dailyPrice) } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(active !== undefined ? { active: Boolean(active) } : {}),
    },
  });

  return NextResponse.json({ equipment: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const equipment = await prisma.equipment.findUnique({ where: { id: params.id } });
  if (!equipment || equipment.ownerId !== user.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  await prisma.equipment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
