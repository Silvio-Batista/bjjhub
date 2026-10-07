"use client";

import { ClassCard } from "@/components/domain/ClassCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIAS_AULA, type FiltroAula } from "@/constants/app";
import { useCheckins } from "@/contexts/checkin-context";
import { useAgora } from "@/contexts/relogio-context";
import { aulaService } from "@/services/aula-service";
import { cn } from "@/utils/cn";
import {
  DIAS_CURTOS,
  adicionarDias,
  formatarIntervaloSemana,
  formatarIso,
  inicioDaSemana,
  inicioDoDia,
  parseData,
} from "@/utils/datas";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export function AulasScreen() {
  const agora = useAgora();
  const { confirmacoes } = useCheckins();
  const [deslocamento, setDeslocamento] = useState(0);
  const [diaManual, setDiaManual] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroAula>("Todas");

  const semanaIso = agora
    ? formatarIso(adicionarDias(inicioDaSemana(agora), deslocamento * 7))
    : null;

  const dias = useMemo(() => {
    if (!semanaIso) return [];
    const inicio = parseData(semanaIso);
    return Array.from({ length: 7 }, (_, indice) => adicionarDias(inicio, indice));
  }, [semanaIso]);

  const diaIso = useMemo(() => {
    if (!semanaIso || !agora) return null;
    const inicio = parseData(semanaIso);
    const fim = adicionarDias(inicio, 6);
    if (diaManual) {
      const manual = parseData(diaManual);
      if (manual >= inicio && manual <= fim) return diaManual;
    }
    const hoje = inicioDoDia(agora);
    if (hoje >= inicio && hoje <= fim) return formatarIso(agora);
    return semanaIso;
  }, [semanaIso, agora, diaManual]);

  const aulas = useMemo(() => {
    if (!agora || !diaIso) return [];
    return aulaService.listarPorDia(diaIso, filtro, agora);
  }, [agora, diaIso, filtro]);

  if (!agora || !semanaIso || !diaIso) return null;

  return (
    <div>
      <AppHeader titulo="Aulas" mostrarNotificacoes />
      <PageBody>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card"
            aria-label="Semana anterior"
            onClick={() => setDeslocamento((atual) => atual - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-sm font-medium">{formatarIntervaloSemana(parseData(semanaIso))}</p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card"
            aria-label="Próxima semana"
            onClick={() => setDeslocamento((atual) => atual + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia) => {
            const iso = formatarIso(dia);
            const selecionado = iso === diaIso;
            const hoje = iso === formatarIso(agora);
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setDiaManual(iso)}
                className="flex flex-col items-center gap-1 py-1"
                aria-pressed={selecionado}
                aria-label={`${DIAS_CURTOS[dia.getDay()]} ${dia.getDate()}`}
              >
                <span className="text-[11px] text-muted">{DIAS_CURTOS[dia.getDay()]}</span>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                    selecionado && "bg-primary text-white",
                    !selecionado && hoje && "ring-1 ring-primary text-ink",
                    !selecionado && !hoje && "text-ink",
                  )}
                >
                  {dia.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {CATEGORIAS_AULA.map((categoria) => {
            const ativo = filtro === categoria;
            return (
              <button
                key={categoria}
                type="button"
                onClick={() => setFiltro(categoria)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3 text-[13px] font-medium",
                  ativo ? "bg-primary text-white" : "bg-card text-muted",
                )}
              >
                {categoria}
              </button>
            );
          })}
        </div>

        {aulas.length === 0 ? (
          <EmptyState icone={Calendar} titulo="Nenhuma aula encontrada para este dia." />
        ) : (
          <div className="flex flex-col gap-3">
            {aulas.map((aula) => (
              <ClassCard
                key={aula.id}
                aula={aula}
                referencia={agora}
                confirmada={confirmacoes.includes(aula.id)}
              />
            ))}
          </div>
        )}
      </PageBody>
    </div>
  );
}
