import { alunoRepository } from "@/repositories/aluno-repository";

export const alunoService = {
  getPerfil() {
    return alunoRepository.getPerfil();
  },
  getContagens() {
    return alunoRepository.getContagens();
  },
  getHistorico() {
    return alunoRepository.getHistorico();
  },
};
