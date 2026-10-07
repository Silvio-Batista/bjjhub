import type { Mensalidade, Pagamento, Plano } from "@/types";

export const plano: Plano = {
  id: "plano-adulto-mensal",
  nome: "Plano mensal adultos",
  valor: 100,
  periodicidade: "mensal",
};

export const mensalidades: Mensalidade[] = [
  {
    id: "m-2026-10",
    competencia: "2026-10",
    valor: 100,
    vencimento: "2026-10-06",
    pago: false,
  },
  {
    id: "m-2026-09",
    competencia: "2026-09",
    valor: 100,
    vencimento: "2026-09-06",
    pago: true,
    pagoEm: "2026-09-06",
    metodo: "Pix",
  },
  {
    id: "m-2026-08",
    competencia: "2026-08",
    valor: 100,
    vencimento: "2026-08-06",
    pago: true,
    pagoEm: "2026-08-06",
    metodo: "Pix",
  },
  {
    id: "m-2026-07",
    competencia: "2026-07",
    valor: 100,
    vencimento: "2026-07-06",
    pago: true,
    pagoEm: "2026-07-06",
    metodo: "Pix",
  },
];

export const pagamentos: Pagamento[] = [
  {
    id: "pag-2026-09",
    mensalidadeId: "m-2026-09",
    valor: 100,
    data: "2026-09-06",
    metodo: "Pix",
  },
  {
    id: "pag-2026-08",
    mensalidadeId: "m-2026-08",
    valor: 100,
    data: "2026-08-06",
    metodo: "Pix",
  },
  {
    id: "pag-2026-07",
    mensalidadeId: "m-2026-07",
    valor: 100,
    data: "2026-07-06",
    metodo: "Pix",
  },
];
