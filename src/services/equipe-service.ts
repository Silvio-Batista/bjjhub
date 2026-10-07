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
import type {
  FichaAluno,
  LancamentoEquipe,
  LinhaPresenca,
  ResumoAluno,
  ResumoEquipe,
  Sensei,
} from "@/types";
import { competenciaDe, formatarIso } from "@/utils/datas";
import { calcularStatusFinanceiro } from "@/utils/regras";

function planoDe(planoId: string) {
  const plano = equipeRepository.listarPlanos().find((item) => item.id === planoId);
  if (!plano) throw new Error("Plano não encontrado.");
  return plano;
}

function resumos(referencia: Date): ResumoAluno[] {
  const vinculos = equipeRepository.listarVinculos();
  const contagens = equipeRepository.listarContagens();
  const presencas = equipeRepository.listarPresencas();
  const mensalidades = equipeRepository.listarMensalidades();

  return equipeRepository.listarAlunos().map((aluno) => {
    const vinculo = vinculos.find((item) => item.alunoId === aluno.id);
    const contagem = contagens.find((item) => item.alunoId === aluno.id);
    if (!vinculo || !contagem) throw new Error("Cadastro da equipe incompleto.");
    return montarResumoAluno({
      id: aluno.id,
      nome: aluno.nome,
      faixa: aluno.faixa.nome,
      grau: aluno.faixa.grau,
      vinculo,
      plano: planoDe(vinculo.planoId),
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

  listarAlunos(referencia: Date): ResumoAluno[] {
    return resumos(referencia).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  },

  obterAluno(id: number, referencia: Date): FichaAluno | null {
    const aluno = equipeRepository.listarAlunos().find((item) => item.id === id);
    const resumo = resumos(referencia).find((item) => item.id === id);
    const vinculo = equipeRepository.listarVinculos().find((item) => item.alunoId === id);
    if (!aluno || !resumo || !vinculo) return null;

    const mensalidades = equipeRepository
      .listarMensalidades()
      .filter((item) => item.alunoId === id)
      .sort((a, b) => b.competencia.localeCompare(a.competencia));

    const presencasRecentes = ordenarPresencas(
      equipeRepository
        .listarPresencas()
        .filter((item) => item.alunoId === id)
        .map((item) => ({ registro: item })),
    ).map((item) => item.registro);

    return {
      aluno,
      plano: planoDe(vinculo.planoId),
      resumo,
      mensalidades,
      presencasRecentes,
    };
  },

  obterResumo(referencia: Date): ResumoEquipe {
    const aulas = aulaService.listar(referencia);
    const aulasHoje = contarAulasDoDia(aulas, formatarIso(referencia));
    return montarResumoEquipe(resumos(referencia), aulasHoje);
  },

  listarPagamentos(referencia: Date): LancamentoEquipe[] {
    const competencia = competenciaDe(formatarIso(referencia));
    const alunos = equipeRepository.listarAlunos();
    const vinculos = equipeRepository.listarVinculos();
    const mensalidades = equipeRepository.listarMensalidades();

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

  listarPresencas(): LinhaPresenca[] {
    const alunos = equipeRepository.listarAlunos();
    const linhas = equipeRepository.listarPresencas().map((registro) => {
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
};
