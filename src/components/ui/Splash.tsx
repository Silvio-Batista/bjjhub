import { LogoMark } from "@/components/brand/Logo";

export function Splash() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg">
      <LogoMark size={56} />
      <p className="text-sm tracking-wide text-muted">BJJHub</p>
    </div>
  );
}
