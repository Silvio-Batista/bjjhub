import { cn } from "@/utils/cn";
import Link from "next/link";

export function StatCard({
  rotulo,
  valor,
  detalhe,
  tom = "muted",
  href,
}: {
  rotulo: string;
  valor: string;
  detalhe?: string;
  tom?: "success" | "warning" | "danger" | "muted";
  href?: string;
}) {
  const cores = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-primary",
    muted: "text-muted",
  };

  const conteudo = (
    <div className="flex h-full flex-col rounded-2xl bg-card px-4 py-4">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
        {rotulo}
      </p>
      <p className="mt-3 text-[30px] leading-none font-semibold tabular-nums">{valor}</p>
      {detalhe ? (
        <p className={cn("mt-2 text-sm font-medium", cores[tom])}>{detalhe}</p>
      ) : (
        <span className="mt-2 h-5" />
      )}
    </div>
  );

  if (!href) return conteudo;

  return (
    <Link href={href} className="block rounded-2xl active:opacity-80">
      {conteudo}
    </Link>
  );
}
