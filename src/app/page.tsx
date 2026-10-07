"use client";

import { Splash } from "@/components/ui/Splash";
import { useAuth } from "@/contexts/auth-context";
import { useAgora } from "@/contexts/relogio-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { sessao, pronto } = useAuth();
  const agora = useAgora();
  const router = useRouter();

  useEffect(() => {
    if (!pronto || agora === null) return;
    router.replace(sessao ? "/dashboard" : "/login");
  }, [pronto, agora, sessao, router]);

  return <Splash />;
}
