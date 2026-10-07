"use client";

import { PaymentCard } from "@/components/domain/PaymentCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAgora } from "@/contexts/relogio-context";
import { useCaderno } from "@/hooks/useCaderno";
import { financeiroService } from "@/services/financeiro-service";
import { formatarData } from "@/utils/datas";
import { formatarMoeda } from "@/utils/formatacao";
import { useMemo } from "react";

const TOM = {
  pago: "success",
  pendente: "warning",
  atrasado: "danger",
} as const;

const ROTULO = {
  pago: "Em dia",
  pendente: "Pendente",
  atrasado: "Atrasado",
} as const;

export function FinanceiroScreen() {
  const agora = useAgora();
  const caderno = useCaderno();
  const painel = useMemo(
    () => (agora ? financeiroService.obterPainel(agora, 1, caderno) : null),
    [agora, caderno],
  );

  if (!agora || !painel) return null;

  const { atual } = painel;

  return (
    <div>
      <AppHeader titulo="Financeiro" mostrarNotificacoes />
      <PageBody>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
                Situação
              </p>
              <p className="mt-2 text-[22px] font-semibold">{painel.plano.nome}</p>
            </div>
            <StatusBadge tom={TOM[atual.situacao.status]}>
              {ROTULO[atual.situacao.status]}
            </StatusBadge>
          </div>
          <p className="mt-4 text-[28px] font-semibold tabular-nums">
            {formatarMoeda(atual.valor)}
          </p>
          <p className="mt-1 text-sm text-muted">Mensalidade · vence em {formatarData(atual.vencimento)}</p>
          {painel.descontoAplicado > 0 ? (
            <p className="mt-1 text-sm text-muted">
              Valor base {formatarMoeda(painel.valorBase)} · desconto de{" "}
              {formatarMoeda(painel.descontoAplicado)}
            </p>
          ) : null}
          {painel.taxaGraduacao > 0 ? (
            <p className="mt-2 text-sm text-muted">
              Taxa de graduação {formatarMoeda(painel.taxaGraduacao)}. Informativa, sem cobrança.
            </p>
          ) : null}
          <p
            className={
              atual.situacao.acessoLiberado
                ? "mt-4 text-sm font-medium text-success"
                : "mt-4 text-sm font-medium text-primary"
            }
          >
            {atual.situacao.rotuloAcesso}
          </p>
          <p className="mt-1 text-sm leading-5 text-muted">{atual.situacao.mensagem}</p>
        </Card>

        <section>
          <SectionTitle>Próximo vencimento</SectionTitle>
          <Card className="mt-3">
            <p className="text-[18px] font-semibold">{formatarData(painel.proxima.vencimento)}</p>
            <p className="mt-1 text-sm text-muted">
              {formatarMoeda(painel.proxima.valor)} · {painel.proxima.situacao.rotuloAcesso}
            </p>
          </Card>
        </section>

        <section>
          <SectionTitle>Resumo</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Card>
              <p className="text-[12px] text-muted">Média mensal</p>
              <p className="mt-2 text-[18px] font-semibold tabular-nums">
                {formatarMoeda(painel.mediaMensal)}
              </p>
            </Card>
            <Card>
              <p className="text-[12px] text-muted">Método preferido</p>
              <p className="mt-2 text-[18px] font-semibold">{painel.metodoPreferido}</p>
            </Card>
            <Card>
              <p className="text-[12px] text-muted">Pagos</p>
              <p className="mt-2 text-[18px] font-semibold tabular-nums">{painel.pagos}</p>
            </Card>
            <Card>
              <p className="text-[12px] text-muted">Pendentes</p>
              <p className="mt-2 text-[18px] font-semibold tabular-nums">{painel.pendentes}</p>
            </Card>
          </div>
        </section>

        <section>
          <SectionTitle>Histórico</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {painel.mensalidades.map((item) => (
              <PaymentCard
                key={item.id}
                competencia={item.competencia}
                valor={item.valor}
                status={item.situacao.status}
              />
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-5 text-muted">
            Os pagamentos desta versão são apenas visuais. Nada é cobrado.
          </p>
        </section>
      </PageBody>
    </div>
  );
}
