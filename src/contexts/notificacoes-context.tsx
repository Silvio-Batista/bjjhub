"use client";

import { CHAVES } from "@/constants/app";
import { useNoCliente } from "@/hooks/useNoCliente";
import { notificacaoService } from "@/services/notificacao-service";
import type { Notificacao } from "@/types";
import { gravarStorage, inscreverStorage, lerStorage } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface NotificacoesContexto {
  notificacoes: Notificacao[];
  naoLidas: number;
  pronto: boolean;
  marcarLida: (id: string, lida: boolean) => void;
  arquivar: (id: string, arquivada: boolean) => void;
  excluir: (id: string) => void;
  adicionar: (notificacao: Notificacao) => void;
}

const Contexto = createContext<NotificacoesContexto | null>(null);
const INICIAIS = notificacaoService.listar();

function ler(): Notificacao[] {
  return lerStorage<Notificacao[]>(CHAVES.notificacoes) ?? INICIAIS;
}

export function NotificacoesProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const notificacoes = useSyncExternalStore(
    (ouvinte) => inscreverStorage(CHAVES.notificacoes, ouvinte),
    ler,
    () => INICIAIS,
  );

  const salvar = useCallback((proxima: Notificacao[]) => {
    gravarStorage(CHAVES.notificacoes, proxima);
  }, []);

  const marcarLida = useCallback(
    (id: string, lida: boolean) => {
      salvar(ler().map((item) => (item.id === id ? { ...item, lida } : item)));
    },
    [salvar],
  );

  const arquivar = useCallback(
    (id: string, arquivada: boolean) => {
      salvar(ler().map((item) => (item.id === id ? { ...item, arquivada } : item)));
    },
    [salvar],
  );

  const excluir = useCallback(
    (id: string) => {
      salvar(ler().filter((item) => item.id !== id));
    },
    [salvar],
  );

  const adicionar = useCallback(
    (notificacao: Notificacao) => {
      salvar([notificacao, ...ler()]);
    },
    [salvar],
  );

  const lista = pronto ? notificacoes : INICIAIS;
  const naoLidas = lista.filter((item) => !item.lida && !item.arquivada).length;

  const valor = useMemo(
    () => ({
      notificacoes: lista,
      naoLidas,
      pronto,
      marcarLida,
      arquivar,
      excluir,
      adicionar,
    }),
    [lista, naoLidas, pronto, marcarLida, arquivar, excluir, adicionar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useNotificacoes(): NotificacoesContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useNotificacoes fora do provider");
  return contexto;
}
