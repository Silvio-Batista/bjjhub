"use client";

import { useAluno } from "@/contexts/aluno-context";
import { useCheckins } from "@/contexts/checkin-context";
import { useCaderno } from "@/hooks/useCaderno";
import { resumirPresencas } from "@/services/presenca-service";
import { useMemo } from "react";

export function useIndicadores(referencia: Date | null) {
  const { perfil } = useAluno();
  const { checkins } = useCheckins();
  const caderno = useCaderno();

  return useMemo(
    () => (referencia ? resumirPresencas(checkins, referencia, perfil, caderno) : null),
    [checkins, referencia, perfil, caderno],
  );
}
