import { StatusBadge } from "@/components/ui/StatusBadge";
import { rotuloStatusMensalidade, rotuloStatusPresenca } from "@/domain/equipe/resumo";
import type { StatusMensalidade, StatusPresenca } from "@/types";

export function SeloMensalidade({ status }: { status: StatusMensalidade }) {
  const tom = status === "pago" ? "success" : status === "pendente" ? "warning" : "danger";
  return <StatusBadge tom={tom}>{rotuloStatusMensalidade(status)}</StatusBadge>;
}

export function SeloPresenca({ status }: { status: StatusPresenca }) {
  const tom = status === "presente" ? "success" : status === "ausente" ? "danger" : "info";
  return <StatusBadge tom={tom}>{rotuloStatusPresenca(status)}</StatusBadge>;
}

export function TituloPagina({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-[26px] font-semibold tracking-tight">{titulo}</h1>
      {descricao ? <p className="mt-1 text-sm text-muted">{descricao}</p> : null}
    </header>
  );
}

export function MolduraPagina({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>;
}

const CAMPO =
  "h-11 rounded-xl border border-line bg-bg px-3 text-sm text-ink outline-none focus:border-primary";

export function FiltroSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-[13px] text-muted">
      {label}
      <select className={CAMPO} value={value} onChange={(evento) => onChange(evento.target.value)}>
        {children}
      </select>
    </label>
  );
}

export function CampoBusca({
  value,
  onChange,
}: {
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <label className="flex min-w-[14rem] flex-[1.4] flex-col gap-1.5 text-[13px] text-muted">
      Buscar aluno
      <input
        className={CAMPO}
        value={value}
        placeholder="Nome"
        onChange={(evento) => onChange(evento.target.value)}
      />
    </label>
  );
}
