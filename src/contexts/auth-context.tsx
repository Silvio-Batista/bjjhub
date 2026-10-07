"use client";

import { CHAVES } from "@/constants/app";
import { useNoCliente } from "@/hooks/useNoCliente";
import { autenticar } from "@/services/auth-service";
import type { Sessao } from "@/types";
import { gravarStorage, inscreverStorage, lerStorage, removerStorage } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface AuthContexto {
  sessao: Sessao | null;
  pronto: boolean;
  entrar: (email: string, senha: string) => { ok: true } | { ok: false; erro: string };
  sair: () => void;
}

const Contexto = createContext<AuthContexto | null>(null);

function lerSessao(): Sessao | null {
  return lerStorage<Sessao>(CHAVES.sessao);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const sessao = useSyncExternalStore(inscreverSessao, lerSessao, () => null);

  const entrar = useCallback((email: string, senha: string) => {
    const resultado = autenticar(email, senha, new Date());
    if (!resultado.ok) return resultado;
    gravarStorage(CHAVES.sessao, resultado.sessao);
    return { ok: true as const };
  }, []);

  const sair = useCallback(() => {
    removerStorage(CHAVES.sessao);
  }, []);

  const valor = useMemo(
    () => ({ sessao: pronto ? sessao : null, pronto, entrar, sair }),
    [sessao, pronto, entrar, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

function inscreverSessao(ouvinte: () => void) {
  return inscreverStorage(CHAVES.sessao, ouvinte);
}

export function useAuth(): AuthContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useAuth fora do provider");
  return contexto;
}
