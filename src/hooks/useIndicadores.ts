"use client";

import { useAluno } from "@/contexts/aluno-context";
import { useCheckins } from "@/contexts/checkin-context";
import { resumirPresencas } from "@/services/presenca-service";
import { useMemo } from "react";

export function useIndicadores(referencia: Date | null) {
  const { perfil } = useAluno();
  const { checkins } = useCheckins();

  return useMemo(
    () => (referencia ? resumirPresencas(checkins, referencia, perfil) : null),
    [checkins, referencia, perfil],
  );
}
