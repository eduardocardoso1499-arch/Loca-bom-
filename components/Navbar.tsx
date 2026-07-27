import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <span className="text-2xl">🛠️</span> Loca Bom
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-gray-600 hover:text-brand-700">
            Explorar
          </Link>
          {user ? (
            <>
              <Link href="/anuncios/novo" className="text-gray-600 hover:text-brand-700">
                Anunciar equipamento
              </Link>
              <Link href="/painel" className="text-gray-600 hover:text-brand-700">
                Painel
              </Link>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-500 hidden sm:inline">Olá, {user.name.split(" ")[0]}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-brand-700">
                Entrar
              </Link>
              <Link href="/registro" className="btn-primary">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
