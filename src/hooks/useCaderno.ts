"use client";

import { CHAVES } from "@/constants/app";
import { CADERNO_VAZIO } from "@/domain/equipe/ajustes";
import { useNoCliente } from "@/hooks/useNoCliente";
import { lerCaderno } from "@/services/caderno-service";
import type { CadernoEquipe } from "@/types";
import { inscreverStorage } from "@/utils/storage";
import { useSyncExternalStore } from "react";

export function useCaderno(): CadernoEquipe {
  const pronto = useNoCliente();
  const caderno = useSyncExternalStore(
    (ouvinte) => inscreverStorage(CHAVES.caderno, ouvinte),
    lerCaderno,
    () => CADERNO_VAZIO,
  );
  return pronto ? caderno : CADERNO_VAZIO;
}
