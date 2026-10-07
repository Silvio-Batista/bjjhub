import {
  aplicarFaixa,
  aplicarFinanceiro,
  calcularValorMensalidade,
  contratoDoAluno,
  mesclarPresencas,
  validarContrato,
  validarPromocao,
} from "@/domain/equipe/ajustes";
import {
  contarAulasDoDia,
  mensalidadeDaCompetencia,
  montarResumoAluno,
  montarResumoEquipe,
  ordenarLancamentos,
  ordenarPresencas,
} from "@/domain/equipe/resumo";
import { equipeRepository } from "@/repositories/equipe-repository";
import { aulaService } from "@/services/aula-service";
import { cadernoService } from "@/services/caderno-service";
import type {
  CadernoEquipe,
  ContratoMensalidade,
  DescontoMensalidade,
  FaixaNome,
  FichaAluno,
  LancamentoEquipe,
  LinhaPresenca,
  MetodoPagamento,
  ResumoAluno,
  ResumoEquipe,
  Sensei,
  StatusPresenca,
} from "@/types";
import { adicionarDias, competenciaDe, formatarIso } from "@/utils/datas";
import { calcularStatusFinanceiro } from "@/utils/regras";

function planoDe(planoId: string) {
  const plano = equipeRepository.listarPlanos().find((item) => item.id === planoId);
  if (!plano) throw new Error("Plano não encontrado.");
  return plano;
}

function visao(caderno: CadernoEquipe = cadernoService.ler()) {
  const alunos = equipeRepository.listarAlunos().map((aluno) => aplicarFaixa(aluno, caderno.promocoes));
  const presencas = mesclarPresencas(equipeRepository.listarPresencas(), caderno.presencas);
  const mensalidades = aplicarFinanceiro(equipeRepository.listarMensalidades(), caderno);
  return { caderno, alunos, presencas, mensalidades };
}

function resumos(referencia: Date, caderno?: CadernoEquipe): ResumoAluno[] {
  const { caderno: livro, alunos, presencas, mensalidades } = visao(caderno);
  const vinculos = equipeRepository.listarVinculos();
  const contagens = equipeRepository.listarContagens();

  return alunos.map((aluno) => {
    const vinculo = vinculos.find((item) => item.alunoId === aluno.id);
    const contagem = contagens.find((item) => item.alunoId === aluno.id);
    if (!vinculo || !contagem) throw new Error("Cadastro da equipe incompleto.");
    const plano = planoDe(vinculo.planoId);
    const contrato = contratoDoAluno(livro, aluno.id, plano.valor);
    const calculado = calcularValorMensalidade(contrato.valorBase, contrato.desconto);
    return montarResumoAluno({
      id: aluno.id,
      nome: aluno.nome,
      faixa: aluno.faixa.nome,
      grau: aluno.faixa.grau,
      vinculo,
      plano: { ...plano, valor: calculado.liquido },
      contagem,
      registros: presencas.filter((item) => item.alunoId === aluno.id),
      mensalidades: mensalidades.filter((item) => item.alunoId === aluno.id),
      referencia,
    });
  });
}

export const equipeService = {
  obterSensei(): Sensei {
    return equipeRepository.getSensei();
  },

  listarAlunos(referencia: Date, caderno?: CadernoEquipe): ResumoAluno[] {
    return resumos(referencia, caderno).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  },

  obterAluno(id: number, referencia: Date, caderno?: CadernoEquipe): FichaAluno | null {
    const visaoAtual = visao(caderno);
    const { alunos, presencas, mensalidades } = visaoAtual;
    const aluno = alunos.find((item) => item.id === id);
    const resumo = resumos(referencia, caderno).find((item) => item.id === id);
    const vinculo = equipeRepository.listarVinculos().find((item) => item.alunoId === id);
    if (!aluno || !resumo || !vinculo) return null;
    const plano = planoDe(vinculo.planoId);
    const contrato = contratoDoAluno(visaoAtual.caderno, id, plano.valor);

    const doAluno = mensalidades
      .filter((item) => item.alunoId === id)
      .sort((a, b) => b.competencia.localeCompare(a.competencia));

    const presencasRecentes = ordenarPresencas(
      presencas.filter((item) => item.alunoId === id).map((item) => ({ registro: item })),
    ).map((item) => item.registro);

    return {
      aluno,
      plano,
      resumo,
      mensalidades: doAluno,
      presencasRecentes,
      contrato,
      valorMensalidade: calcularValorMensalidade(contrato.valorBase, contrato.desconto),
      promocoes: visaoAtual.caderno.promocoes.filter((item) => item.alunoId === id),
      pagamentos: visaoAtual.caderno.pagamentos.filter((item) => item.alunoId === id),
    };
  },

  obterResumo(referencia: Date, caderno?: CadernoEquipe): ResumoEquipe {
    const aulas = aulaService.listar(referencia);
    const aulasHoje = contarAulasDoDia(aulas, formatarIso(referencia));
    return montarResumoEquipe(resumos(referencia, caderno), aulasHoje);
  },

  listarPagamentos(referencia: Date, caderno?: CadernoEquipe): LancamentoEquipe[] {
    const competencia = competenciaDe(formatarIso(referencia));
    const { alunos, mensalidades } = visao(caderno);
    const vinculos = equipeRepository.listarVinculos();

    const linhas = alunos.flatMap((aluno) => {
      const vinculo = vinculos.find((item) => item.alunoId === aluno.id);
      const mensalidade = mensalidadeDaCompetencia(
        mensalidades.filter((item) => item.alunoId === aluno.id),
        competencia,
      );
      if (!vinculo || !mensalidade || !vinculo.ativo) return [];
      return [
        {
          alunoId: aluno.id,
          nome: aluno.nome,
          ativo: vinculo.ativo,
          faixa: aluno.faixa.nome,
          planoNome: planoDe(vinculo.planoId).nome,
          mensalidade,
          status: calcularStatusFinanceiro(mensalidade, referencia).status,
        },
      ];
    });

    return ordenarLancamentos(linhas);
  },

  listarPresencas(caderno?: CadernoEquipe): LinhaPresenca[] {
    const { alunos, presencas } = visao(caderno);
    const linhas = presencas.map((registro) => {
      const aluno = alunos.find((item) => item.id === registro.alunoId);
      return {
        id: registro.id,
        alunoId: registro.alunoId,
        nome: aluno?.nome ?? "Aluno",
        faixa: aluno?.faixa.nome ?? "Branca",
        registro,
      };
    });
    return ordenarPresencas(linhas);
  },

  aulasRecentes(referencia: Date) {
    const hoje = formatarIso(referencia);
    const inicio = formatarIso(adicionarDias(referencia, -14));
    return aulaService
      .listar(referencia)
      .filter((aula) => aula.status !== "cancelada" && aula.data >= inicio && aula.data <= hoje)
      .sort((a, b) => `${b.data}${b.horarioInicio}`.localeCompare(`${a.data}${a.horarioInicio}`));
  },

  registrarGraduacao(entrada: {
    alunoId: number;
    faixa: FaixaNome;
    grau: number;
    data: string;
    nota: string;
  }): { ok: true } | { ok: false; erro: string } {
    const validacao = validarPromocao(entrada);
    if (!validacao.ok) return validacao;
    const gravou = cadernoService.registrarPromocao({
      id: `promo-${entrada.alunoId}-${Date.now()}`,
      alunoId: entrada.alunoId,
      faixa: entrada.faixa,
      grau: entrada.grau,
      data: entrada.data,
      nota: validacao.nota,
    });
    return gravou
      ? { ok: true }
      : { ok: false, erro: "Não foi possível guardar a graduação neste navegador." };
  },

  registrarPresenca(entrada: {
    alunoId: number;
    aulaId: string;
    status: StatusPresenca;
    referencia: Date;
  }): { ok: true } | { ok: false; erro: string } {
    const aula = aulaService.buscar(entrada.aulaId, entrada.referencia);
    if (!aula) return { ok: false, erro: "Escolha uma aula da grade." };
    const gravou = cadernoService.registrarPresenca({
      id: `caderno-${entrada.alunoId}-${aula.id}`,
      alunoId: entrada.alunoId,
      aulaId: aula.id,
      data: aula.data,
      horario: aula.horarioInicio,
      titulo: aula.titulo,
      categoria: aula.categoria,
      status: entrada.status,
    });
    return gravou
      ? { ok: true }
      : { ok: false, erro: "Não foi possível guardar a frequência neste navegador." };
  },

  registrarPagamento(entrada: {
    alunoId: number;
    competencia: string;
    valor: number;
    metodo: MetodoPagamento;
    data: string;
    nota: string;
  }): { ok: true } | { ok: false; erro: string } {
    if (!entrada.competencia) return { ok: false, erro: "Escolha o mês." };
    if (!entrada.data) return { ok: false, erro: "Informe a data do pagamento." };
    if (!Number.isFinite(entrada.valor) || entrada.valor < 0) {
      return { ok: false, erro: "Informe o valor informado pela secretaria." };
    }
    const nota = entrada.nota.trim();
    if (nota.length > 160) return { ok: false, erro: "A nota precisa ter no máximo 160 caracteres." };
    const gravou = cadernoService.registrarPagamento({
      id: `pag-${entrada.alunoId}-${entrada.competencia}`,
      alunoId: entrada.alunoId,
      competencia: entrada.competencia,
      pago: true,
      valor: Math.round(entrada.valor * 100) / 100,
      data: entrada.data,
      metodo: entrada.metodo,
      nota,
    });
    return gravou
      ? { ok: true }
      : { ok: false, erro: "Não foi possível guardar o pagamento neste navegador." };
  },

  reabrirMensalidade(entrada: {
    alunoId: number;
    competencia: string;
  }): { ok: true } | { ok: false; erro: string } {
    if (!entrada.competencia) return { ok: false, erro: "Escolha o mês." };
    const gravou = cadernoService.registrarPagamento({
      id: `pag-${entrada.alunoId}-${entrada.competencia}`,
      alunoId: entrada.alunoId,
      competencia: entrada.competencia,
      pago: false,
      valor: 0,
      data: "",
      metodo: "",
      nota: "",
    });
    return gravou
      ? { ok: true }
      : { ok: false, erro: "Não foi possível reabrir a mensalidade neste navegador." };
  },

  definirMensalidade(entrada: {
    alunoId: number;
    valorBase: number;
    desconto: DescontoMensalidade;
    taxaGraduacao: number;
  }): { ok: true } | { ok: false; erro: string } {
    const validacao = validarContrato(entrada);
    if (!validacao.ok) return validacao;
    const contrato: ContratoMensalidade = { alunoId: entrada.alunoId, ...validacao.contrato };
    const gravou = cadernoService.definirContrato(contrato);
    return gravou
      ? { ok: true }
      : { ok: false, erro: "Não foi possível guardar a mensalidade neste navegador." };
  },
};
