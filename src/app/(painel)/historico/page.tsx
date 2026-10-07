import { HistoricoScreen } from "@/features/historico/HistoricoScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Histórico" };

export default function Page() {
  return <HistoricoScreen />;
}
