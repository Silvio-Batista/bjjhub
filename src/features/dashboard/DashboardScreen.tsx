"use client";

import { ClassCard } from "@/components/domain/ClassCard";
import { PageBody } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { BeltDisplay } from "@/components/ui/BeltDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MobileModal } from "@/components/ui/MobileModal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCard } from "@/components/ui/StatCard";
import { useAluno } from "@/contexts/aluno-context";
import { useCheckins } from "@/contexts/checkin-context";
import { useNotificacoes } from "@/contexts/notificacoes-context";
import { useAgora } from "@/contexts/relogio-context";
import { useIndicadores } from "@/hooks/useIndicadores";
import { aulaService } from "@/services/aula-service";
import { descreverTempo } from "@/utils/datas";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function DashboardScreen() {
  const agora = useAgora();
  const { perfil } = useAluno();
  const { naoLidas } = useNotificacoes();
  const { confirmacoes } = useCheckins();
  const [estudosAberto, setEstudosAberto] = useState(false);

  const indicadores = useIndicadores(agora);
  const proximas = useMemo(
    () => (agora ? aulaService.listarProximas(agora, 2) : []),
    [agora],
  );

  if (!agora || !indicadores) return null;

  const tomFrequencia =
    indicadores.rotuloFrequencia === "Boa"
      ? "success"
      : indicadores.rotuloFrequencia === "Regular"
        ? "warning"
        : "danger";

  return (
    <div>
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/perfil" aria-label="Abrir perfil" className="shrink-0">
          <Avatar src={perfil.foto} nome={perfil.nome} tamanho={56} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] leading-tight font-semibold">{perfil.nome}</p>
          <p className="mt-1 text-[13px] text-muted">
            {descreverTempo(perfil.dataMatricula, agora)} na academia
          </p>
          <div className="mt-2 max-w-[9.5rem]">
            <BeltDisplay nome={perfil.faixa.nome} grau={perfil.faixa.grau} tamanho="sm" />
          </div>
        </div>
        <Link
          href="/notificacoes"
          className="relative flex h-11 w-11 items-center justify-center"
          aria-label={
            naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : "Notificações"
          }
        >
          <Bell size={22} />
          {naoLidas > 0 ? (
            <span className="absolute top-0.5 right-0 min-w-5 rounded-full bg-primary px-1 text-center text-[10px] leading-5 font-semibold text-white">
              {naoLidas > 99 ? "99+" : naoLidas}
            </span>
          ) : null}
        </Link>
      </header>

      <PageBody>
        <div className="grid grid-cols-2 gap-3">
          <StatCard rotulo="Total de aulas" valor={String(indicadores.totalAulas)} />
          <StatCard
            rotulo="Frequência"
            valor={`${indicadores.frequencia}%`}
            detalhe={indicadores.rotuloFrequencia}
            tom={tomFrequencia}
            href="/historico"
          />
        </div>

        <section className="rounded-2xl bg-card p-4">
          <SectionTitle>Progresso da faixa</SectionTitle>
          <p className="mt-3 text-[18px] font-semibold">{indicadores.progresso.rotuloAtual}</p>
          <div className="mt-3">
            <BeltDisplay nome={perfil.faixa.nome} grau={perfil.faixa.grau} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {indicadores.diasNaFaixa}{" "}
            {indicadores.diasNaFaixa === 1 ? "dia" : "dias"} na faixa atual
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <div>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="text-muted">Tempo</span>
                <span className="tabular-nums">
                  {indicadores.progresso.diasNaFaixa}/{indicadores.progresso.diasNecessarios} dias
                </span>
              </div>
              <ProgressBar
                valor={indicadores.progresso.progressoDias}
                rotulo="Tempo na faixa"
                completo={indicadores.progresso.diasRestantes === 0}
              />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="text-muted">Aulas</span>
                <span className="tabular-nums">
                  {indicadores.progresso.aulasNaFaixa}/{indicadores.progresso.aulasNecessarias}
                </span>
              </div>
              <ProgressBar
                valor={indicadores.progresso.progressoAulas}
                rotulo="Aulas na faixa"
                completo={indicadores.progresso.aulasRestantes === 0}
              />
            </div>
          </div>

          {indicadores.progresso.elegivel ? (
            <p className="mt-4 text-sm font-medium text-success">Elegível para avaliação</p>
          ) : (
            <p className="mt-4 text-sm leading-5 text-muted">
              Faltam {indicadores.progresso.diasRestantes} dias e{" "}
              {indicadores.progresso.aulasRestantes} aulas para o indicador de{" "}
              {indicadores.progresso.rotuloProximo}.
            </p>
          )}
          <Link href="/graduacao" className="mt-3 inline-flex text-sm font-medium text-ink">
            Ver graduação
          </Link>
        </section>

        <button
          type="button"
          onClick={() => setEstudosAberto(true)}
          className="rounded-2xl border border-line bg-[#250930] p-4 text-left"
        >
          <p className="text-[12px] font-semibold tracking-[0.08em] text-[#A44850] uppercase">
            BJJHub Estudos
          </p>
          <p className="mt-2 text-[18px] font-semibold">Acelere sua evolução!</p>
          <p className="mt-2 text-sm leading-5 text-muted">
            Acesse conteúdos exclusivos, técnicas e materiais preparados para ajudar na sua
            evolução.
          </p>
          <span className="mt-3 inline-flex rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink">
            Novos conteúdos toda semana
          </span>
        </button>

        <section>
          <SectionTitle
            acao={
              <Link href="/aulas" className="text-sm font-medium text-ink">
                Ver todas
              </Link>
            }
          >
            Próximas aulas
          </SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            {proximas.length === 0 ? (
              <Card>
                <p className="text-sm text-muted">Nenhuma aula prevista a partir de agora.</p>
              </Card>
            ) : (
              proximas.map((aula) => (
                <ClassCard
                  key={aula.id}
                  aula={aula}
                  referencia={agora}
                  confirmada={confirmacoes.includes(aula.id)}
                />
              ))
            )}
          </div>
        </section>
      </PageBody>

      <MobileModal
        aberto={estudosAberto}
        titulo="BJJHub Estudos"
        onFechar={() => setEstudosAberto(false)}
      >
        <p className="text-sm leading-6 text-muted">
          Os conteúdos exclusivos da academia ainda não estão nesta versão. O mural da
          recepção segue com o material da semana.
        </p>
        <Button className="mt-5" onClick={() => setEstudosAberto(false)}>
          Fechar
        </Button>
      </MobileModal>
    </div>
  );
}
