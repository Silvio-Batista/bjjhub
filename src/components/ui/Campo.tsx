import { cn } from "@/utils/cn";
import { useId } from "react";

export function Campo({
  label,
  erro,
  dica,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  erro?: string;
  dica?: string;
}) {
  const gerado = useId();
  const campoId = id ?? gerado;

  return (
    <div className={className}>
      <label htmlFor={campoId} className="mb-1.5 block text-[13px] text-muted">
        {label}
      </label>
      <input
        id={campoId}
        className={cn(
          "h-12 w-full rounded-xl border border-line bg-bg px-3 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary disabled:opacity-60",
        )}
        {...props}
      />
      {dica ? <p className="mt-1.5 text-[12px] text-muted">{dica}</p> : null}
      {erro ? (
        <p className="mt-1.5 text-[12px] text-primary" role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
