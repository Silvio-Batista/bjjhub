"use client";

import { CHAVES } from "@/constants/app";
import { useNoCliente } from "@/hooks/useNoCliente";
import { autenticarEquipe } from "@/services/equipe-auth-service";
import type { SessaoEquipe } from "@/types";
import { gravarStorage, inscreverStorage, lerStorage, removerStorage } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface EquipeAuthContexto {
  sessao: SessaoEquipe | null;
  pronto: boolean;
  entrar: (email: string, senha: string) => { ok: true } | { ok: false; erro: string };
  sair: () => void;
}

const Contexto = createContext<EquipeAuthContexto | null>(null);

function lerSessao(): SessaoEquipe | null {
  return lerStorage<SessaoEquipe>(CHAVES.sessaoEquipe);
}

export function EquipeAuthProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const sessao = useSyncExternalStore(inscreverSessao, lerSessao, () => null);

  const entrar = useCallback((email: string, senha: string) => {
    const resultado = autenticarEquipe(email, senha, new Date());
    if (!resultado.ok) return resultado;
    gravarStorage(CHAVES.sessaoEquipe, resultado.sessao);
    return { ok: true as const };
  }, []);

  const sair = useCallback(() => {
    removerStorage(CHAVES.sessaoEquipe);
  }, []);

  const valor = useMemo(
    () => ({ sessao: pronto ? sessao : null, pronto, entrar, sair }),
    [sessao, pronto, entrar, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

function inscreverSessao(ouvinte: () => void) {
  return inscreverStorage(CHAVES.sessaoEquipe, ouvinte);
}

export function useEquipeAuth(): EquipeAuthContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useEquipeAuth fora do provider");
  return contexto;
}
