import { CORES_FAIXA } from "@/constants/app";
import type {
  AjustePagamento,
  Aluno,
  CadernoEquipe,
  ContratoMensalidade,
  DescontoMensalidade,
  FaixaNome,
  Graduacao,
  Mensalidade,
  Promocao,
  RegistroPresenca,
  RegistroPresencaEquipe,
  ValorMensalidade,
} from "@/types";

export const CADERNO_VAZIO: CadernoEquipe = {
  promocoes: [],
  presencas: [],
  pagamentos: [],
  contratos: [],
};

export function grauMaximo(faixa: FaixaNome): number {
  return faixa === "Preta" ? 6 : 4;
}

export function calcularValorMensalidade(
  brutoInformado: number,
  desconto: DescontoMensalidade,
): ValorMensalidade {
  const bruto = arredondar(Math.max(0, brutoInformado));
  let descontoAplicado = 0;
  if (desconto.tipo === "percentual") {
    const percentual = Math.min(100, Math.max(0, desconto.valor));
    descontoAplicado = arredondar(bruto * (percentual / 100));
  }
  if (desconto.tipo === "fixo") {
    descontoAplicado = arredondar(Math.min(bruto, Math.max(0, desconto.valor)));
  }
  return {
    bruto,
    descontoAplicado,
    liquido: arredondar(bruto - descontoAplicado),
  };
}

export function validarContrato(entrada: {
  valorBase: number;
  desconto: DescontoMensalidade;
  taxaGraduacao: number;
}): { ok: true; contrato: Omit<ContratoMensalidade, "alunoId"> } | { ok: false; erro: string } {
  if (!Number.isFinite(entrada.valorBase) || entrada.valorBase <= 0) {
    return { ok: false, erro: "Informe um valor mensal maior que zero." };
  }
  if (!Number.isFinite(entrada.taxaGraduacao) || entrada.taxaGraduacao < 0) {
    return { ok: false, erro: "A taxa de graduação não pode ser negativa." };
  }
  if (entrada.desconto.tipo === "percentual") {
    if (entrada.desconto.valor < 0 || entrada.desconto.valor > 100) {
      return { ok: false, erro: "O desconto percentual fica entre 0 e 100." };
    }
  }
  if (entrada.desconto.tipo === "fixo" && entrada.desconto.valor < 0) {
    return { ok: false, erro: "O desconto fixo não pode ser negativo." };
  }
  return {
    ok: true,
    contrato: {
      valorBase: arredondar(entrada.valorBase),
      desconto: {
        tipo: entrada.desconto.tipo,
        valor: entrada.desconto.tipo === "nenhum" ? 0 : arredondar(entrada.desconto.valor),
      },
      taxaGraduacao: arredondar(entrada.taxaGraduacao),
    },
  };
}

export function validarPromocao(entrada: {
  faixa: FaixaNome;
  grau: number;
  data: string;
  nota: string;
}): { ok: true; nota: string } | { ok: false; erro: string } {
  if (!entrada.data) return { ok: false, erro: "Informe a data da graduação." };
  if (!Number.isInteger(entrada.grau) || entrada.grau < 0 || entrada.grau > grauMaximo(entrada.faixa)) {
    return { ok: false, erro: "O grau não existe nessa faixa." };
  }
  const nota = entrada.nota.trim();
  if (!nota) return { ok: false, erro: "Escreva uma nota curta sobre a graduação." };
  if (nota.length > 160) return { ok: false, erro: "A nota precisa ter no máximo 160 caracteres." };
  return { ok: true, nota };
}

export function ultimaPromocao(promocoes: Promocao[], alunoId: number): Promocao | undefined {
  return promocoes.filter((item) => item.alunoId === alunoId).reduce<Promocao | undefined>(
    (melhor, item) => {
      if (!melhor || item.data >= melhor.data) return item;
      return melhor;
    },
    undefined,
  );
}

export function aplicarFaixa(aluno: Aluno, promocoes: Promocao[]): Aluno {
  const promo = ultimaPromocao(promocoes, aluno.id);
  if (!promo) return aluno;
  return {
    ...aluno,
    faixa: {
      nome: promo.faixa,
      cor: CORES_FAIXA[promo.faixa],
      grau: promo.grau,
      dataGraduacao: promo.data,
    },
  };
}

export function mesclarPresencas<T extends { alunoId: number; aulaId: string }>(
  base: T[],
  ajustes: T[],
): T[] {
  const mapa = new Map(base.map((item) => [`${item.alunoId}:${item.aulaId}`, item]));
  for (const ajuste of ajustes) {
    mapa.set(`${ajuste.alunoId}:${ajuste.aulaId}`, ajuste);
  }
  return [...mapa.values()];
}

export function contarAulasNoGrau(
  anteriores: number,
  registros: Pick<RegistroPresenca, "status" | "data">[],
  dataGraduacao: string,
  dataOriginal: string,
): number {
  const noPeriodo = registros.filter(
    (item) => item.status === "presente" && item.data >= dataGraduacao,
  ).length;
  if (dataGraduacao !== dataOriginal) return noPeriodo;
  return anteriores + noPeriodo;
}

export function valorContratado(
  mensalidade: Mensalidade,
  contrato: ContratoMensalidade | undefined,
): number {
  if (!contrato) return mensalidade.valor;
  return calcularValorMensalidade(contrato.valorBase, contrato.desconto).liquido;
}

export function aplicarFinanceiro<T extends Mensalidade & { alunoId: number }>(
  mensalidades: T[],
  caderno: CadernoEquipe,
): T[] {
  return mensalidades.map((item) => {
    const contrato = caderno.contratos.find((contratoItem) => contratoItem.alunoId === item.alunoId);
    const ajuste = caderno.pagamentos.find(
      (pagamento) => pagamento.alunoId === item.alunoId && pagamento.competencia === item.competencia,
    );
    return aplicarNaMensalidade(item, contrato, ajuste);
  });
}

export function aplicarNaMensalidade<T extends Mensalidade>(
  mensalidade: T,
  contrato: ContratoMensalidade | undefined,
  ajuste: AjustePagamento | undefined,
): T {
  const contratado = valorContratado(mensalidade, contrato);
  if (!ajuste) return { ...mensalidade, valor: contratado };
  if (!ajuste.pago) {
    return { ...mensalidade, valor: contratado, pago: false, pagoEm: undefined, metodo: undefined };
  }
  return {
    ...mensalidade,
    valor: arredondar(ajuste.valor),
    pago: true,
    pagoEm: ajuste.data,
    metodo: ajuste.metodo || mensalidade.metodo,
  };
}

export function linhaDoTempo(base: Graduacao[], promocoes: Promocao[], alunoId: number): Graduacao[] {
  const extras: Graduacao[] = promocoes
    .filter((item) => item.alunoId === alunoId)
    .map((item) => ({
      id: item.id,
      faixa: item.faixa,
      grau: item.grau,
      data: item.data,
      descricao: item.nota,
    }));
  return [...base, ...extras].sort((a, b) => a.data.localeCompare(b.data) || a.id.localeCompare(b.id));
}

export function contratoDoAluno(
  caderno: CadernoEquipe,
  alunoId: number,
  valorPadrao: number,
): ContratoMensalidade {
  return (
    caderno.contratos.find((item) => item.alunoId === alunoId) ?? {
      alunoId,
      valorBase: valorPadrao,
      desconto: { tipo: "nenhum", valor: 0 },
      taxaGraduacao: 0,
    }
  );
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function presencaDoAluno(
  registros: RegistroPresencaEquipe[],
  alunoId: number,
): RegistroPresenca[] {
  return registros
    .filter((item) => item.alunoId === alunoId)
    .map((item) => ({
      id: item.id,
      data: item.data,
      horario: item.horario,
      titulo: item.titulo,
      categoria: item.categoria,
      status: item.status,
      aulaId: item.aulaId,
    }));
}
