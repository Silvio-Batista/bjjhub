import type { Aluno, Checkin, RegistroPresenca, ResumoPresencas } from "@/types";
import { alunoService } from "@/services/aluno-service";
import {
  calcularDiasNaFaixa,
  calcularFrequencia,
  calcularProgressoGraduacao,
  rotuloFrequencia,
} from "@/utils/regras";

export function jaPresente(
  aulaId: string,
  checkins: Checkin[],
  historico: RegistroPresenca[],
): boolean {
  return (
    checkins.some((item) => item.aulaId === aulaId) ||
    historico.some((item) => item.aulaId === aulaId && item.status === "presente")
  );
}

export function montarHistorico(checkins: Checkin[]): RegistroPresenca[] {
  const base = alunoService.getHistorico();
  const extras: RegistroPresenca[] = checkins
    .filter((item) => !base.some((registro) => registro.aulaId === item.aulaId))
    .map((item) => ({
      id: item.id,
      data: item.data,
      horario: item.horarioAula,
      titulo: item.tituloAula,
      categoria: item.categoria,
      status: "presente" as const,
      aulaId: item.aulaId,
    }));

  return [...base, ...extras].sort((a, b) => {
    const porData = b.data.localeCompare(a.data);
    if (porData !== 0) return porData;
    return b.horario.localeCompare(a.horario);
  });
}

export function resumirPresencas(
  checkins: Checkin[],
  referencia: Date,
  perfil: Aluno = alunoService.getPerfil(),
): ResumoPresencas {
  const base = alunoService.getContagens();
  const historico = montarHistorico(checkins);
  const detalhe = alunoService.getHistorico();
  const novos = checkins.filter(
    (item) => !detalhe.some((registro) => registro.aulaId === item.aulaId),
  );

  const presencasDetalhe = detalhe.filter((item) => item.status === "presente").length;
  const ausenciasDetalhe = detalhe.filter((item) => item.status === "ausente").length;
  const justificadasDetalhe = detalhe.filter((item) => item.status === "justificado").length;
  const presencas = base.presencasAnteriores + presencasDetalhe + novos.length;
  const ausencias = base.ausenciasAnteriores + ausenciasDetalhe;
  const justificadas = base.justificadasAnteriores + justificadasDetalhe;
  const aulasDetalheNaFaixa = detalhe.filter(
    (item) => item.status === "presente" && item.data >= perfil.faixa.dataGraduacao,
  ).length;
  const aulasNovasNaFaixa = novos.filter(
    (item) => item.data >= perfil.faixa.dataGraduacao,
  ).length;
  const aulasNaFaixa = base.aulasNaFaixaAnteriores + aulasDetalheNaFaixa + aulasNovasNaFaixa;
  const diasNaFaixa = calcularDiasNaFaixa(perfil.faixa.dataGraduacao, referencia);
  const frequencia = calcularFrequencia(presencas, ausencias, justificadas);

  return {
    totalAulas: presencas,
    presencas,
    ausencias,
    justificadas,
    frequencia,
    rotuloFrequencia: rotuloFrequencia(frequencia),
    aulasNaFaixa,
    diasNaFaixa,
    progresso: calcularProgressoGraduacao({
      faixa: perfil.faixa.nome,
      grau: perfil.faixa.grau,
      diasNaFaixa,
      aulasNaFaixa,
    }),
    historico,
  };
}
