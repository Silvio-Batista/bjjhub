"use client";

import { cn } from "@/utils/cn";
import { CalendarDays, House, QrCode, Award, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/dashboard", rotulo: "Dashboard", icone: House },
  { href: "/aulas", rotulo: "Aulas", icone: CalendarDays },
  { href: "/checkin", rotulo: "Check-in", icone: QrCode, centro: true },
  { href: "/graduacao", rotulo: "Graduação", icone: Award },
  { href: "/financeiro", rotulo: "Financeiro", icone: Wallet },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="relative shrink-0 border-t border-line bg-bg-secondary pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      <ul className="grid h-[4.5rem] grid-cols-5">
        {ITENS.map((item) => {
          const ativo =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icone = item.icone;
          if ("centro" in item) {
            return (
              <li key={item.href} className="flex items-start justify-center">
                <Link
                  href={item.href}
                  className="-mt-5 flex flex-col items-center gap-1"
                  aria-current={ativo ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_16px_rgba(0,0,0,0.35)]",
                      ativo && "ring-2 ring-white/80 ring-offset-2 ring-offset-bg-secondary",
                    )}
                  >
                    <Icone size={24} />
                  </span>
                  <span className="text-[10px] font-medium text-ink">{item.rotulo}</span>
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium",
                  ativo ? "text-ink" : "text-muted",
                )}
                aria-current={ativo ? "page" : undefined}
              >
                <Icone size={22} strokeWidth={ativo ? 2.25 : 1.75} />
                {item.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
