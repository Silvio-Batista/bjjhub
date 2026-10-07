import {
  alunosEquipe,
  contagensEquipe,
  mensalidadesEquipe,
  planosEquipe,
  presencasEquipe,
  sensei,
  vinculosEquipe,
} from "@/mocks/equipe";
import type {
  Aluno,
  ContagemEquipe,
  MensalidadeEquipe,
  Plano,
  RegistroPresencaEquipe,
  Sensei,
  VinculoAluno,
} from "@/types";

export interface EquipeRepository {
  getSensei(): Sensei;
  listarAlunos(): Aluno[];
  listarVinculos(): VinculoAluno[];
  listarPlanos(): Plano[];
  listarMensalidades(): MensalidadeEquipe[];
  listarPresencas(): RegistroPresencaEquipe[];
  listarContagens(): ContagemEquipe[];
}

export class MockEquipeRepository implements EquipeRepository {
  getSensei(): Sensei {
    return sensei;
  }

  listarAlunos(): Aluno[] {
    return alunosEquipe;
  }

  listarVinculos(): VinculoAluno[] {
    return vinculosEquipe;
  }

  listarPlanos(): Plano[] {
    return planosEquipe;
  }

  listarMensalidades(): MensalidadeEquipe[] {
    return mensalidadesEquipe;
  }

  listarPresencas(): RegistroPresencaEquipe[] {
    return presencasEquipe;
  }

  listarContagens(): ContagemEquipe[] {
    return contagensEquipe;
  }
}

export const equipeRepository: EquipeRepository = new MockEquipeRepository();
