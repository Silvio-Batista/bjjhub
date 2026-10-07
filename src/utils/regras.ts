import { differenceInCalendarDays } from "date-fns";
import {
  FREQUENCIA_BOA,
  FREQUENCIA_REGULAR,
  REQUISITOS_GRAU,
} from "@/constants/app";
import type { ProgressoGraduacao, StatusFinanceiro } from "@/types";
import { inicioDoDia, parseData } from "@/utils/datas";
import { proximaMeta, rotuloFaixaGrau } from "@/utils/formatacao";

export function calcularDiasNaFaixa(dataGraduacao: string, referencia: Date): number {
  return Math.max(
    0,
    differenceInCalendarDays(inicioDoDia(referencia), parseData(dataGraduacao)),
  );
}

export function calcularFrequencia(
  presencas: number,
  ausencias: number,
  justificadas = 0,
): number {
  const consideradas = presencas + ausencias;
  if (consideradas <= 0 || justificadas < 0) return 0;
  return Math.round((presencas / consideradas) * 100);
}

export function rotuloFrequencia(percentual: number): "Boa" | "Regular" | "Baixa" {
  if (percentual >= FREQUENCIA_BOA) return "Boa";
  if (percentual >= FREQUENCIA_REGULAR) return "Regular";
  return "Baixa";
}

export function calcularProgressoGraduacao(entrada: {
  faixa: string;
  grau: number;
  diasNaFaixa: number;
  aulasNaFaixa: number;
  diasNecessarios?: number;
  aulasNecessarias?: number;
}): ProgressoGraduacao {
  const diasNecessarios = entrada.diasNecessarios ?? REQUISITOS_GRAU.dias;
  const aulasNecessarias = entrada.aulasNecessarias ?? REQUISITOS_GRAU.aulas;
  const proxima = proximaMeta(entrada.faixa, entrada.grau);
  const diasRestantes = Math.max(0, diasNecessarios - entrada.diasNaFaixa);
  const aulasRestantes = Math.max(0, aulasNecessarias - entrada.aulasNaFaixa);

  return {
    faixa: entrada.faixa,
    grauAtual: entrada.grau,
    proximaFaixa: proxima.faixa,
    proximoGrau: proxima.grau,
    rotuloAtual: rotuloFaixaGrau(entrada.faixa, entrada.grau),
    rotuloProximo: rotuloFaixaGrau(proxima.faixa, proxima.grau),
    diasNaFaixa: entrada.diasNaFaixa,
    diasNecessarios,
    aulasNaFaixa: entrada.aulasNaFaixa,
    aulasNecessarias,
    progressoDias: diasNecessarios === 0 ? 0 : Math.min(1, entrada.diasNaFaixa / diasNecessarios),
    progressoAulas:
      aulasNecessarias === 0 ? 0 : Math.min(1, entrada.aulasNaFaixa / aulasNecessarias),
    diasRestantes,
    aulasRestantes,
    elegivel: diasRestantes === 0 && aulasRestantes === 0,
  };
}

export function calcularStatusFinanceiro(
  mensalidade: { pago: boolean; vencimento: string },
  referencia: Date,
): StatusFinanceiro {
  if (mensalidade.pago) {
    return {
      status: "pago",
      acessoLiberado: true,
      rotuloAcesso: "Acesso liberado",
      mensagem: "Mensalidade em dia.",
    };
  }

  const vencida =
    parseData(mensalidade.vencimento).getTime() < inicioDoDia(referencia).getTime();

  if (vencida) {
    return {
      status: "atrasado",
      acessoLiberado: false,
      rotuloAcesso: "Acesso encerrado",
      mensagem: "Mensalidade em atraso. Regularize sua situação.",
    };
  }

  return {
    status: "pendente",
    acessoLiberado: true,
    rotuloAcesso: "Acesso liberado",
    mensagem: "Há uma mensalidade em aberto. O vencimento ainda não chegou.",
  };
}
