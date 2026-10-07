import { CREDENCIAIS_DEMO } from "@/constants/app";
import type { Sessao } from "@/types";
import { isoLocal } from "@/utils/datas";

export function autenticar(
  email: string,
  senha: string,
  agora: Date,
): { ok: true; sessao: Sessao } | { ok: false; erro: string } {
  const emailLimpo = email.trim().toLowerCase();
  if (!emailLimpo || !senha) {
    return { ok: false, erro: "Informe e-mail e senha." };
  }
  if (emailLimpo !== CREDENCIAIS_DEMO.email || senha !== CREDENCIAIS_DEMO.senha) {
    return {
      ok: false,
      erro: "E-mail ou senha incorretos. Confira os dados e tente de novo.",
    };
  }
  return {
    ok: true,
    sessao: {
      alunoId: 1,
      email: CREDENCIAIS_DEMO.email,
      iniciadaEm: isoLocal(agora),
    },
  };
}
