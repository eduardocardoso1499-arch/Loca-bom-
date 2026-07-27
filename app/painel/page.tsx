import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import PainelTabs from "./PainelTabs";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [equipments, received, sent] = await Promise.all([
    prisma.equipment.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.rentalRequest.findMany({
      where: { equipment: { ownerId: user.id } },
      include: { equipment: true, requester: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.rentalRequest.findMany({
      where: { requesterId: user.id },
      include: { equipment: { include: { owner: { select: { name: true, phone: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Painel de controle</h1>
      <PainelTabs
        equipments={JSON.parse(JSON.stringify(equipments))}
        received={JSON.parse(JSON.stringify(received))}
        sent={JSON.parse(JSON.stringify(sent))}
      />
    </div>
  );
}
