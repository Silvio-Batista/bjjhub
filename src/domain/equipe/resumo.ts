import type {
  Aula,
  ContagemBase,
  LancamentoEquipe,
  Mensalidade,
  Plano,
  RegistroPresenca,
  ResumoAluno,
  ResumoEquipe,
  StatusMensalidade,
  StatusPresenca,
  VinculoAluno,
} from "@/types";
import { competenciaDe, formatarIso } from "@/utils/datas";
import {
  calcularFrequencia,
  calcularStatusFinanceiro,
  rotuloFrequencia,
} from "@/utils/regras";

export function frequenciaDoAluno(
  contagem: ContagemBase,
  registros: Pick<RegistroPresenca, "status">[],
): {
  presencas: number;
  ausencias: number;
  justificadas: number;
  frequencia: number;
  rotuloFrequencia: "Boa" | "Regular" | "Baixa";
} {
  const presencas =
    contagem.presencasAnteriores +
    registros.filter((item) => item.status === "presente").length;
  const ausencias =
    contagem.ausenciasAnteriores +
    registros.filter((item) => item.status === "ausente").length;
  const justificadas =
    contagem.justificadasAnteriores +
    registros.filter((item) => item.status === "justificado").length;
  const frequencia = calcularFrequencia(presencas, ausencias, justificadas);
  return {
    presencas,
    ausencias,
    justificadas,
    frequencia,
    rotuloFrequencia: rotuloFrequencia(frequencia),
  };
}

export function mensalidadeDaCompetencia(
  mensalidades: Mensalidade[],
  competencia: string,
): Mensalidade | undefined {
  return mensalidades.find((item) => item.competencia === competencia);
}

export function montarResumoAluno(entrada: {
  id: number;
  nome: string;
  faixa: ResumoAluno["faixa"];
  grau: number;
  vinculo: VinculoAluno;
  plano: Plano;
  contagem: ContagemBase;
  registros: Pick<RegistroPresenca, "status">[];
  mensalidades: Mensalidade[];
  referencia: Date;
}): ResumoAluno {
  const frequencia = frequenciaDoAluno(entrada.contagem, entrada.registros);
  const competencia = competenciaDe(formatarIso(entrada.referencia));
  const mensalidade = mensalidadeDaCompetencia(entrada.mensalidades, competencia);
  const situacao = mensalidade
    ? calcularStatusFinanceiro(mensalidade, entrada.referencia)
    : calcularStatusFinanceiro(
        { pago: false, vencimento: formatarIso(entrada.referencia) },
        entrada.referencia,
      );

  return {
    id: entrada.id,
    nome: entrada.nome,
    ativo: entrada.vinculo.ativo,
    faixa: entrada.faixa,
    grau: entrada.grau,
    planoNome: entrada.plano.nome,
    planoValor: entrada.plano.valor,
    frequencia: frequencia.frequencia,
    rotuloFrequencia: frequencia.rotuloFrequencia,
    presencas: frequencia.presencas,
    ausencias: frequencia.ausencias,
    justificadas: frequencia.justificadas,
    statusFinanceiro: situacao.status,
    valorEmAberto: !mensalidade || situacao.status === "pago" ? 0 : mensalidade.valor,
    competencia,
    vencimento: mensalidade?.vencimento ?? "",
  };
}

export function mediaFrequencia(frequencias: number[]): number {
  if (frequencias.length === 0) return 0;
  const soma = frequencias.reduce((total, valor) => total + valor, 0);
  return Math.round(soma / frequencias.length);
}

export function contarAulasDoDia(
  aulas: Pick<Aula, "data" | "status">[],
  dia: string,
): number {
  return aulas.filter((aula) => aula.data === dia && aula.status !== "cancelada").length;
}

export function montarResumoEquipe(alunos: ResumoAluno[], aulasHoje: number): ResumoEquipe {
  const ativos = alunos.filter((aluno) => aluno.ativo);
  return {
    alunosAtivos: ativos.length,
    pagamentosAtrasados: ativos.filter((aluno) => aluno.statusFinanceiro === "atrasado")
      .length,
    frequenciaMedia: mediaFrequencia(ativos.map((aluno) => aluno.frequencia)),
    aulasHoje,
  };
}

export function somarEmAberto(
  itens: { status: StatusMensalidade; valor: number }[],
): number {
  return itens
    .filter((item) => item.status !== "pago")
    .reduce((total, item) => total + item.valor, 0);
}

export function contarPorStatus(statuses: StatusMensalidade[]): Record<StatusMensalidade, number> {
  return {
    pago: statuses.filter((status) => status === "pago").length,
    pendente: statuses.filter((status) => status === "pendente").length,
    atrasado: statuses.filter((status) => status === "atrasado").length,
  };
}

export function filtrarResumoAlunos(
  alunos: ResumoAluno[],
  filtro: {
    busca: string;
    faixa: ResumoAluno["faixa"] | "todas";
    status: StatusMensalidade | "todos";
    somenteAtivos: boolean;
  },
): ResumoAluno[] {
  const busca = normalizar(filtro.busca.trim());
  return alunos
    .filter((aluno) => (filtro.somenteAtivos ? aluno.ativo : true))
    .filter((aluno) => (filtro.faixa === "todas" ? true : aluno.faixa === filtro.faixa))
    .filter((aluno) =>
      filtro.status === "todos" ? true : aluno.statusFinanceiro === filtro.status,
    )
    .filter((aluno) => (busca ? normalizar(aluno.nome).includes(busca) : true))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function ordenarLancamentos(itens: LancamentoEquipe[]): LancamentoEquipe[] {
  const peso: Record<StatusMensalidade, number> = { atrasado: 0, pendente: 1, pago: 2 };
  return [...itens].sort((a, b) => {
    const porStatus = peso[a.status] - peso[b.status];
    if (porStatus !== 0) return porStatus;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });
}

export function ordenarPresencas<T extends { registro: Pick<RegistroPresenca, "data" | "horario"> }>(
  linhas: T[],
): T[] {
  return [...linhas].sort((a, b) => {
    const porData = b.registro.data.localeCompare(a.registro.data);
    if (porData !== 0) return porData;
    return b.registro.horario.localeCompare(a.registro.horario);
  });
}

export function rotuloStatusMensalidade(status: StatusMensalidade): string {
  if (status === "pago") return "Pago";
  if (status === "pendente") return "Pendente";
  return "Atrasado";
}

export function rotuloStatusPresenca(status: StatusPresenca): string {
  if (status === "presente") return "Presente";
  if (status === "ausente") return "Ausente";
  return "Justificado";
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
