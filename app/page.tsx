import { prisma } from "@/lib/prisma";
import EquipmentCard from "@/components/EquipmentCard";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; categoria?: string; cidade?: string };

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { q, categoria, cidade } = searchParams;

  const equipments = await prisma.equipment.findMany({
    where: {
      active: true,
      ...(categoria ? { category: categoria } : {}),
      ...(cidade ? { city: { contains: cidade } } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}),
    },
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="bg-brand-50 border border-brand-100 rounded-2xl p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Alugue equipamentos de quem já tem, perto de você
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Conectamos donos de equipamentos ociosos a quem precisa alugar por um período — sem
          precisar comprar. Ferramentas, eventos, fotografia e muito mais.
        </p>
      </section>

      <form className="card p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou descrição..."
          className="input md:col-span-2"
        />
        <select name="categoria" defaultValue={categoria ?? ""} className="input">
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="cidade"
          defaultValue={cidade}
          placeholder="Cidade"
          className="input"
        />
        <button type="submit" className="btn-primary md:col-start-4">
          Buscar
        </button>
      </form>

      {equipments.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          Nenhum equipamento encontrado. Que tal{" "}
          <a href="/anuncios/novo" className="text-brand-700 underline">
            anunciar o seu
          </a>
          ?
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {equipments.map((eq) => (
            <EquipmentCard
              key={eq.id}
              id={eq.id}
              title={eq.title}
              category={eq.category}
              city={eq.city}
              dailyPrice={eq.dailyPrice}
              imageUrl={eq.imageUrl}
              ownerName={eq.owner.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
