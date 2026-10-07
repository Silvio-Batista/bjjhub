import { cn } from "@/utils/cn";

export function ProgressBar({
  valor,
  rotulo,
  completo = false,
}: {
  valor: number;
  rotulo: string;
  completo?: boolean;
}) {
  const percentual = Math.round(Math.min(1, Math.max(0, valor)) * 100);

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-card-secondary"
      role="progressbar"
      aria-valuenow={percentual}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rotulo}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          completo ? "bg-success" : "bg-primary",
        )}
        style={{ width: `${percentual}%` }}
      />
    </div>
  );
}
