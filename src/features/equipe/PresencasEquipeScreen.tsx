"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { Splash } from "@/components/ui/Splash";
import { useAgora } from "@/contexts/relogio-context";
import { MolduraPagina, SeloPresenca, TituloPagina } from "@/features/equipe/pecas";
import { equipeService } from "@/services/equipe-service";
import type { StatusPresenca } from "@/types";
import { formatarData } from "@/utils/datas";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTROS: { id: StatusPresenca | "todas"; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "presente", rotulo: "Presentes" },
  { id: "ausente", rotulo: "Ausências" },
  { id: "justificado", rotulo: "Justificadas" },
];

export function PresencasEquipeScreen() {
  const agora = useAgora();
  const [filtro, setFiltro] = useState<StatusPresenca | "todas">("todas");
  const linhas = useMemo(() => equipeService.listarPresencas(), []);

  if (!agora) return <Splash />;

  const visiveis =
    filtro === "todas" ? linhas : linhas.filter((item) => item.registro.status === filtro);

  return (
    <MolduraPagina>
      <TituloPagina
        titulo="Presenças"
        descricao="Chamadas lançadas. A frequência de cada aluno também considera o histórico anterior."
      />

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
        <EmptyState icone={ClipboardList} titulo="Nenhuma chamada neste filtro." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-bg-secondary text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Aluno</th>
                <th className="px-4 py-3 font-semibold">Aula</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((item) => (
                <tr key={item.id} className="border-t border-line bg-card">
                  <td className="px-4 py-3">
                    <Link href={`/equipe/alunos/${item.alunoId}`} className="font-medium">
                      {item.nome}
                    </Link>
                    <span className="mt-0.5 block text-xs text-muted">{item.faixa}</span>
                  </td>
                  <td className="px-4 py-3">
                    {item.registro.titulo}
                    <span className="mt-0.5 block text-xs text-muted">{item.registro.horario}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatarData(item.registro.data)}</td>
                  <td className="px-4 py-3">
                    <SeloPresenca status={item.registro.status} />
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
