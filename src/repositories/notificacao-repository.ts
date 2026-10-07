import { notificacoes } from "@/mocks/notificacoes";
import type { Notificacao } from "@/types";

export interface NotificacaoRepository {
  listar(): Notificacao[];
}

export class MockNotificacaoRepository implements NotificacaoRepository {
  listar(): Notificacao[] {
    return notificacoes;
  }
}

export const notificacaoRepository: NotificacaoRepository =
  new MockNotificacaoRepository();
