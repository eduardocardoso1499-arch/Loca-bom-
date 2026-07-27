"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestForm({ equipmentId }: { equipmentId: string }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipmentId, startDate, endDate, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setError(data.error ?? "Erro ao enviar solicitação.");
        return;
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-lg p-3">
        Solicitação enviada! Acompanhe o status no seu{" "}
        <a href="/painel" className="underline">
          painel
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Data inicial</label>
          <input
            type="date"
            required
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Data final</label>
          <input
            type="date"
            required
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label">Mensagem (opcional)</label>
        <textarea
          rows={3}
          className="input"
          placeholder="Diga ao anunciante para que você vai usar o equipamento..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Enviando..." : "Solicitar aluguel"}
      </button>
    </form>
  );
}
