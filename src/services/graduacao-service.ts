import { linhaDoTempo } from "@/domain/equipe/ajustes";
import { graduacaoRepository } from "@/repositories/graduacao-repository";
import { lerCaderno } from "@/services/caderno-service";
import type { CadernoEquipe } from "@/types";

export const graduacaoService = {
  listar(alunoId = 1, caderno: CadernoEquipe = lerCaderno()) {
    return linhaDoTempo(graduacaoRepository.listar(), caderno.promocoes, alunoId);
  },
};
