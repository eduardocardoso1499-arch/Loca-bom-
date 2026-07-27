import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("categoria");
  const city = searchParams.get("cidade");
  const q = searchParams.get("q");

  const equipments = await prisma.equipment.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      ...(city ? { city: { contains: city } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: { owner: { select: { name: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ equipments });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, category, dailyPrice, city, imageUrl } = body ?? {};

  if (!title || !description || !category || !dailyPrice || !city) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const price = Number(dailyPrice);
  if (Number.isNaN(price) || price <= 0) {
    return NextResponse.json({ error: "Preço diário inválido." }, { status: 400 });
  }

  const equipment = await prisma.equipment.create({
    data: {
      title,
      description,
      category,
      dailyPrice: price,
      city,
      imageUrl: imageUrl || null,
      ownerId: user.id,
    },
  });

  return NextResponse.json({ equipment }, { status: 201 });
}
