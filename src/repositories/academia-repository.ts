import { academia, professores } from "@/mocks/academia";
import type { Academia, Professor } from "@/types";

export interface AcademiaRepository {
  getAcademia(): Academia;
  getProfessores(): Professor[];
}

export class MockAcademiaRepository implements AcademiaRepository {
  getAcademia(): Academia {
    return academia;
  }

  getProfessores(): Professor[] {
    return professores;
  }
}

export const academiaRepository: AcademiaRepository = new MockAcademiaRepository();
