import { contarAulasNoGrau } from "@/domain/equipe/ajustes";
import type { Aluno, CadernoEquipe, Checkin, RegistroPresenca, ResumoPresencas } from "@/types";
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

export function montarHistorico(checkins: Checkin[], caderno?: CadernoEquipe): RegistroPresenca[] {
  const base = alunoService.getHistorico(caderno);
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
  perfil?: Aluno,
  caderno?: CadernoEquipe,
): ResumoPresencas {
  const perfilAtual = perfil ?? alunoService.getPerfil(caderno);
  const base = alunoService.getContagens();
  const historico = montarHistorico(checkins, caderno);
  const detalhe = alunoService.getHistorico(caderno);
  const novos = checkins.filter(
    (item) => !detalhe.some((registro) => registro.aulaId === item.aulaId),
  );

  const presencasDetalhe = detalhe.filter((item) => item.status === "presente").length;
  const ausenciasDetalhe = detalhe.filter((item) => item.status === "ausente").length;
  const justificadasDetalhe = detalhe.filter((item) => item.status === "justificado").length;
  const presencas = base.presencasAnteriores + presencasDetalhe + novos.length;
  const ausencias = base.ausenciasAnteriores + ausenciasDetalhe;
  const justificadas = base.justificadasAnteriores + justificadasDetalhe;
  const registrosNoGrau = [
    ...detalhe.map((item) => ({ status: item.status, data: item.data })),
    ...novos.map((item) => ({ status: "presente" as const, data: item.data })),
  ];
  const aulasNaFaixa = contarAulasNoGrau(
    base.aulasNaFaixaAnteriores,
    registrosNoGrau,
    perfilAtual.faixa.dataGraduacao,
    alunoService.getPerfilBase().faixa.dataGraduacao,
  );
  const diasNaFaixa = calcularDiasNaFaixa(perfilAtual.faixa.dataGraduacao, referencia);
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
      faixa: perfilAtual.faixa.nome,
      grau: perfilAtual.faixa.grau,
      diasNaFaixa,
      aulasNaFaixa,
    }),
    historico,
  };
}
