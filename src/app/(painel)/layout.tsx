import { AppShell } from "@/components/layout/AppShell";
import { MolduraAluno } from "@/components/layout/MolduraAluno";

export const instant = false;

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <MolduraAluno>
      <AppShell>{children}</AppShell>
    </MolduraAluno>
  );
}
