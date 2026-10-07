import { notificacaoRepository } from "@/repositories/notificacao-repository";

export const notificacaoService = {
  listar() {
    return notificacaoRepository.listar();
  },
};
