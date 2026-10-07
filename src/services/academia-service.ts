import { academiaRepository } from "@/repositories/academia-repository";

export const academiaService = {
  getAcademia() {
    return academiaRepository.getAcademia();
  },
  getProfessores() {
    return academiaRepository.getProfessores();
  },
};
