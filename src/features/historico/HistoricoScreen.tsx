"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useCheckins } from "@/contexts/checkin-context";
import { useAgora } from "@/contexts/relogio-context";
import { montarHistorico } from "@/services/presenca-service";
import { cn } from "@/utils/cn";
import { MESES, competenciaDe, formatarDiaMes } from "@/utils/datas";
import { calcularFrequencia } from "@/utils/regras";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const TOM = {
  presente: "success",
  ausente: "danger",
  justificado: "warning",
} as const;

const TEXTO = {
  presente: "Presente",
  ausente: "Ausente",
  justificado: "Justificado",
} as const;

export function HistoricoScreen() {
  const agora = useAgora();
  const { checkins } = useCheckins();
  const [deslocamento, setDeslocamento] = useState(0);

  const historico = useMemo(() => montarHistorico(checkins), [checkins]);
  const competencia = useMemo(() => {
    if (!agora) return null;
    const data = new Date(agora.getFullYear(), agora.getMonth() + deslocamento, 1);
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
  }, [agora, deslocamento]);

  const doMes = useMemo(
    () => (competencia ? historico.filter((item) => competenciaDe(item.data) === competencia) : []),
    [historico, competencia],
  );

  if (!agora || !competencia) return null;

  const presencas = doMes.filter((item) => item.status === "presente").length;
  const faltas = doMes.filter((item) => item.status === "ausente").length;
  const frequencia = calcularFrequencia(presencas, faltas);
  const [ano, mes] = competencia.split("-").map(Number);

  return (
    <div>
      <AppHeader titulo="Histórico" voltar />
      <PageBody>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card"
            aria-label="Mês anterior"
            onClick={() => setDeslocamento((atual) => atual - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-sm font-medium">
            {MESES[(mes ?? 1) - 1]} {ano}
          </p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card"
            aria-label="Próximo mês"
            onClick={() => setDeslocamento((atual) => atual + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            ["Aulas", String(doMes.length)],
            ["Presenças", String(presencas)],
            ["Faltas", String(faltas)],
            ["Frequência", `${frequencia}%`],
          ].map(([rotulo, valor]) => (
            <Card key={rotulo} className="px-2 py-3 text-center">
              <p className="text-[18px] font-semibold tabular-nums">{valor}</p>
              <p className="mt-1 text-[10px] tracking-wide text-muted uppercase">{rotulo}</p>
            </Card>
          ))}
        </div>

        {doMes.length === 0 ? (
          <EmptyState icone={Calendar} titulo="Nenhuma aula lançada neste mês." />
        ) : (
          <div className="flex flex-col gap-3">
            {doMes.map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold">{item.titulo}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatarDiaMes(item.data)} · {item.horario}
                  </p>
                </div>
                <StatusBadge tom={TOM[item.status]}>{TEXTO[item.status]}</StatusBadge>
              </Card>
            ))}
          </div>
        )}
        <p className={cn("text-[12px] leading-5 text-muted")}>
          A frequência do mês considera presenças e faltas. Justificativas não entram na conta.
        </p>
      </PageBody>
    </div>
  );
}
