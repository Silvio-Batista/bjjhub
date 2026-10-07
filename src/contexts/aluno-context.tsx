"use client";

import { CHAVES } from "@/constants/app";
import { aplicarFaixa } from "@/domain/equipe/ajustes";
import { useNoCliente } from "@/hooks/useNoCliente";
import { alunoService } from "@/services/aluno-service";
import { lerCaderno } from "@/services/caderno-service";
import type { Aluno, Endereco } from "@/types";
import { gravarStorage, inscreverStorage, lerStorage } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface AtualizacaoPerfil {
  nome?: string;
  telefone?: string;
  nascimento?: string;
  profissao?: string;
  foto?: string;
  endereco?: Partial<Endereco>;
}

interface AlunoContexto {
  perfil: Aluno;
  pronto: boolean;
  atualizarPerfil: (parcial: AtualizacaoPerfil) => boolean;
}

const Contexto = createContext<AlunoContexto | null>(null);
const PERFIL_INICIAL = alunoService.getPerfil();

let perfilEmCache: { perfil: string | null; caderno: string | null; valor: Aluno } | null = null;

function ler(): Aluno {
  if (typeof window === "undefined") return PERFIL_INICIAL;
  const perfil = window.localStorage.getItem(CHAVES.perfil);
  const caderno = window.localStorage.getItem(CHAVES.caderno);
  if (perfilEmCache && perfilEmCache.perfil === perfil && perfilEmCache.caderno === caderno) {
    return perfilEmCache.valor;
  }
  const base = lerStorage<Aluno>(CHAVES.perfil) ?? PERFIL_INICIAL;
  const valor = aplicarFaixa(base, lerCaderno().promocoes);
  perfilEmCache = { perfil, caderno, valor };
  return valor;
}

export function AlunoProvider({ children }: { children: React.ReactNode }) {
  const pronto = useNoCliente();
  const perfil = useSyncExternalStore(inscreverPerfil, ler, () => PERFIL_INICIAL);

  const atualizarPerfil = useCallback((parcial: AtualizacaoPerfil) => {
    const atual = ler();
    const proximo: Aluno = {
      ...atual,
      nome: parcial.nome?.trim() || atual.nome,
      telefone: parcial.telefone?.trim() || atual.telefone,
      nascimento: parcial.nascimento || atual.nascimento,
      profissao: parcial.profissao?.trim() ?? atual.profissao,
      foto: parcial.foto || atual.foto,
      endereco: { ...atual.endereco, ...parcial.endereco },
      email: atual.email,
      id: atual.id,
      academiaId: atual.academiaId,
      faixa: atual.faixa,
      dataMatricula: atual.dataMatricula,
    };
    return gravarStorage(CHAVES.perfil, proximo);
  }, []);

  const valor = useMemo(
    () => ({
      perfil: pronto ? perfil : PERFIL_INICIAL,
      pronto,
      atualizarPerfil,
    }),
    [perfil, pronto, atualizarPerfil],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

function inscreverPerfil(ouvinte: () => void) {
  const perfil = inscreverStorage(CHAVES.perfil, ouvinte);
  const caderno = inscreverStorage(CHAVES.caderno, ouvinte);
  return () => {
    perfil();
    caderno();
  };
}

export function useAluno(): AlunoContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useAluno fora do provider");
  return contexto;
}
