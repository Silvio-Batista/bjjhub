import { graduacaoRepository } from "@/repositories/graduacao-repository";

export const graduacaoService = {
  listar() {
    return graduacaoRepository.listar();
  },
};
