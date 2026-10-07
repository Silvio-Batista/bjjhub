"use client";

import { useNotificacoes } from "@/contexts/notificacoes-context";
import { Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppHeader({
  titulo,
  voltar = false,
  mostrarNotificacoes = false,
}: {
  titulo: string;
  voltar?: boolean;
  mostrarNotificacoes?: boolean;
}) {
  const router = useRouter();
  const { naoLidas } = useNotificacoes();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center bg-bg/95 px-2 backdrop-blur-sm">
      {voltar ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
          aria-label="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
      ) : (
        <span className="w-11" />
      )}
      <h1 className="flex-1 truncate text-center text-[17px] font-semibold">{titulo}</h1>
      {mostrarNotificacoes ? (
        <Link
          href="/notificacoes"
          className="relative flex h-11 w-11 items-center justify-center text-ink"
          aria-label={
            naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : "Notificações"
          }
        >
          <Bell size={22} />
          {naoLidas > 0 ? (
            <span className="absolute top-1 right-0.5 min-w-5 rounded-full bg-primary px-1 text-center text-[10px] leading-5 font-semibold text-white">
              {naoLidas > 99 ? "99+" : naoLidas}
            </span>
          ) : null}
        </Link>
      ) : (
        <span className="w-11" />
      )}
    </header>
  );
}
