import { EquipeShell } from "@/components/layout/EquipeShell";

export const instant = false;

export default function MesaLayout({ children }: { children: React.ReactNode }) {
  return <EquipeShell>{children}</EquipeShell>;
}
