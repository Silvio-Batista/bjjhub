import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { StatusMensalidade } from "@/types";
import { formatarCompetencia } from "@/utils/datas";
import { formatarMoeda } from "@/utils/formatacao";

const TOM: Record<StatusMensalidade, "success" | "warning" | "danger"> = {
  pago: "success",
  pendente: "warning",
  atrasado: "danger",
};

const TEXTO: Record<StatusMensalidade, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export function PaymentCard({
  competencia,
  valor,
  status,
}: {
  competencia: string;
  valor: number;
  status: StatusMensalidade;
}) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[15px] font-semibold">{formatarCompetencia(competencia)}</p>
        <p className="mt-1 text-sm text-muted tabular-nums">{formatarMoeda(valor)}</p>
      </div>
      <StatusBadge tom={TOM[status]}>{TEXTO[status]}</StatusBadge>
    </Card>
  );
}
