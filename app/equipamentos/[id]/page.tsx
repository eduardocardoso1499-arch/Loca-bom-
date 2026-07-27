import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import RequestForm from "./RequestForm";

export const dynamic = "force-dynamic";

export default async function EquipmentPage({ params }: { params: { id: string } }) {
  const [equipment, user] = await Promise.all([
    prisma.equipment.findUnique({
      where: { id: params.id },
      include: { owner: { select: { id: true, name: true, city: true, phone: true } } },
    }),
    getCurrentUser(),
  ]);

  if (!equipment) notFound();

  const isOwner = user?.id === equipment.ownerId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="h-64 md:h-80 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-6">
          {equipment.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={equipment.imageUrl}
              alt={equipment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
          {equipment.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{equipment.title}</h1>
        <p className="text-gray-500">{equipment.city}</p>

        <p className="mt-4 text-gray-700 whitespace-pre-line">{equipment.description}</p>

        <div className="card p-4 mt-6">
          <p className="text-sm text-gray-500">Anunciado por</p>
          <p className="font-medium">{equipment.owner.name}</p>
        </div>
      </div>

      <div>
        <div className="card p-6 sticky top-24">
          <p className="text-2xl font-bold text-brand-700">
            R$ {equipment.dailyPrice.toFixed(2)}{" "}
            <span className="font-normal text-gray-500 text-sm">/dia</span>
          </p>

          <div className="mt-4">
            {!equipment.active ? (
              <p className="text-sm text-gray-500">Este anúncio está inativo no momento.</p>
            ) : isOwner ? (
              <p className="text-sm text-gray-500">Este é o seu anúncio.</p>
            ) : (
              <RequestForm equipmentId={equipment.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
