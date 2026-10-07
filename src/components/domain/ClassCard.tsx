import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Aula } from "@/types";
import { rotuloDiaRelativo } from "@/utils/datas";
import { rotuloProfessor } from "@/utils/formatacao";
import Link from "next/link";

export function ClassCard({
  aula,
  referencia,
  confirmada = false,
}: {
  aula: Aula;
  referencia: Date;
  confirmada?: boolean;
}) {
  return (
    <Link href={`/aulas/${aula.id}`} className="block active:opacity-80">
      <Card className="flex gap-3">
        <div className="w-[4.5rem] shrink-0">
          <p className="text-[15px] font-semibold tabular-nums">{aula.horarioInicio}</p>
          <p className="text-[12px] text-muted tabular-nums">{aula.horarioFim}</p>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[15px] leading-5 font-semibold">{aula.titulo}</p>
            {aula.status === "cancelada" ? (
              <StatusBadge tom="danger">Cancelada</StatusBadge>
            ) : confirmada ? (
              <StatusBadge tom="success">Confirmada</StatusBadge>
            ) : aula.status === "encerrada" ? (
              <StatusBadge>Encerrada</StatusBadge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">
            {rotuloProfessor(aula.tratamento, aula.professor)}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {rotuloDiaRelativo(aula.data, referencia)} · {aula.categoria}
          </p>
        </div>
      </Card>
    </Link>
  );
}
