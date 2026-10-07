"use client";

import { Splash } from "@/components/ui/Splash";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useAuth } from "@/contexts/auth-context";
import { useAgora } from "@/contexts/relogio-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sessao, pronto } = useAuth();
  const agora = useAgora();
  const router = useRouter();

  useEffect(() => {
    if (!pronto || agora === null) return;
    if (!sessao) router.replace("/login");
  }, [pronto, agora, sessao, router]);

  if (!pronto || agora === null || !sessao) return <Splash />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pt-[env(safe-area-inset-top)]">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
