"use client";

import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Splash } from "@/components/ui/Splash";
import { useAgora } from "@/contexts/relogio-context";
import { SeloMensalidade, MolduraPagina, TituloPagina } from "@/features/equipe/pecas";
import { aulaService } from "@/services/aula-service";
import { equipeService } from "@/services/equipe-service";
import { formatarData, formatarIso } from "@/utils/datas";
import { rotuloProfessor } from "@/utils/formatacao";
import { CalendarOff } from "lucide-react";
import Link from "next/link";

export function VisaoGeralScreen() {
  const agora = useAgora();
  if (!agora) return <Splash />;

  const resumo = equipeService.obterResumo(agora);
  const hoje = formatarIso(agora);
  const aulas = aulaService.listarPorDia(hoje, "Todas", agora);
  const atrasados = equipeService
    .listarAlunos(agora)
    .filter((aluno) => aluno.ativo && aluno.statusFinanceiro === "atrasado");

  return (
    <MolduraPagina>
      <TituloPagina
        titulo="Visão geral"
        descricao={`${formatarData(hoje)} · mesa da academia`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          rotulo="Alunos ativos"
          valor={String(resumo.alunosAtivos)}
          detalhe="Com matrícula em vigor"
          href="/equipe/alunos"
        />
        <StatCard
          rotulo="Em atraso"
          valor={String(resumo.pagamentosAtrasados)}
          detalhe={resumo.pagamentosAtrasados === 1 ? "Mensalidade vencida" : "Mensalidades vencidas"}
          tom={resumo.pagamentosAtrasados > 0 ? "danger" : "success"}
          href="/equipe/pagamentos"
        />
        <StatCard
          rotulo="Frequência média"
          valor={`${resumo.frequenciaMedia}%`}
          detalhe="Dos alunos ativos"
          tom={resumo.frequenciaMedia >= 75 ? "success" : "warning"}
        />
        <StatCard
          rotulo="Aulas hoje"
          valor={String(resumo.aulasHoje)}
          detalhe={resumo.aulasHoje === 1 ? "Turma na grade" : "Turmas na grade"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
            Grade de hoje
          </h2>
          {aulas.length === 0 ? (
            <EmptyState icone={CalendarOff} titulo="Nenhuma aula nesta data." />
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-line">
              {aulas.map((aula) => (
                <li
                  key={aula.id}
                  className="flex items-center justify-between gap-4 border-b border-line bg-card px-4 py-3 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">{aula.titulo}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {rotuloProfessor(aula.tratamento, aula.professor)}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums text-muted">
                    {aula.horarioInicio}–{aula.horarioFim}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
              Mensalidades vencidas
            </h2>
            <Link href="/equipe/pagamentos" className="text-xs text-muted">
              Ver pagamentos
            </Link>
          </div>
          {atrasados.length === 0 ? (
            <p className="rounded-2xl border border-line bg-card px-4 py-6 text-sm text-muted">
              Nenhuma mensalidade vencida entre os alunos ativos.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-line">
              {atrasados.map((aluno) => (
                <li key={aluno.id} className="border-b border-line bg-card last:border-b-0">
                  <Link
                    href={`/equipe/alunos/${aluno.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span>
                      <span className="block text-sm font-medium">{aluno.nome}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {aluno.faixa} · {aluno.planoNome}
                      </span>
                    </span>
                    <SeloMensalidade status={aluno.statusFinanceiro} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </MolduraPagina>
  );
}
