"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { BeltDisplay } from "@/components/ui/BeltDisplay";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAluno } from "@/contexts/aluno-context";
import { useAgora } from "@/contexts/relogio-context";
import { useIndicadores } from "@/hooks/useIndicadores";
import { graduacaoService } from "@/services/graduacao-service";
import { formatarData } from "@/utils/datas";
import { rotuloGrau } from "@/utils/formatacao";

export function GraduacaoScreen() {
  const agora = useAgora();
  const { perfil } = useAluno();
  const indicadores = useIndicadores(agora);
  const linha = graduacaoService.listar();

  if (!agora || !indicadores) return null;

  const progresso = indicadores.progresso;

  return (
    <div>
      <AppHeader titulo="Graduação" mostrarNotificacoes />
      <PageBody>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Trajetória na BJJHub Academy</p>
          <StatusBadge tom="success">Ativo</StatusBadge>
        </div>

        <Card>
          <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
            Faixa atual
          </p>
          <p className="mt-2 text-[22px] font-semibold">{perfil.faixa.nome}</p>
          <p className="mt-1 text-sm text-muted">
            Graduado em {formatarData(perfil.faixa.dataGraduacao)}
          </p>
          <div className="mt-4">
            <BeltDisplay nome={perfil.faixa.nome} grau={perfil.faixa.grau} tamanho="lg" />
          </div>
          <p className="mt-3 text-sm text-muted">
            {indicadores.diasNaFaixa} dias na faixa · {rotuloGrau(perfil.faixa.grau)}
          </p>
        </Card>

        <section>
          <SectionTitle>
            Requisitos para {perfil.faixa.nome} - {rotuloGrau(progresso.proximoGrau)}
          </SectionTitle>
          <Card className="mt-3 flex flex-col gap-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Tempo mínimo</span>
                <span className="tabular-nums">
                  {progresso.diasNaFaixa}/{progresso.diasNecessarios} dias
                </span>
              </div>
              <ProgressBar
                valor={progresso.progressoDias}
                rotulo="Tempo mínimo"
                completo={progresso.diasRestantes === 0}
              />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>Aulas mínimas</span>
                <span className="tabular-nums">
                  {progresso.aulasNaFaixa}/{progresso.aulasNecessarias}
                </span>
              </div>
              <ProgressBar
                valor={progresso.progressoAulas}
                rotulo="Aulas mínimas"
                completo={progresso.aulasRestantes === 0}
              />
            </div>
          </Card>
        </section>

        <Card>
          <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
            Próxima meta
          </p>
          <p className="mt-2 text-[18px] font-semibold">{progresso.rotuloProximo}</p>
          <p className="mt-2 text-sm leading-5 text-muted">
            Continue treinando com constância e evoluindo suas técnicas.
          </p>
          {progresso.elegivel ? (
            <p className="mt-3 text-sm font-medium text-success">Elegível para avaliação</p>
          ) : (
            <p className="mt-3 text-sm leading-5 text-ink">
              Faltam {progresso.diasRestantes}{" "}
              {progresso.diasRestantes === 1 ? "dia" : "dias"} e {progresso.aulasRestantes}{" "}
              {progresso.aulasRestantes === 1 ? "aula" : "aulas"}.
            </p>
          )}
          <p className="mt-3 text-[13px] leading-5 text-muted">
            Os requisitos são apenas indicadores. A graduação é definida pelo professor.
          </p>
        </Card>

        <section>
          <SectionTitle>Linha do tempo</SectionTitle>
          <ol className="mt-3 flex flex-col">
            {linha.map((marco, indice) => {
              const atual = indice === linha.length - 1;
              return (
                <li key={marco.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        atual
                          ? "mt-1 h-3 w-3 rounded-full bg-primary"
                          : "mt-1 h-3 w-3 rounded-full bg-line"
                      }
                    />
                    {indice < linha.length - 1 ? <span className="w-px flex-1 bg-line" /> : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-[15px] font-semibold">
                      {marco.grau === 0 ? `Faixa ${marco.faixa}` : marco.descricao}
                    </p>
                    <p className="text-[13px] text-muted">
                      {marco.grau === 0 ? "Início · " : ""}
                      {formatarData(marco.data)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </PageBody>
    </div>
  );
}
