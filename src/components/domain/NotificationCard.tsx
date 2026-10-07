"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Notificacao, TipoNotificacao } from "@/types";
import { formatarDataHoraCurta } from "@/utils/datas";
import { Award, CalendarDays, Flag, Megaphone, Wallet } from "lucide-react";

const ICONES: Record<TipoNotificacao, typeof Wallet> = {
  PAGAMENTO: Wallet,
  AULA: CalendarDays,
  GRADUACAO: Award,
  COMUNICADO: Megaphone,
  EVENTO: Flag,
};

const TONS: Record<TipoNotificacao, "warning" | "info" | "danger" | "neutral" | "success"> = {
  PAGAMENTO: "warning",
  AULA: "info",
  GRADUACAO: "danger",
  COMUNICADO: "neutral",
  EVENTO: "success",
};

export function NotificationCard({
  notificacao,
  aberta,
  onAbrir,
  onLida,
  onArquivar,
  onExcluir,
}: {
  notificacao: Notificacao;
  aberta: boolean;
  onAbrir: () => void;
  onLida: (lida: boolean) => void;
  onArquivar: () => void;
  onExcluir: () => void;
}) {
  const Icone = ICONES[notificacao.tipo];

  return (
    <article className="rounded-2xl bg-card p-4">
      <button type="button" onClick={onAbrir} className="flex w-full gap-3 text-left">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card-secondary text-muted">
          <Icone size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="text-[15px] leading-5 font-semibold">{notificacao.titulo}</span>
            {!notificacao.lida && !notificacao.arquivada ? (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />
            ) : null}
          </span>
          <span className="mt-1 flex items-center gap-2">
            <StatusBadge tom={TONS[notificacao.tipo]}>{notificacao.tipo}</StatusBadge>
            <span className="text-[12px] text-muted">
              {formatarDataHoraCurta(notificacao.criadaEm)}
            </span>
          </span>
          <span className={aberta ? "mt-2 block text-sm leading-5 text-muted" : "mt-2 line-clamp-2 block text-sm leading-5 text-muted"}>
            {notificacao.mensagem}
          </span>
        </span>
      </button>
      {aberta ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          <button
            type="button"
            className="h-9 rounded-lg px-3 text-[13px] font-medium text-ink"
            onClick={() => onLida(!notificacao.lida)}
          >
            {notificacao.lida ? "Marcar como não lida" : "Marcar como lida"}
          </button>
          <button
            type="button"
            className="h-9 rounded-lg px-3 text-[13px] font-medium text-muted"
            onClick={onArquivar}
          >
            {notificacao.arquivada ? "Desarquivar" : "Arquivar"}
          </button>
          <button
            type="button"
            className="h-9 rounded-lg px-3 text-[13px] font-medium text-primary"
            onClick={onExcluir}
          >
            Excluir
          </button>
        </div>
      ) : null}
    </article>
  );
}
