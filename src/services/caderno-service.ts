import { CHAVES } from "@/constants/app";
import { CADERNO_VAZIO } from "@/domain/equipe/ajustes";
import type {
  AjustePagamento,
  CadernoEquipe,
  ContratoMensalidade,
  Promocao,
  RegistroPresencaEquipe,
} from "@/types";
import { gravarStorage, lerStorage } from "@/utils/storage";

export function lerCaderno(): CadernoEquipe {
  return lerStorage<CadernoEquipe>(CHAVES.caderno) ?? CADERNO_VAZIO;
}

function gravar(caderno: CadernoEquipe): boolean {
  return gravarStorage(CHAVES.caderno, caderno);
}

export const cadernoService = {
  ler: lerCaderno,

  registrarPromocao(promocao: Promocao): boolean {
    const atual = lerCaderno();
    return gravar({ ...atual, promocoes: [...atual.promocoes, promocao] });
  },

  registrarPresenca(registro: RegistroPresencaEquipe): boolean {
    const atual = lerCaderno();
    const restantes = atual.presencas.filter(
      (item) => !(item.alunoId === registro.alunoId && item.aulaId === registro.aulaId),
    );
    return gravar({ ...atual, presencas: [...restantes, registro] });
  },

  registrarPagamento(ajuste: AjustePagamento): boolean {
    const atual = lerCaderno();
    const restantes = atual.pagamentos.filter(
      (item) => !(item.alunoId === ajuste.alunoId && item.competencia === ajuste.competencia),
    );
    return gravar({ ...atual, pagamentos: [...restantes, ajuste] });
  },

  definirContrato(contrato: ContratoMensalidade): boolean {
    const atual = lerCaderno();
    const restantes = atual.contratos.filter((item) => item.alunoId !== contrato.alunoId);
    return gravar({ ...atual, contratos: [...restantes, contrato] });
  },
};
