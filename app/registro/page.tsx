"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", city: "" });
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta.");
        return;
      }
      router.push("/painel");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <h1 className="text-xl font-bold mb-6">Criar conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nome</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="input"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Telefone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Cidade</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Já tem conta?{" "}
        <Link href="/login" className="text-brand-700 underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
