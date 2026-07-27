import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") ?? "enviadas";

  if (tipo === "recebidas") {
    const requests = await prisma.rentalRequest.findMany({
      where: { equipment: { ownerId: user.id } },
      include: {
        equipment: true,
        requester: { select: { name: true, phone: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  }

  const requests = await prisma.rentalRequest.findMany({
    where: { requesterId: user.id },
    include: {
      equipment: { include: { owner: { select: { name: true, phone: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const body = await req.json();
  const { equipmentId, startDate, endDate, message } = body ?? {};

  if (!equipmentId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Informe o equipamento e o período desejado." },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return NextResponse.json({ error: "Período inválido." }, { status: 400 });
  }

  const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } });
  if (!equipment || !equipment.active) {
    return NextResponse.json({ error: "Anúncio não encontrado." }, { status: 404 });
  }
  if (equipment.ownerId === user.id) {
    return NextResponse.json(
      { error: "Você não pode alugar o seu próprio equipamento." },
      { status: 400 }
    );
  }

  const request = await prisma.rentalRequest.create({
    data: {
      equipmentId,
      requesterId: user.id,
      startDate: start,
      endDate: end,
      message: message || null,
    },
  });

  return NextResponse.json({ request }, { status: 201 });
}
