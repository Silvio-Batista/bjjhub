import { cn } from "@/utils/cn";

const TONS = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-primary/15 text-primary",
  info: "bg-info/15 text-info",
  neutral: "bg-white/10 text-muted",
} as const;

export function StatusBadge({
  children,
  tom = "neutral",
}: {
  children: React.ReactNode;
  tom?: keyof typeof TONS;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold tracking-wide uppercase",
        TONS[tom],
      )}
    >
      {children}
    </span>
  );
}
