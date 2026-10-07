import { cn } from "@/utils/cn";

const VARIANTES = {
  primario:
    "bg-primary text-white active:bg-primary-secondary disabled:opacity-40",
  secundario:
    "border border-line bg-card text-ink active:bg-card-secondary disabled:opacity-40",
  fantasma: "bg-transparent text-muted active:text-ink disabled:opacity-40",
  perigo:
    "border border-primary/40 bg-transparent text-primary active:bg-primary/10 disabled:opacity-40",
} as const;

export function Button({
  variante = "primario",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: keyof typeof VARIANTES;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-colors disabled:pointer-events-none",
        VARIANTES[variante],
        className,
      )}
      {...props}
    />
  );
}
