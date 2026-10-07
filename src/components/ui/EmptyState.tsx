import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icone: Icone,
  titulo,
  descricao,
  ilustracao,
}: {
  icone?: LucideIcon;
  titulo: string;
  descricao?: string;
  ilustracao?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {ilustracao ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ilustracao} alt="" className="mb-4 h-24 w-24" />
      ) : null}
      {Icone ? (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-muted">
          <Icone size={26} strokeWidth={1.75} />
        </span>
      ) : null}
      <p className="text-[15px] leading-6 text-ink">{titulo}</p>
      {descricao ? <p className="mt-2 text-sm leading-5 text-muted">{descricao}</p> : null}
    </div>
  );
}
