"use client";

import { CHAVES, PREFERENCIAS_INICIAIS } from "@/constants/app";
import { useNoCliente } from "@/hooks/useNoCliente";
import type { Preferencias } from "@/types";
import { gravarStorage, inscreverStorage, lerStorage } from "@/utils/storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

interface PreferenciasContexto {
  preferencias: Preferencias;
  pronto: boolean;
  atualizar: (parcial: Partial<Preferencias>) => void;
  atualizarNotificacoes: (chave: keyof Preferencias["notificacoes"], valor: boolean) => void;
  atualizarPrivacidade: (chave: keyof Preferencias["privacidade"], valor: boolean) => void;
}

const Contexto = createContext<PreferenciasContexto | null>(null);
const INICIAL = PREFERENCIAS_INICIAIS as Preferencias;

function ler(): Preferencias {
  return lerStorage<Preferencias>(CHAVES.preferencias) ?? INICIAL;
}

export function PreferenciasProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const preferencias = useSyncExternalStore(
    (ouvinte) => inscreverStorage(CHAVES.preferencias, ouvinte),
    ler,
    () => INICIAL,
  );

  useEffect(() => {
    if (!pronto) return;
    document.documentElement.dataset.tema = preferencias.tema;
  }, [preferencias.tema, pronto]);

  const valor = useMemo<PreferenciasContexto>(() => {
    const salvar = (proxima: Preferencias) => {
      const ok = gravarStorage(CHAVES.preferencias, proxima);
      if (!ok) return;
    };

    return {
      preferencias: pronto ? preferencias : INICIAL,
      pronto,
      atualizar: (parcial) => salvar({ ...ler(), ...parcial }),
      atualizarNotificacoes: (chave, valor) => {
        const atual = ler();
        salvar({
          ...atual,
          notificacoes: { ...atual.notificacoes, [chave]: valor },
        });
      },
      atualizarPrivacidade: (chave, valor) => {
        const atual = ler();
        salvar({
          ...atual,
          privacidade: { ...atual.privacidade, [chave]: valor },
        });
      },
    };
  }, [preferencias, pronto]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePreferencias(): PreferenciasContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("usePreferencias fora do provider");
  return contexto;
}
