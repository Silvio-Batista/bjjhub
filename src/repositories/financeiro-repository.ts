import { mensalidades, pagamentos, plano } from "@/mocks/financeiro";
import type { Mensalidade, Pagamento, Plano } from "@/types";

export interface FinanceiroRepository {
  getPlano(): Plano;
  listarMensalidades(): Mensalidade[];
  listarPagamentos(): Pagamento[];
}

export class MockFinanceiroRepository implements FinanceiroRepository {
  getPlano(): Plano {
    return plano;
  }

  listarMensalidades(): Mensalidade[] {
    return mensalidades;
  }

  listarPagamentos(): Pagamento[] {
    return pagamentos;
  }
}

export const financeiroRepository: FinanceiroRepository =
  new MockFinanceiroRepository();
