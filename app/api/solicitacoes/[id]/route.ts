import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

const OWNER_STATUSES = ["aprovada", "recusada"];
const REQUESTER_STATUSES = ["cancelada"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "É preciso estar logado." }, { status: 401 });
  }

  const { status } = (await req.json()) ?? {};
  if (!status || ![...OWNER_STATUSES, ...REQUESTER_STATUSES].includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: params.id },
    include: { equipment: true },
  });
  if (!rentalRequest) {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }

  const isOwner = rentalRequest.equipment.ownerId === user.id;
  const isRequester = rentalRequest.requesterId === user.id;

  if (OWNER_STATUSES.includes(status) && !isOwner) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }
  if (REQUESTER_STATUSES.includes(status) && !isRequester) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const updated = await prisma.rentalRequest.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ request: updated });
}
