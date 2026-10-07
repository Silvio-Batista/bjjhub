"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useCheckins } from "@/contexts/checkin-context";
import { useAgora } from "@/contexts/relogio-context";
import { aulaService } from "@/services/aula-service";
import { formatarData } from "@/utils/datas";
import { rotuloProfessor } from "@/utils/formatacao";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

export function AulaDetalheScreen({ id }: { id: string }) {
  const agora = useAgora();
  const { confirmarPresenca, cancelarPresenca, estaConfirmada } = useCheckins();
  const [cancelarAberto, setCancelarAberto] = useState(false);

  if (!agora) return null;

  const aula = aulaService.buscar(id, agora);
  if (!aula) {
    return (
      <div>
        <AppHeader titulo="Aula" voltar />
        <EmptyState
          icone={CircleAlert}
          titulo="Aula não encontrada."
          descricao="Ela pode ter saído da grade desta demonstração."
        />
      </div>
    );
  }

  const confirmada = estaConfirmada(aula.id);
  const ocupadas = Math.min(aula.limiteAlunos, aula.inscritos + (confirmada ? 1 : 0));
  const vagas = Math.max(0, aula.limiteAlunos - ocupadas);
  const encerrada = aula.status === "encerrada";
  const cancelada = aula.status === "cancelada";
  const lotada = !confirmada && vagas === 0;

  return (
    <div>
      <AppHeader titulo="Aula" voltar />
      <PageBody>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[22px] leading-tight font-semibold">{aula.titulo}</h2>
            {cancelada ? (
              <StatusBadge tom="danger">Cancelada</StatusBadge>
            ) : confirmada ? (
              <StatusBadge tom="success">Confirmada</StatusBadge>
            ) : encerrada ? (
              <StatusBadge>Encerrada</StatusBadge>
            ) : null}
          </div>
          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Professor</dt>
              <dd className="text-right font-medium">
                {rotuloProfessor(aula.tratamento, aula.professor)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Horário</dt>
              <dd className="font-medium tabular-nums">
                {formatarData(aula.data)} · {aula.horarioInicio}–{aula.horarioFim}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Categoria</dt>
              <dd className="font-medium">{aula.categoria}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Vagas</dt>
              <dd className="font-medium">
                {vagas === 0 ? "Turma lotada" : `${vagas} ${vagas === 1 ? "vaga" : "vagas"}`}
                <span className="text-muted"> · {ocupadas}/{aula.limiteAlunos}</span>
              </dd>
            </div>
          </dl>
        </Card>

        {confirmada ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm font-medium text-success">Presença confirmada</p>
            <Button variante="secundario" onClick={() => setCancelarAberto(true)}>
              Cancelar presença
            </Button>
          </div>
        ) : (
          <Button
            disabled={cancelada || encerrada || lotada}
            onClick={() => confirmarPresenca(aula.id)}
          >
            {cancelada
              ? "Aula cancelada"
              : encerrada
                ? "Aula encerrada"
                : lotada
                  ? "Turma lotada"
                  : "Confirmar presença"}
          </Button>
        )}
      </PageBody>

      <ConfirmDialog
        aberto={cancelarAberto}
        titulo="Cancelar presença"
        descricao="Sua vaga nesta aula volta para a lista da recepção."
        confirmarRotulo="Cancelar presença"
        perigo
        onFechar={() => setCancelarAberto(false)}
        onConfirmar={() => cancelarPresenca(aula.id)}
      />
    </div>
  );
}
