import { graduacoes } from "@/mocks/graduacoes";
import type { Graduacao } from "@/types";

export interface GraduacaoRepository {
  listar(): Graduacao[];
}

export class MockGraduacaoRepository implements GraduacaoRepository {
  listar(): Graduacao[] {
    return graduacoes;
  }
}

export const graduacaoRepository: GraduacaoRepository = new MockGraduacaoRepository();
