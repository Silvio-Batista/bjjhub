"use client";

import { Avatar } from "@/components/ui/Avatar";
import { BeltDisplay } from "@/components/ui/BeltDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { Splash } from "@/components/ui/Splash";
import { useAgora } from "@/contexts/relogio-context";
import { rotuloStatusPresenca } from "@/domain/equipe/resumo";
import { LancamentosEquipe } from "@/features/equipe/LancamentosEquipe";
import { MolduraPagina, SeloMensalidade, SeloPresenca } from "@/features/equipe/pecas";
import { useCaderno } from "@/hooks/useCaderno";
import { equipeService } from "@/services/equipe-service";
import { formatarCompetencia, formatarData } from "@/utils/datas";
import { formatarMoeda, rotuloFaixaGrau } from "@/utils/formatacao";
import { calcularStatusFinanceiro } from "@/utils/regras";
import { UserX } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function AlunoEquipeScreen({ alunoId }: { alunoId: number }) {
  const agora = useAgora();
  const caderno = useCaderno();
  const ficha = useMemo(
    () => (agora && Number.isFinite(alunoId) ? equipeService.obterAluno(alunoId, agora, caderno) : null),
    [agora, alunoId, caderno],
  );
  if (!agora) return <Splash />;
  if (!ficha) {
    return (
      <MolduraPagina>
        <EmptyState icone={UserX} titulo="Este aluno não está na lista." />
        <p className="text-center">
          <Link href="/equipe/alunos" className="text-sm text-muted">
            Voltar para alunos
          </Link>
        </p>
      </MolduraPagina>
    );
  }

  const { aluno, plano, resumo, mensalidades, presencasRecentes } = ficha;

  return (
    <MolduraPagina>
      <Link href="/equipe/alunos" className="text-xs text-muted">
        Alunos
      </Link>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
        <section className="w-full max-w-xl rounded-2xl border border-line bg-card p-5">
          <div className="flex items-start gap-4">
            <Avatar src={aluno.foto || undefined} nome={aluno.nome} tamanho={64} />
            <div className="min-w-0 flex-1">
              <h1 className="text-[24px] font-semibold tracking-tight">{aluno.nome}</h1>
              <p className="mt-1 text-sm text-muted">
                {resumo.ativo ? "Matrícula ativa" : "Matrícula inativa"} · {aluno.telefone}
              </p>
              <div className="mt-4 max-w-[220px]">
                <BeltDisplay nome={aluno.faixa.nome} grau={aluno.faixa.grau} />
              </div>
              <p className="mt-2 text-sm">{rotuloFaixaGrau(aluno.faixa.nome, aluno.faixa.grau)}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
            <div>
              <dt className="text-[11px] tracking-wide text-muted uppercase">Frequência</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{resumo.frequencia}%</dd>
              <dd className="text-xs text-muted">{resumo.rotuloFrequencia}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-wide text-muted uppercase">Presenças</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{resumo.presencas}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-wide text-muted uppercase">Faltas</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{resumo.ausencias}</dd>
            </div>
          </dl>
        </section>

        <section className="w-full max-w-xl rounded-2xl border border-line bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Plano</h2>
              <p className="mt-1 text-sm text-muted">{plano.nome}</p>
              <p className="mt-2 text-lg font-semibold tabular-nums">
                {formatarMoeda(ficha.valorMensalidade.liquido)}
              </p>
              <p className="text-xs text-muted">
                por mês
                {ficha.valorMensalidade.descontoAplicado > 0
                  ? ` · desconto de ${formatarMoeda(ficha.valorMensalidade.descontoAplicado)}`
                  : ""}
              </p>
              {ficha.contrato.taxaGraduacao > 0 ? (
                <p className="mt-2 text-sm text-muted">
                  Taxa de graduação {formatarMoeda(ficha.contrato.taxaGraduacao)}, informativa.
                </p>
              ) : null}
            </div>
            <SeloMensalidade status={resumo.statusFinanceiro} />
          </div>
          <p className="mt-4 text-sm text-muted">
            Competência {formatarCompetencia(resumo.competencia)}
            {resumo.vencimento ? ` · vence em ${formatarData(resumo.vencimento)}` : ""}
          </p>
          {resumo.valorEmAberto > 0 ? (
            <p className="mt-2 text-sm">Em aberto: {formatarMoeda(resumo.valorEmAberto)}</p>
          ) : (
            <p className="mt-2 text-sm text-muted">Nada em aberto nesta competência.</p>
          )}
        </section>
      </div>

      <LancamentosEquipe ficha={ficha} agora={agora} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
          Chamadas recentes
        </h2>
        {presencasRecentes.length === 0 ? (
          <p className="rounded-2xl border border-line bg-card px-4 py-6 text-sm text-muted">
            Nenhuma chamada lançada para este aluno.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-line">
            {presencasRecentes.map((registro) => (
              <li
                key={registro.id}
                className="flex items-center justify-between gap-3 border-b border-line bg-card px-4 py-3 last:border-b-0"
              >
                <span>
                  <span className="block text-sm font-medium">{registro.titulo}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {formatarData(registro.data)} · {registro.horario} ·{" "}
                    {rotuloStatusPresenca(registro.status)}
                  </span>
                </span>
                <SeloPresenca status={registro.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 max-w-3xl">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
          Mensalidades
        </h2>
        <ul className="overflow-hidden rounded-2xl border border-line">
          {mensalidades.map((item) => {
            const situacao = calcularStatusFinanceiro(item, agora);
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-line bg-card px-4 py-3 last:border-b-0"
              >
                <span>
                  <span className="block text-sm font-medium">
                    {formatarCompetencia(item.competencia)}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {formatarMoeda(item.valor)} · vence {formatarData(item.vencimento)}
                    {item.pago && item.pagoEm ? ` · pago em ${formatarData(item.pagoEm)}` : ""}
                  </span>
                </span>
                <SeloMensalidade status={situacao.status} />
              </li>
            );
          })}
        </ul>
      </section>
    </MolduraPagina>
  );
}
