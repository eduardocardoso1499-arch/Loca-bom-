import Link from "next/link";

type Props = {
  id: string;
  title: string;
  category: string;
  city: string;
  dailyPrice: number;
  imageUrl?: string | null;
  ownerName?: string;
};

export default function EquipmentCard({
  id,
  title,
  category,
  city,
  dailyPrice,
  imageUrl,
  ownerName,
}: Props) {
  return (
    <Link href={`/equipamentos/${id}`} className="card overflow-hidden hover:shadow-md transition-shadow block">
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
          {category}
        </span>
        <h3 className="mt-2 font-semibold text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500">{city}</p>
        {ownerName && <p className="text-xs text-gray-400 mt-1">Anunciado por {ownerName}</p>}
        <p className="mt-2 font-bold text-brand-700">
          R$ {dailyPrice.toFixed(2)} <span className="font-normal text-gray-500 text-sm">/dia</span>
        </p>
      </div>
    </Link>
  );
}
