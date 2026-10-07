"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { Splash } from "@/components/ui/Splash";
import { useAgora } from "@/contexts/relogio-context";
import { contarPorStatus, somarEmAberto } from "@/domain/equipe/resumo";
import { MolduraPagina, SeloMensalidade, TituloPagina } from "@/features/equipe/pecas";
import { equipeService } from "@/services/equipe-service";
import type { StatusMensalidade } from "@/types";
import { formatarCompetencia, formatarData } from "@/utils/datas";
import { formatarMoeda } from "@/utils/formatacao";
import { Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTROS: { id: StatusMensalidade | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "atrasado", rotulo: "Atrasados" },
  { id: "pendente", rotulo: "Pendentes" },
  { id: "pago", rotulo: "Pagos" },
];

export function PagamentosEquipeScreen() {
  const agora = useAgora();
  const [filtro, setFiltro] = useState<StatusMensalidade | "todos">("todos");
  const lancamentos = useMemo(
    () => (agora ? equipeService.listarPagamentos(agora) : []),
    [agora],
  );

  if (!agora) return <Splash />;

  const contagem = contarPorStatus(lancamentos.map((item) => item.status));
  const emAberto = somarEmAberto(
    lancamentos.map((item) => ({ status: item.status, valor: item.mensalidade.valor })),
  );
  const visiveis =
    filtro === "todos" ? lancamentos : lancamentos.filter((item) => item.status === filtro);
  const competencia = lancamentos[0]?.mensalidade.competencia;

  return (
    <MolduraPagina>
      <TituloPagina
        titulo="Pagamentos"
        descricao={
          competencia
            ? `${formatarCompetencia(competencia)} · ${formatarMoeda(emAberto)} em aberto`
            : "Nenhuma competência lançada"
        }
      />

      <p className="mb-4 text-sm text-muted">
        {contagem.atrasado} atrasados · {contagem.pendente} pendentes · {contagem.pago} pagos
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTROS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFiltro(item.id)}
            className={
              filtro === item.id
                ? "rounded-full bg-card px-3 py-1.5 text-sm text-ink"
                : "rounded-full px-3 py-1.5 text-sm text-muted"
            }
            aria-pressed={filtro === item.id}
          >
            {item.rotulo}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <EmptyState icone={Receipt} titulo="Nenhum lançamento neste filtro." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-bg-secondary text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Aluno</th>
                <th className="px-4 py-3 font-semibold">Plano</th>
                <th className="px-4 py-3 font-semibold">Valor</th>
                <th className="px-4 py-3 font-semibold">Vencimento</th>
                <th className="px-4 py-3 font-semibold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((item) => (
                <tr key={item.mensalidade.id} className="border-t border-line bg-card">
                  <td className="px-4 py-3">
                    <Link href={`/equipe/alunos/${item.alunoId}`} className="font-medium">
                      {item.nome}
                    </Link>
                    <span className="mt-0.5 block text-xs text-muted">{item.faixa}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{item.planoNome}</td>
                  <td className="px-4 py-3 tabular-nums">{formatarMoeda(item.mensalidade.valor)}</td>
                  <td className="px-4 py-3 text-muted">{formatarData(item.mensalidade.vencimento)}</td>
                  <td className="px-4 py-3">
                    <SeloMensalidade status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MolduraPagina>
  );
}
