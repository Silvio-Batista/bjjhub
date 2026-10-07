import { aluno, contagensBase, historico } from "@/mocks/aluno";
import type { Aluno, ContagemBase, RegistroPresenca } from "@/types";

export interface AlunoRepository {
  getPerfil(): Aluno;
  getContagens(): ContagemBase;
  getHistorico(): RegistroPresenca[];
}

export class MockAlunoRepository implements AlunoRepository {
  getPerfil(): Aluno {
    return aluno;
  }

  getContagens(): ContagemBase {
    return contagensBase;
  }

  getHistorico(): RegistroPresenca[] {
    return historico;
  }
}

export const alunoRepository: AlunoRepository = new MockAlunoRepository();
