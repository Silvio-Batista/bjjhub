"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Splash } from "@/components/ui/Splash";
import { ORDEM_FAIXAS } from "@/constants/app";
import { useAgora } from "@/contexts/relogio-context";
import { filtrarResumoAlunos } from "@/domain/equipe/resumo";
import {
  CampoBusca,
  FiltroSelect,
  MolduraPagina,
  SeloMensalidade,
  TituloPagina,
} from "@/features/equipe/pecas";
import { equipeService } from "@/services/equipe-service";
import type { FaixaNome, StatusMensalidade } from "@/types";
import { rotuloGrau } from "@/utils/formatacao";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function AlunosEquipeScreen() {
  const agora = useAgora();
  const [busca, setBusca] = useState("");
  const [faixa, setFaixa] = useState<FaixaNome | "todas">("todas");
  const [status, setStatus] = useState<StatusMensalidade | "todos">("todos");
  const [somenteAtivos, setSomenteAtivos] = useState(true);

  const alunos = useMemo(() => (agora ? equipeService.listarAlunos(agora) : []), [agora]);
  const visiveis = useMemo(
    () => filtrarResumoAlunos(alunos, { busca, faixa, status, somenteAtivos }),
    [alunos, busca, faixa, status, somenteAtivos],
  );

  if (!agora) return <Splash />;

  return (
    <MolduraPagina>
      <TituloPagina
        titulo="Alunos"
        descricao={`${visiveis.length} ${visiveis.length === 1 ? "aluno na lista" : "alunos na lista"}`}
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <CampoBusca value={busca} onChange={setBusca} />
        <FiltroSelect label="Faixa" value={faixa} onChange={(valor) => setFaixa(valor as FaixaNome | "todas")}>
          <option value="todas">Todas</option>
          {ORDEM_FAIXAS.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </FiltroSelect>
        <FiltroSelect
          label="Financeiro"
          value={status}
          onChange={(valor) => setStatus(valor as StatusMensalidade | "todos")}
        >
          <option value="todos">Todos</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="atrasado">Atrasado</option>
        </FiltroSelect>
        <label className="flex h-11 items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={somenteAtivos}
            onChange={(evento) => setSomenteAtivos(evento.target.checked)}
          />
          Somente ativos
        </label>
      </div>

      {visiveis.length === 0 ? (
        <EmptyState
          icone={SearchX}
          titulo="Nenhum aluno com esses filtros."
          descricao="Limpe a busca ou troque a faixa e a situação financeira."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-bg-secondary text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Aluno</th>
                <th className="px-4 py-3 font-semibold">Faixa</th>
                <th className="px-4 py-3 font-semibold">Frequência</th>
                <th className="px-4 py-3 font-semibold">Plano</th>
                <th className="px-4 py-3 font-semibold">Financeiro</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((aluno) => (
                <tr key={aluno.id} className="border-t border-line bg-card">
                  <td className="px-4 py-3">
                    <Link href={`/equipe/alunos/${aluno.id}`} className="flex items-center gap-3">
                      <Avatar nome={aluno.nome} tamanho={36} />
                      <span>
                        <span className="block font-medium">{aluno.nome}</span>
                        {aluno.ativo ? null : (
                          <span className="text-xs text-muted">Matrícula inativa</span>
                        )}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {aluno.faixa} · {rotuloGrau(aluno.grau)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {aluno.frequencia}%
                    <span className="ml-2 text-xs text-muted">{aluno.rotuloFrequencia}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{aluno.planoNome}</td>
                  <td className="px-4 py-3">
                    <SeloMensalidade status={aluno.statusFinanceiro} />
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
