import { aplicarFaixa, mesclarPresencas, presencaDoAluno } from "@/domain/equipe/ajustes";
import { alunoRepository } from "@/repositories/aluno-repository";
import { lerCaderno } from "@/services/caderno-service";
import type { CadernoEquipe } from "@/types";

export const alunoService = {
  getPerfilBase() {
    return alunoRepository.getPerfil();
  },
  getPerfil(caderno: CadernoEquipe = lerCaderno()) {
    return aplicarFaixa(alunoRepository.getPerfil(), caderno.promocoes);
  },
  getContagens() {
    return alunoRepository.getContagens();
  },
  getHistorico(caderno: CadernoEquipe = lerCaderno()) {
    const base = alunoRepository.getHistorico().map((item) => ({ ...item, alunoId: 1 }));
    const mesclado = mesclarPresencas(
      base,
      caderno.presencas.filter((item) => item.alunoId === 1),
    );
    return presencaDoAluno(mesclado, 1);
  },
};
