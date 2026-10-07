import { financeiroRepository } from "@/repositories/financeiro-repository";
import type { Mensalidade, Plano, StatusFinanceiro } from "@/types";
import { calcularStatusFinanceiro } from "@/utils/regras";

export interface PainelFinanceiro {
  plano: Plano;
  mensalidades: Array<Mensalidade & { situacao: StatusFinanceiro }>;
  atual: Mensalidade & { situacao: StatusFinanceiro };
  proxima: Mensalidade & { situacao: StatusFinanceiro };
  mediaMensal: number;
  metodoPreferido: string;
  pagos: number;
  pendentes: number;
}

function metodoPreferido(mensalidades: Mensalidade[]): string {
  const contagem = new Map<string, number>();
  for (const item of mensalidades) {
    if (!item.pago || !item.metodo) continue;
    contagem.set(item.metodo, (contagem.get(item.metodo) ?? 0) + 1);
  }
  const ordenados = [...contagem.entries()].sort((a, b) => b[1] - a[1]);
  return ordenados[0]?.[0] ?? "Não informado";
}

export const financeiroService = {
  obterPainel(referencia: Date): PainelFinanceiro {
    const plano = financeiroRepository.getPlano();
    const lista = financeiroRepository.listarMensalidades().map((item) => ({
      ...item,
      situacao: calcularStatusFinanceiro(item, referencia),
    }));
    const ordenadas = [...lista].sort((a, b) => b.competencia.localeCompare(a.competencia));
    const atual = ordenadas[0];
    if (!atual) {
      throw new Error("Nenhuma mensalidade cadastrada.");
    }
    const abertas = lista
      .filter((item) => !item.pago)
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
    const proxima = abertas[0] ?? atual;
    const soma = lista.reduce((total, item) => total + item.valor, 0);

    return {
      plano,
      mensalidades: lista,
      atual,
      proxima,
      mediaMensal: lista.length === 0 ? 0 : soma / lista.length,
      metodoPreferido: metodoPreferido(lista),
      pagos: lista.filter((item) => item.situacao.status === "pago").length,
      pendentes: lista.filter((item) => item.situacao.status !== "pago").length,
    };
  },
};
