import { cn } from "@/utils/cn";

export function Interruptor({
  ligado,
  onChange,
  rotulo,
}: {
  ligado: boolean;
  onChange: (valor: boolean) => void;
  rotulo: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => onChange(!ligado)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors",
        ligado ? "bg-primary" : "border border-line bg-card-secondary",
      )}
    >
      <span
        className={cn(
          "block h-6 w-6 rounded-full bg-white transition-transform",
          ligado && "translate-x-5",
        )}
      />
    </button>
  );
}
