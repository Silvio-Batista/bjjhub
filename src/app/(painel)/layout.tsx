import { AppShell } from "@/components/layout/AppShell";

export const instant = false;

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
