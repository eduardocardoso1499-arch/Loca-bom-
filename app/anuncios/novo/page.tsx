"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export default function NovoAnuncioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    dailyPrice: "",
    city: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/equipamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        setError(data.error ?? "Erro ao criar anúncio.");
        return;
      }
      router.push(`/equipamentos/${data.equipment.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto card p-8">
      <h1 className="text-xl font-bold mb-6">Anunciar um equipamento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Título</label>
          <input
            required
            className="input"
            placeholder="Ex: Furadeira de impacto Bosch"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Descrição</label>
          <textarea
            required
            rows={4}
            className="input"
            placeholder="Conte o estado do equipamento, acessórios inclusos, etc."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Preço por dia (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              className="input"
              value={form.dailyPrice}
              onChange={(e) => update("dailyPrice", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Cidade</label>
            <input
              required
              className="input"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div>
            <label className="label">URL da foto (opcional)</label>
            <input
              className="input"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Publicando..." : "Publicar anúncio"}
        </button>
      </form>
    </div>
  );
}
