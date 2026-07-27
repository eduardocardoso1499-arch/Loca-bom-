"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Equipment = {
  id: string;
  title: string;
  category: string;
  city: string;
  dailyPrice: number;
  active: boolean;
};

type ReceivedRequest = {
  id: string;
  startDate: string;
  endDate: string;
  message: string | null;
  status: string;
  equipment: { title: string };
  requester: { name: string; phone: string | null };
};

type SentRequest = {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  equipment: { id: string; title: string; owner: { name: string; phone: string | null } };
};

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  aprovada: "Aprovada",
  recusada: "Recusada",
  cancelada: "Cancelada",
};

const STATUS_COLORS: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  aprovada: "bg-green-100 text-green-800",
  recusada: "bg-red-100 text-red-800",
  cancelada: "bg-gray-100 text-gray-600",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function PainelTabs({
  equipments,
  received,
  sent,
}: {
  equipments: Equipment[];
  received: ReceivedRequest[];
  sent: SentRequest[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"anuncios" | "recebidas" | "enviadas">("anuncios");

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/equipamentos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function deleteEquipment(id: string) {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    await fetch(`/api/equipamentos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function updateRequestStatus(id: string, status: string) {
    await fetch(`/api/solicitacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  const tabs = [
    { key: "anuncios" as const, label: `Meus Anúncios (${equipments.length})` },
    { key: "recebidas" as const, label: `Solicitações Recebidas (${received.length})` },
    { key: "enviadas" as const, label: `Minhas Solicitações (${sent.length})` },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "anuncios" && (
        <div className="space-y-3">
          {equipments.length === 0 && (
            <p className="text-gray-500">
              Você ainda não anunciou nenhum equipamento.{" "}
              <Link href="/anuncios/novo" className="text-brand-700 underline">
                Anunciar agora
              </Link>
            </p>
          )}
          {equipments.map((eq) => (
            <div key={eq.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <Link href={`/equipamentos/${eq.id}`} className="font-medium hover:underline">
                  {eq.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {eq.category} · {eq.city} · R$ {eq.dailyPrice.toFixed(2)}/dia
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    eq.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {eq.active ? "Ativo" : "Pausado"}
                </span>
                <button onClick={() => toggleActive(eq.id, eq.active)} className="btn-secondary">
                  {eq.active ? "Pausar" : "Ativar"}
                </button>
                <button
                  onClick={() => deleteEquipment(eq.id)}
                  className="btn-secondary text-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "recebidas" && (
        <div className="space-y-3">
          {received.length === 0 && (
            <p className="text-gray-500">Nenhuma solicitação recebida ainda.</p>
          )}
          {received.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium">{r.equipment.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(r.startDate)} a {formatDate(r.endDate)} · Solicitado por{" "}
                    {r.requester.name}
                    {r.requester.phone ? ` (${r.requester.phone})` : ""}
                  </p>
                  {r.message && <p className="text-sm text-gray-600 mt-1">"{r.message}"</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.status === "pendente" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateRequestStatus(r.id, "aprovada")}
                    className="btn-primary"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => updateRequestStatus(r.id, "recusada")}
                    className="btn-secondary"
                  >
                    Recusar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "enviadas" && (
        <div className="space-y-3">
          {sent.length === 0 && (
            <p className="text-gray-500">
              Você ainda não solicitou nenhum aluguel.{" "}
              <Link href="/" className="text-brand-700 underline">
                Explorar equipamentos
              </Link>
            </p>
          )}
          {sent.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <Link href={`/equipamentos/${r.equipment.id}`} className="font-medium hover:underline">
                    {r.equipment.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(r.startDate)} a {formatDate(r.endDate)} · Anunciante{" "}
                    {r.equipment.owner.name}
                    {r.status === "aprovada" && r.equipment.owner.phone
                      ? ` (${r.equipment.owner.phone})`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.status === "pendente" && (
                <div className="mt-3">
                  <button
                    onClick={() => updateRequestStatus(r.id, "cancelada")}
                    className="btn-secondary"
                  >
                    Cancelar solicitação
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
