import assert from "node:assert/strict";
import { aulaService } from "../src/services/aula-service";
import { financeiroService } from "../src/services/financeiro-service";
import { notificacaoService } from "../src/services/notificacao-service";
import { jaPresente, resumirPresencas } from "../src/services/presenca-service";
import { aulaRepository } from "../src/repositories/aula-repository";
import type { Checkin } from "../src/types";
import {
  calcularDiasNaFaixa,
  calcularFrequencia,
  calcularProgressoGraduacao,
  calcularStatusFinanceiro,
} from "../src/utils/regras";

const hoje = new Date(2026, 9, 7, 11, 20, 0);

assert.equal(calcularDiasNaFaixa("2026-08-06", hoje), 62);
assert.equal(calcularFrequencia(58, 16), 78);
assert.equal(
  calcularStatusFinanceiro({ pago: false, vencimento: "2026-10-06" }, hoje).status,
  "atrasado",
);
assert.equal(
  calcularStatusFinanceiro({ pago: false, vencimento: "2026-10-06" }, hoje).mensagem,
  "Mensalidade em atraso. Regularize sua situação.",
);
assert.equal(
  calcularProgressoGraduacao({
    faixa: "Azul",
    grau: 0,
    diasNaFaixa: 62,
    aulasNaFaixa: 20,
  }).elegivel,
  false,
);

const resumo = resumirPresencas([], hoje);
assert.equal(resumo.totalAulas, 58);
assert.equal(resumo.frequencia, 78);
assert.equal(resumo.rotuloFrequencia, "Boa");
assert.equal(resumo.aulasNaFaixa, 20);
assert.equal(resumo.diasNaFaixa, 62);
assert.equal(resumo.progresso.aulasNecessarias, 36);
assert.equal(resumo.progresso.diasNecessarios, 365);

const checkin: Checkin = {
  id: "chk-teste",
  aulaId: "2026-10-07-no-gi",
  alunoId: 1,
  academiaId: 1,
  academiaNome: "BJJHub Academy",
  data: "2026-10-07",
  hora: "11:21",
  tituloAula: "No-Gi",
  categoria: "No-Gi",
  horarioAula: "09:00",
};

const depois = resumirPresencas([checkin], hoje);
assert.equal(depois.totalAulas, 59);
assert.equal(depois.aulasNaFaixa, 21);
assert.equal(
  depois.historico.some((item) => item.aulaId === "2026-10-07-no-gi" && item.status === "presente"),
  true,
);
assert.equal(jaPresente("2026-10-07-jiu-jitsu-adulto", [], resumirPresencas([], hoje).historico), true);
assert.equal(jaPresente("2026-10-07-no-gi", [checkin], []), true);

const painel = financeiroService.obterPainel(hoje);
assert.equal(painel.atual.situacao.status, "atrasado");
assert.equal(painel.atual.situacao.acessoLiberado, false);
assert.equal(painel.pagos, 3);
assert.equal(painel.pendentes, 1);
assert.equal(painel.metodoPreferido, "Pix");
assert.equal(painel.mediaMensal, 100);

const naoLidas = notificacaoService
  .listar()
  .filter((item) => !item.lida && !item.arquivada).length;
assert.equal(naoLidas, 31);

assert.ok(aulaRepository.buscar("2026-10-07-jiu-jitsu-adulto"));
assert.ok(aulaRepository.buscar("2026-10-05-open-mat"));
assert.ok(aulaRepository.buscar("2026-10-03-jiu-jitsu-adulto"));

const proximas = aulaService.listarProximas(hoje, 2);
assert.equal(proximas[0]?.id, "2026-10-07-jiu-jitsu-adulto");
assert.equal(proximas[0]?.horarioInicio, "19:00");
assert.equal(proximas[1]?.id, "2026-10-08-fundamentos");
assert.equal(proximas[1]?.horarioInicio, "18:00");

const sugerida = aulaService.sugerirCheckin(hoje, [], ["2026-10-07-jiu-jitsu-adulto"]);
assert.equal(sugerida?.id, "2026-10-07-no-gi");

console.log("regras ok");
