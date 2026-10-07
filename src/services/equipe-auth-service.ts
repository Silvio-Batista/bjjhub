import { CREDENCIAIS_EQUIPE } from "@/constants/app";
import { equipeRepository } from "@/repositories/equipe-repository";
import type { SessaoEquipe } from "@/types";
import { isoLocal } from "@/utils/datas";

export function autenticarEquipe(
  email: string,
  senha: string,
  agora: Date,
): { ok: true; sessao: SessaoEquipe } | { ok: false; erro: string } {
  const emailLimpo = email.trim().toLowerCase();
  if (!emailLimpo || !senha) {
    return { ok: false, erro: "Informe e-mail e senha." };
  }
  if (emailLimpo !== CREDENCIAIS_EQUIPE.email || senha !== CREDENCIAIS_EQUIPE.senha) {
    return {
      ok: false,
      erro: "E-mail ou senha incorretos. Confira os dados e tente de novo.",
    };
  }
  const sensei = equipeRepository.getSensei();
  return {
    ok: true,
    sessao: {
      senseiId: sensei.id,
      email: sensei.email,
      iniciadaEm: isoLocal(agora),
    },
  };
}
