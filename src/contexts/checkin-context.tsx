"use client";

import { CHAVES } from "@/constants/app";
import { useNoCliente } from "@/hooks/useNoCliente";
import { useAluno } from "@/contexts/aluno-context";
import { useNotificacoes } from "@/contexts/notificacoes-context";
import { academiaService } from "@/services/academia-service";
import { jaPresente } from "@/services/presenca-service";
import { alunoService } from "@/services/aluno-service";
import type { Aula, Checkin } from "@/types";
import { formatarHora, formatarIso, isoLocal } from "@/utils/datas";
import { gravarStorage, inscreverStorage, lerStorage } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface CheckinContexto {
  checkins: Checkin[];
  confirmacoes: string[];
  pronto: boolean;
  confirmarPresenca: (aulaId: string) => void;
  cancelarPresenca: (aulaId: string) => void;
  estaConfirmada: (aulaId: string) => boolean;
  registrarCheckin: (aula: Aula) => { ok: true; checkin: Checkin } | { ok: false; erro: string };
  possuiCheckin: (aulaId: string) => boolean;
}

const Contexto = createContext<CheckinContexto | null>(null);
const LISTA_VAZIA: Checkin[] = [];
const CONFIRMACOES_VAZIAS: string[] = [];

function lerCheckins(): Checkin[] {
  return lerStorage<Checkin[]>(CHAVES.checkins) ?? LISTA_VAZIA;
}

function lerConfirmacoes(): string[] {
  return lerStorage<string[]>(CHAVES.confirmacoes) ?? CONFIRMACOES_VAZIAS;
}

export function CheckinProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const { perfil } = useAluno();
  const { adicionar } = useNotificacoes();
  const checkins = useSyncExternalStore(
    (ouvinte) => inscreverStorage(CHAVES.checkins, ouvinte),
    lerCheckins,
    () => LISTA_VAZIA,
  );
  const confirmacoes = useSyncExternalStore(
    (ouvinte) => inscreverStorage(CHAVES.confirmacoes, ouvinte),
    lerConfirmacoes,
    () => CONFIRMACOES_VAZIAS,
  );

  const possuiCheckin = useCallback(
    (aulaId: string) => jaPresente(aulaId, lerCheckins(), alunoService.getHistorico()),
    [],
  );

  const registrarCheckin = useCallback(
    (aula: Aula) => {
      if (possuiCheckin(aula.id)) {
        return { ok: false as const, erro: "Você já realizou check-in nesta aula." };
      }
      const agora = new Date();
      const academia = academiaService.getAcademia();
      const checkin: Checkin = {
        id: `chk-${aula.id}-${agora.getTime()}`,
        aulaId: aula.id,
        alunoId: perfil.id,
        academiaId: academia.id,
        academiaNome: academia.nome,
        data: formatarIso(agora),
        hora: formatarHora(agora),
        tituloAula: aula.titulo,
        categoria: aula.categoria,
        horarioAula: aula.horarioInicio,
      };
      gravarStorage(CHAVES.checkins, [checkin, ...lerCheckins()]);
      adicionar({
        id: `chk-not-${agora.getTime()}`,
        tipo: "AULA",
        titulo: "Check-in realizado",
        mensagem: `Presença registrada em ${aula.titulo}, às ${formatarHora(agora)}, na ${academia.nome}.`,
        criadaEm: isoLocal(agora),
        lida: false,
        arquivada: false,
      });
      return { ok: true as const, checkin };
    },
    [adicionar, perfil.id, possuiCheckin],
  );

  const confirmarPresenca = useCallback((aulaId: string) => {
    const atual = lerConfirmacoes();
    if (atual.includes(aulaId)) return;
    gravarStorage(CHAVES.confirmacoes, [...atual, aulaId]);
  }, []);

  const cancelarPresenca = useCallback((aulaId: string) => {
    gravarStorage(
      CHAVES.confirmacoes,
      lerConfirmacoes().filter((id) => id !== aulaId),
    );
  }, []);

  const estaConfirmada = useCallback(
    (aulaId: string) => confirmacoes.includes(aulaId),
    [confirmacoes],
  );

  const valor = useMemo(
    () => ({
      checkins: pronto ? checkins : LISTA_VAZIA,
      confirmacoes: pronto ? confirmacoes : CONFIRMACOES_VAZIAS,
      pronto,
      confirmarPresenca,
      cancelarPresenca,
      estaConfirmada,
      registrarCheckin,
      possuiCheckin,
    }),
    [
      checkins,
      confirmacoes,
      pronto,
      confirmarPresenca,
      cancelarPresenca,
      estaConfirmada,
      registrarCheckin,
      possuiCheckin,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCheckins(): CheckinContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useCheckins fora do provider");
  return contexto;
}
