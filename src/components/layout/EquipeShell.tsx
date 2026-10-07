"use client";

import { LogoHorizontal } from "@/components/brand/Logo";
import { Splash } from "@/components/ui/Splash";
import { useEquipeAuth } from "@/contexts/equipe-auth-context";
import { useAgora } from "@/contexts/relogio-context";
import { equipeService } from "@/services/equipe-service";
import { cn } from "@/utils/cn";
import { LayoutDashboard, LogOut, Receipt, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ITENS = [
  { href: "/equipe", rotulo: "Visão geral", icone: LayoutDashboard },
  { href: "/equipe/alunos", rotulo: "Alunos", icone: Users },
  { href: "/equipe/pagamentos", rotulo: "Pagamentos", icone: Receipt },
  { href: "/equipe/presencas", rotulo: "Presenças", icone: UserRound },
] as const;

function ativo(pathname: string, href: string): boolean {
  if (href === "/equipe") return pathname === "/equipe";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EquipeShell({ children }: { children: React.ReactNode }) {
  const { sessao, pronto, sair } = useEquipeAuth();
  const agora = useAgora();
  const router = useRouter();
  const pathname = usePathname();
  const sensei = equipeService.obterSensei();

  useEffect(() => {
    if (!pronto || agora === null) return;
    if (!sessao) router.replace("/equipe/login");
  }, [pronto, agora, sessao, router]);

  if (!pronto || agora === null || !sessao) {
    return (
      <div className="h-dvh">
        <Splash />
      </div>
    );
  }

  function encerrar() {
    sair();
    router.replace("/equipe/login");
  }

  return (
    <div className="flex h-dvh min-h-0 bg-bg text-ink">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-bg-secondary md:flex">
        <div className="px-5 py-6">
          <LogoHorizontal />
          <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            Equipe
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {ITENS.map((item) => {
            const Icone = item.icone;
            const ligado = ativo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm",
                  ligado ? "bg-card text-ink" : "text-muted hover:text-ink",
                )}
                aria-current={ligado ? "page" : undefined}
              >
                <Icone size={18} strokeWidth={1.75} />
                {item.rotulo}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line px-5 py-4">
          <p className="text-sm font-medium">{sensei.nome}</p>
          <p className="mt-0.5 text-xs text-muted">{sensei.tratamento}</p>
          <button
            type="button"
            onClick={encerrar}
            className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line bg-bg-secondary md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold">BJJHub · Equipe</p>
            <button type="button" onClick={encerrar} className="text-sm text-muted">
              Sair
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {ITENS.map((item) => {
              const ligado = ativo(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-sm",
                    ligado ? "bg-card text-ink" : "text-muted",
                  )}
                  aria-current={ligado ? "page" : undefined}
                >
                  {item.rotulo}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
