import { VisaoGeralScreen } from "@/features/equipe/VisaoGeralScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Visão geral" };

export default function Page() {
  return <VisaoGeralScreen />;
}
