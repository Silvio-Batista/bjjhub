import { aulas } from "@/mocks/aulas";
import type { Aula } from "@/types";

export interface AulaRepository {
  listar(): Aula[];
  buscar(id: string): Aula | undefined;
}

export class MockAulaRepository implements AulaRepository {
  listar(): Aula[] {
    return aulas;
  }

  buscar(id: string): Aula | undefined {
    return aulas.find((aula) => aula.id === id);
  }
}

export const aulaRepository: AulaRepository = new MockAulaRepository();
